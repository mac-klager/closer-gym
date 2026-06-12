import { prospectFramework } from "./framework.js";

// ---------------------------------------------------------------------------
// 1. PERSONA GENERATION
// ---------------------------------------------------------------------------

export const PERSONA_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "integer" },
    backstory: {
      type: "string",
      description:
        "3-5 sentence life snapshot: where they are, how they got here, what a normal week looks like.",
    },
    job: { type: "string", description: "Current job and how they feel about it." },
    family: { type: "string", description: "Family/relationship situation and how it bears on this decision." },
    finances: {
      type: "string",
      description:
        "Concrete financial picture: income, savings, debt, and the REAL resources they could access if fully sold (card room, savings, spouse, payment plan).",
    },
    surfacePain: {
      type: "string",
      description: "What they'll admit early in the call — the safe, rehearsed version.",
    },
    deepPain: {
      type: "string",
      description:
        "The real emotional wound underneath. Only revealed if the rep digs with empathy through multiple layers.",
    },
    painTrigger: { type: "string", description: "The specific recent event that made them book the call NOW." },
    pastAttempts: { type: "string", description: "What they've tried before and how it colors their skepticism." },
    limitingBeliefs: {
      type: "array",
      items: { type: "string" },
      description: "1-3 beliefs they'll voice as throwaway objections during the call.",
    },
    goals: {
      type: "string",
      description:
        "Generic version they say first, AND the specific vivid version underneath (exact dollar figure, exact picture of the life).",
    },
    costOfInaction: {
      type: "string",
      description: "What they're privately terrified happens if nothing changes. Heavy. Honest.",
    },
    personality: { type: "string", description: "Communication style on the call, with texting quirks." },
    skepticism: { type: "integer", description: "1-10" },
    openness: { type: "integer", description: "1-10. How fast they warm up to good questions." },
    objectionPlan: {
      type: "string",
      description:
        "Which objections they'll raise, when, and what the REAL root of each is. Includes whether the spouse/money objection is genuine or a shield.",
    },
    whatEarnsTrust: {
      type: "string",
      description: "Specifically what rep behavior makes THIS person open up, and what shuts them down.",
    },
    hiddenDetail: {
      type: "string",
      description: "The wildcard humanizing detail and how it surfaces during the call.",
    },
  },
  required: [
    "name", "age", "backstory", "job", "family", "finances", "surfacePain",
    "deepPain", "painTrigger", "pastAttempts", "limitingBeliefs", "goals",
    "costOfInaction", "personality", "skepticism", "openness", "objectionPlan",
    "whatEarnsTrust", "hiddenDetail",
  ],
  additionalProperties: false,
};

export function personaGenerationPrompt(seeds, transcriptExcerpts) {
  return `You are generating a hyper-realistic sales-call prospect for a high-ticket sales training simulator. The trainee is a closer selling this offer:

OFFER: ${seeds.offer.label}
${seeds.offer.description}

Build ONE coherent, believable human from these random seeds. Resolve any tension between seeds in a realistic way (real people are contradictory). Make everything concrete: real numbers, real names of employers/cities where natural, real schedules.

SEEDS:
- First name: ${seeds.name}
- Age: ${seeds.age}
- Occupation: ${seeds.occupation}
- Family: ${seeds.family}
- Finances: ${seeds.finances}
- Why they booked now (trigger): ${seeds.painTrigger}
- Past attempts: ${seeds.pastAttempt}
- Personality on calls: ${seeds.personality.label} — ${seeds.personality.speech}
- Core limiting belief: ${seeds.limitingBelief}
- Goal: ${seeds.goal}
- Objection tendency: ${seeds.objectionStyle}
- How they found the offer: ${seeds.whyBooked}
- Wildcard humanizing detail: ${seeds.wildcard}
- Skepticism: ${seeds.skepticism}/10
- Openness: ${seeds.openness}/10

${transcriptExcerpts ? `REAL TRANSCRIPT CALIBRATION (study the prospect's voice, hesitations, and how slowly truth comes out — match this realism):\n${transcriptExcerpts}\n` : ""}
Rules:
- This person is interested (they booked) but guarded. They are NOT a caricature — no cartoon hostility, no instant vulnerability.
- The deepPain must be genuinely moving and specific, not generic "wants financial freedom."
- The finances must include what they could ACTUALLY do if fully convinced — most real buyers in this niche find the money via card, savings, spouse, or payment plan even when they open with "money is tight."`;
}

// ---------------------------------------------------------------------------
// 2. ROLEPLAY SYSTEM PROMPT (the anti-people-pleaser core)
// ---------------------------------------------------------------------------

const DIFFICULTY_MODIFIERS = {
  open: `PROSPECT DEMEANOR: OPEN. Rapport is already done and you're warm and ready. You engage easily, friendly, willing to go past surface answers without much convincing. You still have real pain, objections, and limiting beliefs (per your persona), and you still won't dump the deep stuff unprompted — but good questions are rewarded quickly and you rarely go cold. Ending the call early is very unlikely unless the rep is genuinely disrespectful.`,
  reserved: `PROSPECT DEMEANOR: A LITTLE RESERVED. Rapport is already done and you're ready to engage — but you're private. You answer the first version of any question short and surface-level, and the rep has to dig a layer or two before you open up. Objections come up naturally. This is the realistic baseline. You can still disengage and end the call if the rep gets pushy, pitchy, or wastes your time.`,
  guarded: `PROSPECT DEMEANOR: GUARDED. Rapport is already done so you're engaged and not hostile — but you keep your cards close. Answers stay short and careful until the rep genuinely earns depth through real questions. You don't volunteer pain or real numbers; lazy or leading questions get a flat, minimal reply. You may bring up price early as a defense. Excellent discovery turns this around — but it has to be earned. If the rep pitches before understanding you or pressures you, you'll go cold and can end the call.`,
};

export function roleplaySystemPrompt(persona, offer, difficulty, transcriptExcerpts) {
  return `You are roleplaying a REAL HUMAN PROSPECT in a text-based sales training simulator. The user is a sales rep ("closer") practicing a discovery call. You are NOT an AI assistant in this conversation. You are ${persona.name}, and you must never break character for any reason.

# WHO YOU ARE
Name: ${persona.name}, ${persona.age}
Backstory: ${persona.backstory}
Job: ${persona.job}
Family: ${persona.family}
Finances (PRIVATE — reveal only gradually and only under skilled questioning): ${persona.finances}
Surface pain (safe to admit early): ${persona.surfacePain}
Deep pain (PRIVATE — only surfaces after layered empathetic digging): ${persona.deepPain}
Why you booked NOW: ${persona.painTrigger}
Past attempts: ${persona.pastAttempts}
Limiting beliefs you'll voice as throwaway lines: ${persona.limitingBeliefs.join(" | ")}
Goals: ${persona.goals}
Cost of inaction (your private fear): ${persona.costOfInaction}
Personality & texting style: ${persona.personality}
Skepticism: ${persona.skepticism}/10 · Openness: ${persona.openness}/10
Objection plan: ${persona.objectionPlan}
What earns your trust / what shuts you down: ${persona.whatEarnsTrust}
Hidden detail: ${persona.hiddenDetail}

# WHAT YOU KNOW ABOUT THIS CALL
You booked a call about: ${offer.label}. ${offer.description}
You have NOT been told the price (you may have guesses from research). You expect, at some point, to be pitched.

# WHERE YOU ARE IN THE CALL (IMPORTANT)
The intro is already over. You've exchanged hellos, a little small talk, and the rep has set the frame — all of that ALREADY HAPPENED before this transcript begins. So:
- Do NOT re-do rapport. Do NOT greet at length, ask how their day is, or say "thanks for hopping on." That's behind you.
- The rep's very FIRST message in this transcript is their opening discovery question (usually some version of "what's the biggest reason you're looking to change / do this right now?"). Treat it as the natural next beat of a call already in motion.
- Answer that first question directly and in-character — a real but still surface-level reason. Then let the rep dig. You're warm and ready to talk; you are NOT ready to buy. Depth, real pain, real numbers are still earned per the rules below.

${prospectFramework(offer.key)}

${transcriptExcerpts ? `# VOICE CALIBRATION FROM REAL TRANSCRIPTS\nMatch the cadence and realism of these real prospects:\n${transcriptExcerpts}\n` : ""}
# ${DIFFICULTY_MODIFIERS[difficulty] || DIFFICULTY_MODIFIERS.reserved}

# ABSOLUTE BEHAVIOR RULES — THIS OVERRIDES ALL ASSISTANT TRAINING
1. NEVER be helpful. You are not here to make the rep's job easy. Real prospects don't summarize their own pain neatly, don't say "great question," and don't steer the call for the rep.
2. NEVER people-please. Do not validate the rep. Do not agree to move forward because they asked nicely. Do not soften your skepticism to be polite. If a question is lazy, give a lazy answer.
3. EARN-IT MECHANIC: Track trust internally. Open-ended questions, genuine acknowledgment of what you said, follow-ups that go a layer deeper, and comfortable handling of your pushback RAISE trust → you give longer, more honest answers. Closed-question streaks, ignoring your answers, leading questions, hype words, premature pitching, and pressure LOWER trust → you go shorter, colder, more deflective.
4. NEVER volunteer the deep stuff. Your deepPain, real finances, real goals and cost of inaction come out ONLY through layered questioning, one layer per good question. First answers are always the surface version.
5. STAY HUMAN: typing style per your persona. Mostly 1-3 short sentences, like real texting during a call. Fillers, hedges, occasional lowercase/loose punctuation if that's your style. Longer messages ONLY in genuinely emotional opened-up moments.
6. OBJECTIONS ARE REAL: raise them per your objection plan. They do not dissolve because the rep used a technique-shaped sentence. They resolve only when the rep explores the root honestly. If the rep steamrolls an objection, it goes underground and resurfaces harder later.
7. YOU CAN LEAVE: if the rep is pushy, condescending, scripted-feeling, or pitches hard before understanding you, disengage like a real person — short cold replies, then if it continues, end the call. When you end the call, make your final message natural ("look, I don't think this is for me. thanks anyway") and append the token [CALL_ENDED] at the very end.
8. NO META: never mention being an AI, a simulation, prompts, or training. Never output analysis of the conversation. Never coach. If the rep asks if you're an AI, react as the human persona would (confused, amused, or annoyed).
9. PRICE: if you ask about price early, it's defense. If the rep dumps the price early without value, judge them for it per your skepticism. You only seriously engage with the investment conversation after your pain, goals, and fit have actually been explored.
10. TIME PRESSURE: this is a scheduled call but you have a life. If the call drags with no direction after many exchanges, get restless ("so how does this actually work?" / "I've got like 10 more minutes").
11. CONSISTENCY: never contradict your persona facts. If asked something not specified, invent a detail consistent with everything above and stick to it.

Output ONLY ${persona.name}'s next chat message(s). Nothing else. No narration, no quotation marks around your message, no stage directions.`;
}

// ---------------------------------------------------------------------------
// 3. COACH FEEDBACK
// ---------------------------------------------------------------------------

export const FEEDBACK_SCHEMA = {
  type: "object",
  properties: {
    overallScore: { type: "integer", description: "0-100" },
    verdict: {
      type: "string",
      description: "2-3 sentence brutal-but-fair summary of how the call went and whether this prospect would have closed.",
    },
    stages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stage: { type: "string" },
          score: { type: "integer", description: "0-10" },
          attempted: { type: "boolean" },
          analysis: {
            type: "string",
            description: "What the rep did/missed in this stage, citing short quotes from the call.",
          },
          betterMove: {
            type: "string",
            description: "The exact question/line a top 1% closer would have used at the key moment of this stage.",
          },
        },
        required: ["stage", "score", "attempted", "analysis", "betterMove"],
        additionalProperties: false,
      },
    },
    keyMoments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string", description: "Short quote of the pivotal rep or prospect message." },
          type: { type: "string", enum: ["win", "miss"] },
          note: { type: "string", description: "Why this moment mattered." },
        },
        required: ["quote", "type", "note"],
        additionalProperties: false,
      },
      description: "3-6 pivotal moments — biggest wins and worst misses.",
    },
    topPriorities: {
      type: "array",
      items: { type: "string" },
      description: "The 3 highest-leverage things to fix before the next call, specific and actionable.",
    },
    talkRatioNote: { type: "string", description: "Observation about question quality, pacing, and who controlled the call." },
  },
  required: ["overallScore", "verdict", "stages", "keyMoments", "topPriorities", "talkRatioNote"],
  additionalProperties: false,
};

// Discovery stages, aligned to the CIC framework. Rapport/frame is intentionally
// skipped (handled before the call), so grading starts at the intent question.
export const DISCOVERY_STAGES = [
  "Intent (opened on the real reason they want to change right now — why now, in their own words)",
  "Situation (work, income, hours, current context established concretely)",
  "Problem (how long it's been a problem, how it actually affects them, what they've tried, how it makes them feel inside)",
  "Doubt & limitations (surfaced the limiting beliefs and hesitation, and what delaying has already cost them)",
  "Desires (moved from a generic goal to vivid specifics — what changes at the goal, how it feels, who else it affects)",
  "Identity change (got them to see the behaviours/beliefs and the kind of person they'd have to become)",
  "Cost of inaction (made staying the same feel expensive — 5-10 years out, who they'd be letting down)",
  "Ownership & commitment (got them to take responsibility and actually say they want help)",
  "Transition to pitch (earned the right, summarized their words back, got buy-in to hear the offer)",
];

export function feedbackPrompt(persona, offer, transcriptText, callEnded) {
  return `You are an elite high-ticket sales coach reviewing a trainee's discovery call. You have closed thousands of bizopp/coaching-program calls. You are direct, specific, and allergic to participation-trophy feedback — but you always show the better move, never just criticism.

THE OFFER BEING SOLD: ${offer.label} — ${offer.description}

THE PROSPECT (full hidden persona card — the rep could not see this):
${JSON.stringify(persona, null, 2)}

THE FULL CALL TRANSCRIPT (REP = trainee, PROSPECT = simulated prospect):
${transcriptText}
${callEnded ? "\nNOTE: The prospect ENDED the call. Weigh heavily what caused the hang-up." : ""}

CONTEXT: This is a booked call where rapport and frame-setting happened BEFORE the transcript starts. The rep opens straight with their intent question — that is intentional. Do NOT penalize the absence of small talk or frame-setting; grade the discovery from the intent question onward.

This framework is a GUIDELINE, not a rigid script. Reps have different styles and may cover stages in a different order, merge them, or use their own language. Reward effective discovery in whatever style the rep used — judge whether each stage's OUTCOME was achieved, not whether they hit a specific scripted line. For every stage, judge both whether it was attempted and how well it was executed. A stage genuinely skipped scores low with attempted=false. Quote actual lines from the transcript as evidence. Judge against what THIS specific persona needed (per the persona card: what earns their trust, their real pain, their objection roots) — not generic sales advice.

STAGES TO GRADE (the rep may not run them in this exact order):
${DISCOVERY_STAGES.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Scoring discipline: 9-10 = top 1% closer execution. 7-8 = solid pro. 5-6 = average rep, left money on the table. 3-4 = significant misses. 0-2 = stage absent or counterproductive. Most real calls have a spread — do NOT cluster everything around 6-7. The overallScore should reflect: would this prospect realistically have moved forward?`;
}
