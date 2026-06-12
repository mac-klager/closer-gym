# Closer Gym — AI Discovery Call Trainer

Text-based sales training simulator (kendo.ai-style, chat only) for high-ticket
discovery/closing calls. Two offers to train with:

- **High Ticket Sales / Remote Closing Program**
- **Fitness Transformation Coaching**

Every call is a **unique, randomly generated prospect** — real job, family,
finances, hidden pain, limiting beliefs, objection plan — who behaves like real
prospects from actual call transcripts: guarded, skeptical, and allergic to
being sold. No AI people-pleasing. You have to earn every layer.

This is a **booked call** — the prospect already scheduled this. You open with
rapport and frame control, then run discovery.

## What it trains (the discovery framework)

1. Opening & frame control
2. Current situation
3. Pain & problems (multi-layer digging)
4. Past attempts
5. Limiting beliefs
6. Identity shift
7. Goals & desires (generic → vivid specifics)
8. Cost of inaction
9. Transition into presentation

End the call anytime → an elite-coach AI grades every stage with quotes,
scores, the exact better move, and reveals the full hidden persona.

## Setup

```bash
cd sales-trainer
npm install
cp .env.example .env   # put your ANTHROPIC_API_KEY in .env
npm start              # → http://localhost:3000
```

## Make it more realistic with your own transcripts

Drop real call transcripts (`.txt` / `.md`) into `./transcripts`. Excerpts are
injected into persona generation and the roleplay prompt as voice calibration.
Two condensed excerpt files from real calls are already included.

## How it works

| Piece | What it does |
|---|---|
| `lib/seeds.js` | Random tables (40+ jobs, finances, pain triggers, personalities, beliefs, wildcards) — billions of combinations |
| `lib/framework.js` | Shared discovery-call behavior framework + offer-specific verbatim phrases, distilled from real call transcripts |
| `lib/prompts.js` | Persona generator, anti-people-pleaser roleplay prompt, coach grader |
| `server.js` | Express API: create session / chat / feedback (Claude API, structured outputs, prompt caching) |
| `public/index.html` | Chat UI + feedback report |

Prospects can hang up on you (`[CALL_ENDED]`) if you're pushy, pitchy or scripted.

Pick the prospect's starting demeanor — how guarded they are walking into a call
they already booked:

- **Open** — friendly, shares easily, low guard
- **A little closed off** — realistic baseline, guarded early, earns trust normally
- **Closed off** — short and testing from message one, will shut the call down fast if you don't earn trust quickly

## Voice mode 🎙️

Two ways to use your voice (both free, browser-native, no extra setup):

- **Text chat + 🎤 button** — push-to-talk: click the mic, speak, it transcribes
  and sends when you stop.
- **Voice call (hands-free)** — full open-mic loop: the prospect *speaks* their
  replies out loud, the mic listens continuously, and pausing for ~1.5s sends
  your turn automatically. The mic closes while the prospect talks (no echo)
  and re-opens when they finish. Toggle the mic with 🎤, mute the prospect
  with 🔊.

Needs Chrome, Edge or Safari (Firefox has no speech recognition) and HTTPS or
localhost. Pick a specific prospect voice on the setup screen, or leave it on
auto and a default English voice is used.

## Later (planned)

- Objection handling mode after the price drop (post-presentation gauntlet)
- Saved call history & progress tracking
