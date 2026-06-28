// The audible cue ladder (drivemode-spec §2). Everything the on-screen fade does
// with space, this does with time and silence: Rhema reads, leaves a sized gap for
// the user to recite, and reads back to confirm. Support fades by what she speaks
// vs. what she leaves silent — her reading the words back IS the eyes-free reveal.
//
// Pure logic, no React, no audio. It compiles a passage at a rung into an ordered
// list of steps; the player (usePlayer.js) executes them against Rhema + timers/VAD.
// Phrase boundaries reuse the on-screen tokenizer (phrasesOf, method-spec §4) so the
// ear chunks exactly where the eye does.

import { phrasesOf } from '../memorization/fading.js';

// The six rungs, most support → least.
export const DriveRung = {
  ABSORB: 1, // hear the whole verse; listen only
  ECHO: 2, // phrase → your turn → next phrase (chunking by ear)
  FILL_GAP: 3, // she reads the lead, drops the tail into silence, confirms
  LEAD_IN: 4, // only the opening; you carry the rest; she confirms
  REF_ONLY: 5, // reference only; you recite; she reads it so you self-check
  FREE_RECALL: 6, // reference, silence, recitation, a confirming read
};

// — Tuning (drivemode-spec §6, §14). One place to shape the whole feel. "Prefer too
// much silence over too little; restraint reads as confidence." All durations in ms.
export const TUNING = {
  gapFloorMs: 1000, // a "your turn" silence is never shorter than this
  gapPerWordMs: 360, // grows with how much the user must produce
  gapHeadroom: 1.5, // generous slack so we never clip the user
  koHeadroom: 1.15, // Korean gets a touch more room
  maxGapMs: 32000, // absolute ceiling on any single silence
  absorbBreathMs: 1200, // reflective beat after the first listen
  betweenVerseMs: 800, // settle between verses
  // Tier 2 (VAD) windows — see useVoiceActivity.js.
  leadMs: 8000, // how long to wait for the user to START speaking
  trailingSilenceMs: 1100, // silence after speech that means "they finished"
  minSpeechMs: 350, // ignore blips shorter than this
};

const oneLine = (text) => String(text || '').replace(/\s*\n\s*/g, ' ').trim();
const wordsOf = (text) => oneLine(text).split(/\s+/).filter(Boolean);

// Sized silence for an expected recitation of `text`. `rate` (>1 faster, <1 slower)
// scales the gap so the slower/faster controls breathe with the user.
export function gapFor(text, language = 'en', rate = 1) {
  const n = wordsOf(text).length;
  const base = TUNING.gapFloorMs + TUNING.gapPerWordMs * n;
  const ko = language === 'ko' ? TUNING.koHeadroom : 1;
  const ms = (base * TUNING.gapHeadroom * ko) / Math.max(0.25, rate);
  return Math.min(TUNING.maxGapMs, Math.round(ms));
}

// step constructors. A gap carries the text the user is expected to recite (not a
// baked duration) so the player can size the silence live against the slower/faster
// rate. The absorb "breath" is a fixed reflective beat, not a recite gap.
const say = (text, language, opts = {}) => ({ type: 'say', text: oneLine(text), lang: language, ...opts });
const gap = (text, language, expect) => ({ type: 'gap', expect, text: oneLine(text) });
const coach = (key) => ({ type: 'coach', key });

// Split a phrase into the lead Rhema reads and the tail she drops into silence.
// Longer phrases drop two words, so the dropped portion grows with phrase weight
// (the audible "first-letters" rung — drivemode-spec §2).
function leadAndTail(phrase) {
  const w = wordsOf(phrase);
  const drop = w.length >= 5 ? 2 : 1;
  if (w.length <= drop) return { lead: '', tail: phrase };
  return { lead: w.slice(0, -drop).join(' '), tail: w.slice(-drop).join(' ') };
}

// The opening Rhema gives at the lead-in rung, and the rest the user carries.
function openingAndRest(verse) {
  const phrases = phrasesOf(verse);
  if (phrases.length >= 2) {
    return { opening: phrases[0], rest: phrases.slice(1).join(' ') };
  }
  const w = wordsOf(verse);
  const k = Math.min(2, Math.max(1, w.length - 1));
  return { opening: w.slice(0, k).join(' '), rest: w.slice(k).join(' ') };
}

// — Per-rung compilers. Each returns an ordered Step[] for ONE rung of ONE verse.
// `p` is { text, language, reference }.
const COMPILE = {
  [DriveRung.ABSORB]: (p) => [
    coach('listen'),
    say(p.reference, p.language), // tie the address to the verse from the first hearing
    say(p.text, p.language, { slow: true }),
    { type: 'gap', ms: TUNING.absorbBreathMs, expect: 'breath' }, // a reflective beat, not a recite gap
  ],

  [DriveRung.ECHO]: (p) => {
    const steps = [coach('echo')];
    for (const phrase of phrasesOf(p.text)) {
      steps.push(say(phrase, p.language));
      steps.push(gap(phrase, p.language, 'phrase'));
    }
    return steps;
  },

  [DriveRung.FILL_GAP]: (p) => {
    const steps = [coach('fill')];
    for (const phrase of phrasesOf(p.text)) {
      const { lead, tail } = leadAndTail(phrase);
      if (lead) steps.push(say(lead, p.language));
      steps.push(gap(tail, p.language, 'tail'));
      steps.push(say(phrase, p.language)); // confirm the whole phrase
    }
    return steps;
  },

  [DriveRung.LEAD_IN]: (p) => {
    const { opening, rest } = openingAndRest(p.text);
    return [
      coach('leadIn'),
      say(opening, p.language),
      gap(rest, p.language, 'rest'),
      say(p.text, p.language), // confirm the whole verse
    ];
  },

  [DriveRung.REF_ONLY]: (p) => [
    coach('ref'),
    say(p.reference, p.language),
    gap(p.text, p.language, 'verse'),
    say(p.text, p.language), // self-check read
  ],

  [DriveRung.FREE_RECALL]: (p) => [
    coach('memory'),
    say(p.reference, p.language),
    gap(p.text, p.language, 'verse'),
    say(p.text, p.language), // confirming read (the reveal)
  ],
};

// Rung metadata for the surface (label) and coaching (key the player resolves).
export const RUNGS = [
  { level: DriveRung.ABSORB, key: 'absorb', label: { en: 'Listen', ko: '듣기' } },
  { level: DriveRung.ECHO, key: 'echo', label: { en: 'Echo', ko: '따라 말하기' } },
  { level: DriveRung.FILL_GAP, key: 'fill-gap', label: { en: 'Fill the gap', ko: '빈칸 채우기' } },
  { level: DriveRung.LEAD_IN, key: 'lead-in', label: { en: 'Lead-in', ko: '첫 구절만' } },
  { level: DriveRung.REF_ONLY, key: 'ref-only', label: { en: 'Reference only', ko: '구절만' } },
  { level: DriveRung.FREE_RECALL, key: 'free-recall', label: { en: 'From memory', ko: '암송' } },
];

export const rungByLevel = (level) => RUNGS.find((r) => r.level === level);

// The rungs that run for a verse this drive: start where its state fits, climb to a
// cap (a brand-new verse is NOT pushed to free recall in one drive — drivemode-spec §3).
export function selectRungs(startLevel, capLevel) {
  const lo = Math.max(DriveRung.ABSORB, Math.min(startLevel, capLevel));
  const hi = Math.min(DriveRung.FREE_RECALL, Math.max(startLevel, capLevel));
  return RUNGS.filter((r) => r.level >= lo && r.level <= hi);
}

/**
 * Compile one verse into its ladder of rungs for this drive.
 * @param {{text, language, reference}} passage
 * @param {{startLevel?:number, capLevel?:number}} opts
 * @returns {{ reference, language, rungs: Array<{level, key, label, steps}> }}
 */
export function compileVerse(passage, { startLevel = DriveRung.ABSORB, capLevel = DriveRung.FREE_RECALL } = {}) {
  const p = { text: passage.text, language: passage.language === 'ko' ? 'ko' : 'en', reference: passage.reference };
  const rungs = selectRungs(startLevel, capLevel).map((r) => ({
    level: r.level,
    key: r.key,
    label: r.label,
    steps: COMPILE[r.level](p),
  }));
  return { reference: p.reference, language: p.language, rungs };
}
