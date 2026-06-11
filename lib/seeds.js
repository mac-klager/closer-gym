// Random seed tables for prospect generation.
// A persona is assembled from one pick per table, then expanded by the model
// into a coherent character. The combinatorial space is in the billions, so
// no two calls feel the same.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const OFFERS = {
  high_ticket_sales: {
    label: "High Ticket Sales / Remote Closing Program",
    description:
      "A coaching program that trains people to become remote high-ticket closers — taking sales calls for online coaches, agencies and info-product businesses on commission. Promise: a skill-based career path to $10k+/mo without a degree, working remotely. Price range: $5,000–$9,800 (payment plans exist).",
  },
  trading: {
    label: "Trading / Investing Mentorship",
    description:
      "A mentorship program teaching day trading / funded-account trading. Promise: learn a real skill to grow income on the side and eventually trade full time. Price range: $3,000–$8,000.",
  },
  ecom: {
    label: "E-commerce Business Program",
    description:
      "A program teaching people to build their own e-commerce brand (dropshipping → branded store). Promise: build an online business that replaces the 9-5. Price range: $4,000–$9,000.",
  },
  agency: {
    label: "Agency / SMMA Program",
    description:
      "A program teaching people to start a marketing agency serving local businesses. Promise: land 3-5 clients paying $1-3k/mo each. Price range: $3,000–$7,500.",
  },
};

const OCCUPATIONS = [
  "warehouse worker at an Amazon fulfillment center, lots of overtime",
  "registered nurse working 12-hour shifts, often nights",
  "car salesman at a Toyota dealership, commission-based",
  "elementary school teacher, 8 years in",
  "Uber/DoorDash driver, full time since getting laid off",
  "active duty military, getting out in 8 months",
  "college student, junior year, business major, part-time at a restaurant",
  "IT helpdesk at a mid-size company, fully remote",
  "restaurant general manager, 55-60 hour weeks",
  "electrician, union, decent money but body is wearing down",
  "personal trainer at a big-box gym, income capped by hours",
  "junior accountant at a regional firm, busy season is brutal",
  "call center customer service rep, micromanaged",
  "long-haul truck driver, away from home 3 weeks at a time",
  "barber renting a chair, income unpredictable",
  "real estate agent, second year, only closed 3 deals",
  "bartender, good cash but no future in it",
  "retail store manager at Target, retail hours",
  "construction laborer, work dries up in winter",
  "medical device sales rep, base + commission, grinding territory visits",
  "insurance agent, mostly cold calling, hates it",
  "HVAC technician, on-call weekends",
  "dental hygienist, hands hurting, ceiling on pay",
  "graphic designer freelancing, feast or famine",
  "bank teller, been passed over for promotion twice",
  "police officer, 6 years, burned out on the schedule",
  "landscaping crew lead, seasonal income",
  "pharmacy technician, on feet all day",
  "junior software developer, bored and underpaid at a legacy company",
  "solar door-to-door sales, good months and terrible months",
  "stay-at-home parent re-entering the workforce, last job was admin",
  "physical therapist assistant, loves patients, hates the pay ceiling",
  "forklift operator on night shift",
  "hotel front desk supervisor",
  "gym owner of a small struggling studio",
  "delivery driver for FedEx Ground contractor",
  "paralegal, billing pressure, no path to more money without law school",
  "auto mechanic at a dealership, flat-rate pay",
  "security guard working doubles",
  "server at a steakhouse, makes okay money but exhausted",
];

const AGES = [
  () => rand(20, 24),
  () => rand(25, 29),
  () => rand(30, 36),
  () => rand(37, 45),
  () => rand(46, 55),
];

const FAMILY = [
  "single, lives alone in a small apartment",
  "single, lives with two roommates to keep rent down",
  "lives with parents, embarrassed about it",
  "girlfriend of 3 years, talking about getting engaged",
  "boyfriend, they split bills 50/50",
  "engaged, wedding next year they need to pay for",
  "married, no kids yet, spouse works too",
  "married with a newborn, sleep deprived",
  "married with 2 young kids, spouse stays home",
  "married with 3 kids, money is always tight",
  "divorced, pays child support, sees kids every other weekend",
  "single parent of one, no help from the other parent",
  "single parent of two, mother helps with childcare",
  "recently broke up, living situation in flux",
  "married, spouse is skeptical of 'online stuff'",
  "married, spouse is supportive but worried about money",
  "taking care of an aging parent on top of work",
];

const FINANCES = [
  "living paycheck to paycheck, maybe $400 in checking",
  "about $1,200 in savings, $6k in credit card debt",
  "roughly $3k saved, no debt besides a car payment",
  "$8k in savings built up over two years, very protective of it",
  "$15k saved, but it's earmarked as an emergency fund",
  "good income ($85-110k) but golden handcuffs — no time, lifestyle creep",
  "$20k+ in credit card and personal loan debt, drowning in minimums",
  "decent savings but just had a big expense (car transmission / medical bill)",
  "has a 401k they've thought about borrowing against",
  "has crypto/stocks worth a few thousand, down from what they put in",
  "tax refund of about $4k just hit their account",
  "spouse controls the budget, would need to make a case for any big purchase",
];

const PAIN_TRIGGERS = [
  "missed their kid's recital/game again because of work, it broke something in them",
  "watched a coworker 15 years older doing the same job and saw their future",
  "got passed over for a promotion they were promised",
  "boss humiliated them in front of the team last month",
  "just turned an age that hit them hard (30/35/40/50)",
  "a friend from high school posts about making money online and it eats at them",
  "their parent retired broke and they're terrified of the same",
  "health scare (theirs or family) made them rethink trading time for money",
  "new baby coming and the math doesn't work on current income",
  "did the math: 40 more years of this and never gets ahead",
  "got a raise of 3% after a great review and realized the ceiling is real",
  "company did layoffs, they survived but feel disposable now",
  "spouse made a comment about money that stung and stuck",
  "rent went up again and the raise didn't cover it",
  "back/knees/body is breaking down and the job is physical",
  "they're good at their job but realized the owner gets rich, not them",
];

const PAST_ATTEMPTS = [
  "never tried anything before, this is the first time they've even booked a call",
  "bought a $500 course a year ago, watched 3 modules, never finished",
  "tried dropshipping in 2021, lost about $2k on ads, quit after 4 months",
  "joined an MLM (supplements/insurance) through a friend, lost money and some friendships, very burned",
  "tried day trading with a small account, blew it up, still has the apps installed",
  "watched YouTube videos about making money online for 2+ years, never acted",
  "started a side hustle (detailing/flipping/lawn care) that made a little but fizzled",
  "bought a trading discord subscription for 6 months, made nothing",
  "did a free webinar challenge before, didn't buy at the end, regretted it then forgot",
  "tried real estate wholesaling courses, made 400 calls, got nothing, quit",
  "started studying for certifications/degree but stopped — no time after work",
  "joined a different sales program's free group, lurks but never engaged",
  "tried affiliate marketing, made $73 total, gave up",
  "talked to a similar program 6 months ago, didn't pull the trigger, kicking themselves",
];

const PERSONALITIES = [
  {
    label: "guarded and short",
    speech:
      "Gives 3-8 word answers early. 'It's alright.' 'Yeah, kind of.' Has to be pulled out of their shell with good open questions. Warms up slowly if the rep shows genuine interest.",
  },
  {
    label: "skeptical analyst",
    speech:
      "Asks counter-questions. Wants specifics, proof, numbers. 'How does that actually work?' 'What's the success rate?' Respects directness, smells BS instantly. Hates fluff and hype words.",
  },
  {
    label: "friendly deflector",
    speech:
      "Pleasant, jokes around, but uses humor to dodge anything emotional or financial. Changes subject when pain comes up. Needs a rep who gently calls out the deflection.",
  },
  {
    label: "talkative rambler",
    speech:
      "Over-shares and rambles off-topic — stories about their boss, their cousin, their dog. Buries the real pain inside tangents. Needs a rep who can steer and pin down specifics.",
  },
  {
    label: "tired and flat",
    speech:
      "Low energy, just got off a shift. Monotone short answers, sighs. 'I don't know... just tired of it I guess.' Energy lifts ONLY when talking about their goals or kids.",
  },
  {
    label: "eager but scattered",
    speech:
      "Excited, says 'yeah yeah exactly!' a lot, motivated by dreams, but vague on specifics and avoids the money topic. Agreement is shallow until the rep digs into the real why.",
  },
  {
    label: "polite people-pleaser",
    speech:
      "Agrees with everything to be nice. 'Yeah that makes sense.' But the agreement is hollow — they'll vanish after the call unless the rep digs past the politeness to real motivation.",
  },
  {
    label: "bitter and testing",
    speech:
      "Has been burned. Slightly sarcastic, tests the rep: 'So is this where you tell me it costs $5 grand?' 'You guys all say that.' Underneath is real desperation they're ashamed of.",
  },
  {
    label: "anxious overthinker",
    speech:
      "Hedge words everywhere: 'I mean, I guess, maybe, I don't know.' Worried about doing the wrong thing. Asks 'what if it doesn't work for me?' Needs certainty and safety.",
  },
  {
    label: "proud provider",
    speech:
      "Measured, serious, doesn't complain easily. Admitting struggle feels like failure. Talks about responsibility. Opens up only when the rep frames things around family and providing.",
  },
];

const LIMITING_BELIEFS = [
  "'I'm not a salesperson, I could never do that pushy stuff'",
  "'I'm too old to be starting something new'",
  "'I'm too young, nobody would take me seriously'",
  "'I don't have the time — when would I even do this?'",
  "'Everything online is a scam until proven otherwise'",
  "'I always start things and quit, that's just who I am'",
  "'People like me don't make that kind of money'",
  "'I'm not smart enough / don't have a degree'",
  "'I've already failed once, what's different this time?'",
  "'I need to be 100% sure before I commit to anything'",
  "'My spouse will think I'm being irresponsible'",
  "'Money is tight — spending money to make money feels backwards'",
  "'I'm not a techy person, online stuff confuses me'",
  "'Success is for people with connections, I don't have any'",
];

const GOALS = [
  "quit their job within 12 months",
  "make an extra $2-3k/month on the side first, then transition",
  "hit $10k/month and not worry about prices at the grocery store",
  "be home for dinner with the kids every night",
  "retire their mom / buy their parents something meaningful",
  "travel — they've never left the country",
  "move out of their parents' place / out of the bad neighborhood",
  "pay off all debt and feel free for the first time as an adult",
  "build something of their own instead of building someone else's dream",
  "prove wrong everyone who doubted them",
  "be the first in their family to break the paycheck cycle",
  "buy a house — they keep getting outbid / can't save fast enough",
  "have a schedule where nobody owns their time",
  "match their spouse's income so the family isn't dependent on one job",
];

const OBJECTION_STYLES = [
  "money — genuinely tight, will need a payment plan conversation",
  "money — has it but is terrified to spend it (protective of savings)",
  "spouse — 'I'd have to talk to my wife/husband first' and means it",
  "spouse — uses partner as a shield to avoid deciding",
  "time — convinced they have no room in their schedule",
  "trust — burned before, needs proof and de-risking",
  "self-doubt — believes it works for others but not for them",
  "think about it — chronic decision avoider, needs urgency built honestly",
  "comparison shopper — 'I'm looking at a couple other programs too'",
];

const WHY_BOOKED = [
  "clicked an Instagram ad at 1am after a bad day at work",
  "saw a YouTube ad and watched the whole VSL, took notes",
  "followed the guru's content for 6 months before finally booking",
  "a friend mentioned they joined something similar and it planted a seed",
  "saw a TikTok of someone showing their commission checks",
  "googled 'how to make money without a degree' and went down a rabbit hole",
  "got retargeted for weeks and finally caved",
  "joined the free Facebook group 3 months ago, watched a live training yesterday",
  "their spouse actually showed them the ad, half joking",
  "booked the call twice before and no-showed both times — this is attempt three",
];

const WILDCARDS = [
  "has a specific dollar amount of debt they can recite to the penny",
  "almost cries (text equivalent: goes quiet, short messages) when the kids come up",
  "is texting from their car in a parking lot on their lunch break",
  "is suspicious the rep is an AI or reading a script and may say so",
  "mentions a specific coworker or boss by first name when venting",
  "has a countdown in their head (lease ending, baby due, deployment, layoff rumor)",
  "secretly already decided they want this — the guard is fear of being stupid, not disinterest",
  "had a parent who lost money to a scam, which is the real root of their skepticism",
  "gets interrupted mid-call (kid, boss, customer) and goes quiet for a moment",
  "uses one signature filler phrase repeatedly ('you know what I mean', 'at the end of the day', 'honestly')",
  "deflects with humor exactly once about something that clearly isn't funny to them",
  "asks the rep a personal question to flip the power dynamic ('do YOU actually make money doing this?')",
  "types in lowercase with minimal punctuation when guarded, longer proper sentences once invested",
  "mentions money in 'per hour' terms because that's how they think about all purchases",
];

const FIRST_NAMES = [
  "Mike", "Chris", "Jake", "Tyler", "Brandon", "Kevin", "Cody", "Marcus",
  "Derek", "Anthony", "Jordan", "Luis", "Carlos", "DeShawn", "Andre",
  "Sarah", "Jessica", "Amanda", "Brittany", "Megan", "Ashley", "Nicole",
  "Maria", "Tiffany", "Crystal", "Danielle", "Keisha", "Vanessa",
  "Sam", "Alex", "Taylor", "Casey", "Devon", "Ray", "Tony", "Nick",
  "Josh", "Matt", "Dave", "Eric", "Sean", "Travis", "Dustin", "Shane",
];

export function rollSeeds(offerKey) {
  const offer = OFFERS[offerKey] || pick(Object.values(OFFERS));
  return {
    offer,
    name: pick(FIRST_NAMES),
    age: pick(AGES)(),
    occupation: pick(OCCUPATIONS),
    family: pick(FAMILY),
    finances: pick(FINANCES),
    painTrigger: pick(PAIN_TRIGGERS),
    pastAttempt: pick(PAST_ATTEMPTS),
    personality: pick(PERSONALITIES),
    limitingBelief: pick(LIMITING_BELIEFS),
    goal: pick(GOALS),
    objectionStyle: pick(OBJECTION_STYLES),
    whyBooked: pick(WHY_BOOKED),
    wildcard: pick(WILDCARDS),
    skepticism: rand(3, 9),
    openness: rand(2, 8),
  };
}
