import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";

import { rollSeeds, OFFERS } from "./lib/seeds.js";
import {
  personaGenerationPrompt,
  PERSONA_SCHEMA,
  roleplaySystemPrompt,
  feedbackPrompt,
  FEEDBACK_SCHEMA,
} from "./lib/prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.warn(
    "\n  ⚠️  No ANTHROPIC_API_KEY found. Copy .env.example to .env and add your key.\n      The UI will load, but calls will fail until the key is set.\n"
  );
}
const client = new Anthropic({ apiKey: API_KEY || "missing-key" });
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
const PORT = process.env.PORT || 3000;

// Optional: ElevenLabs for natural prospect voices (voice mode).
// Without a key, the UI falls back to the browser's built-in voices.
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// flash = lowest latency (~half of turbo); good quality for conversational use.
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5";

// In-memory session store. { id -> { persona, offer, difficulty, messages, ended } }
const sessions = new Map();

// ---------------------------------------------------------------------------
// Transcript calibration: drop .txt/.md files into ./transcripts and excerpts
// get injected into persona generation + roleplay prompts.
// ---------------------------------------------------------------------------
function loadTranscriptExcerpts(maxChars = 12000) {
  const dir = path.join(__dirname, "transcripts");
  let out = "";
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(txt|md)$/i.test(f))
      .sort();
    for (const f of files) {
      if (out.length >= maxChars) break;
      const text = fs.readFileSync(path.join(dir, f), "utf8").trim();
      if (!text) continue;
      const room = maxChars - out.length;
      out += `\n--- excerpt from ${f} ---\n${text.slice(0, room)}\n`;
    }
  } catch {
    /* no transcripts dir or unreadable — fine */
  }
  return out.trim() || null;
}

function extractText(response) {
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}

function transcriptString(messages) {
  return messages
    .map((m) => `${m.role === "user" ? "REP" : "PROSPECT"}: ${m.content}`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// POST /api/session  { offer?: string, difficulty?: "open"|"reserved"|"guarded" }
// Generates a fresh randomized prospect and returns only what a rep would
// realistically know pre-call. Full persona stays server-side.
// ---------------------------------------------------------------------------
app.post("/api/session", async (req, res) => {
  try {
    const { offer: offerKey, difficulty = "reserved" } = req.body || {};
    const seeds = rollSeeds(offerKey, difficulty);
    const transcriptExcerpts = loadTranscriptExcerpts();

    const gen = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: PERSONA_SCHEMA },
      },
      messages: [
        { role: "user", content: personaGenerationPrompt(seeds, transcriptExcerpts) },
      ],
    });

    const persona = JSON.parse(extractText(gen));
    const id = crypto.randomUUID();
    const session = {
      id,
      persona,
      offer: seeds.offer,
      difficulty,
      transcriptExcerpts,
      // Rapport/framing is skipped — the rep opens with the intent question,
      // so the conversation starts empty and the REP speaks first.
      messages: [],
      ended: false,
      createdAt: Date.now(),
    };
    sessions.set(id, session);

    res.json({
      sessionId: id,
      // What the rep realistically sees from the calendar booking:
      leadCard: {
        name: persona.name,
        offer: seeds.offer.label,
        source: "Booked via funnel — application call",
      },
      difficulty,
      ready: true,
      calibratedWithTranscripts: Boolean(transcriptExcerpts),
    });
  } catch (err) {
    console.error("session create failed:", err);
    res.status(500).json({ error: err.message || "Failed to create session" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/session/:id/message  { text: string }
// ---------------------------------------------------------------------------
app.post("/api/session/:id/message", async (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  if (session.ended) return res.status(400).json({ error: "Call already ended" });

  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "Empty message" });

  try {
    session.messages.push({ role: "user", content: text });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: roleplaySystemPrompt(
            session.persona,
            session.offer,
            session.difficulty,
            session.transcriptExcerpts
          ),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: session.messages,
    });

    let reply = extractText(response).trim();
    let ended = false;
    if (reply.includes("[CALL_ENDED]")) {
      ended = true;
      reply = reply.replace(/\s*\[CALL_ENDED\]\s*/g, "").trim();
      session.ended = true;
    }

    session.messages.push({ role: "assistant", content: reply });
    res.json({ reply, ended });
  } catch (err) {
    console.error("message failed:", err);
    // roll back the rep message so a retry doesn't double it
    if (session.messages.at(-1)?.role === "user") session.messages.pop();
    res.status(500).json({ error: err.message || "Failed to get reply" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/session/:id/feedback
// Ends the call (if live) and grades the full transcript against the
// discovery framework. Reveals the hidden persona.
// ---------------------------------------------------------------------------
app.post("/api/session/:id/feedback", async (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const repTurns = session.messages.filter((m) => m.role === "user").length;
  if (repTurns < 2) {
    return res
      .status(400)
      .json({ error: "Have at least a short conversation before requesting feedback." });
  }

  try {
    const wasEndedByProspect = session.ended;
    session.ended = true;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: FEEDBACK_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: feedbackPrompt(
            session.persona,
            session.offer,
            transcriptString(session.messages),
            wasEndedByProspect
          ),
        },
      ],
    });

    const feedback = JSON.parse(extractText(response));
    res.json({ feedback, persona: session.persona });
  } catch (err) {
    console.error("feedback failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate feedback" });
  }
});

app.get("/api/offers", (_req, res) => {
  res.json(
    Object.entries(OFFERS).map(([key, o]) => ({ key, label: o.label }))
  );
});

// ---------------------------------------------------------------------------
// GET /api/voices
// Lists ElevenLabs voices for the prospect-voice picker. If no key is
// configured, returns provider: "browser" so the UI falls back to the
// built-in Web Speech voices.
// ---------------------------------------------------------------------------
app.get("/api/voices", async (_req, res) => {
  if (!ELEVENLABS_API_KEY) return res.json({ provider: "browser", voices: [] });

  try {
    const r = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVENLABS_API_KEY },
    });
    if (!r.ok) throw new Error(`ElevenLabs voices request failed: ${r.status}`);
    const data = await r.json();
    const voices = (data.voices || []).map((v) => ({
      id: v.voice_id,
      name: v.name,
      gender: v.labels?.gender,
      accent: v.labels?.accent,
    }));
    res.json({ provider: "elevenlabs", voices });
  } catch (err) {
    console.error("voices fetch failed:", err);
    res.json({ provider: "browser", voices: [] });
  }
});

// ---------------------------------------------------------------------------
// POST /api/tts  { text, voiceId }
// Proxies ElevenLabs text-to-speech and streams back an mp3. Keeps the API
// key server-side.
// ---------------------------------------------------------------------------
app.post("/api/tts", async (req, res) => {
  if (!ELEVENLABS_API_KEY) return res.status(400).json({ error: "ElevenLabs not configured" });

  const { text, voiceId } = req.body || {};
  if (!text || !voiceId) return res.status(400).json({ error: "text and voiceId required" });

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status).json({ error: detail || "TTS request failed" });
    }
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (err) {
    console.error("tts failed:", err);
    res.status(500).json({ error: err.message || "TTS failed" });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Sales Trainer running → http://localhost:${PORT}`);
  console.log(`  Model: ${MODEL}`);
  const t = loadTranscriptExcerpts(100);
  console.log(
    t
      ? "  Transcript calibration: ACTIVE (files found in ./transcripts)"
      : "  Transcript calibration: none yet — drop .txt files into ./transcripts\n"
  );
  console.log(
    ELEVENLABS_API_KEY
      ? "  Voice mode: ElevenLabs voices ACTIVE\n"
      : "  Voice mode: browser voices (set ELEVENLABS_API_KEY for natural voices)\n"
  );
});
