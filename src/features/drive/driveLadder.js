// The audible cue ladder (drivemode-spec §2), redesigned around the research on
// verbatim aural memorization. Everything the on-screen fade does with space, this
// does with time and silence — but the spine is the technique oral traditions use to
// memorize word-for-word: CUMULATIVE (snowball) PART-WHOLE rehearsal. You learn the
// first phrase, then the first two from the beginning, then the first three… always
// returning to the start. Echo gets each phrase in the mouth; the snowball binds them
// in order; fading cues (lead-in → reference-only → from memory) make recall effortful
// but successful. Every silence is preceded by a clear spoken instruction so the user
// always knows exactly what to produce, and every recall is followed by a confirming
// read so they can self-check by ear.
//
// Pure logic, no React, no audio. compileVerse() turns a passage into ordered steps;
// the player (usePlayer.js) executes them against Rhema + timers/VAD. Phrase
// boundaries reuse the on-screen tokenizer (phrasesOf) so the ear chunks where the eye
// would — then small fragments are merged so Rhema never cuts off mid-thought.

import { phrasesOf } from '../memorization/fading.js';

// The rungs, most support → least.
export const DriveRung = {
  LISTEN: 1, // hear the whole verse (address first); listen only
  ECHO: 2, // phrase by phrase: I read it, you say it right back (get it in the mouth)
  BUILD: 3, // cumulative snowball: add the next phrase, then recite from the beginning
  LEAD_IN: 4, // I give the opening; you carry it to the end; I confirm
  REF_ONLY: 5, // reference only; you recite the whole verse; I read it so you self-check
  FREE_RECALL: 6, // reference, silence, recitation, a confirming read
};

// — Tuning (drivemode-spec §6, §14). One place to shape the whole feel. "Prefer too
// much silence over too little; restraint reads as confidence." Durations in ms.
export const TUNING = {
  gapFloorMs: 1200, // a "your turn" silence is never shorter than this
  gapPerWordMs: 380, // grows with how much the user must produce
  gapHeadroom: 1.6, // generous slack so we never clip the user mid-recitation
  koHeadroom: 1.15, // Korean gets a touch more room
  maxGapMs: 38000, // ceiling on any single silence
  listenBreathMs: 1400, // a reflective beat after a listen read
  connectBreathMs: 800, // a beat between stations of the connections thread
  betweenVerseMs: 900, // settle between verses
  longVerseWords: 14, // at/above this, the whole-verse reads repeat for extra exposure
  minChunkWords: 3, // merge phrases shorter than this into a neighbor (natural chunks)
  // Tier 2 (VAD) windows — see useVoiceActivity.js.
  leadMs: 9000, // how long to wait for the user to START speaking
  trailingSilenceMs: 1200, // silence after speech that means "they finished"
  minSpeechMs: 350, // ignore blips shorter than this
};

const oneLine = (text) => String(text || '').replace(/\s*\n\s*/g, ' ').trim();
const wordsOf = (text) => oneLine(text).split(/\s+/).filter(Boolean);
const wordCount = (text) => wordsOf(text).length;

// Sized silence for an expected recitation of `text`. `rate` (>1 faster, <1 slower)
// scales the gap so the slower/faster controls breathe with the user.
export function gapFor(text, language = 'en', rate = 1) {
  const n = wordCount(text);
  const base = TUNING.gapFloorMs + TUNING.gapPerWordMs * n;
  const ko = language === 'ko' ? TUNING.koHeadroom : 1;
  const ms = (base * TUNING.gapHeadroom * ko) / Math.max(0.25, rate);
  return Math.min(TUNING.maxGapMs, Math.round(ms));
}

// Natural audio chunks: start from clause/sentence phrases, then merge any fragment
// shorter than minChunkWords into its neighbor so Rhema reads whole, breathable units
// (this is the fix for "it cuts off at unnatural places"). A one-phrase verse stays whole.
export function audioChunks(text) {
  const phrases = phrasesOf(text);
  if (phrases.length <= 1) return phrases.map(oneLine);
  const out = [];
  for (const phrase of phrases) {
    const p = oneLine(phrase);
    const prevSmall = out.length && wordCount(out[out.length - 1]) < TUNING.minChunkWords;
    if (out.length && (wordCount(p) < TUNING.minChunkWords || prevSmall)) {
      out[out.length - 1] = `${out[out.length - 1]} ${p}`;
    } else {
      out.push(p);
    }
  }
  return out;
}

// step constructors. A gap carries the text the user is expected to recite (not a
// baked duration) so the player can size the silence live against the slower/faster
// rate; `fixedMs` is a non-recite beat (e.g. a breath after a listen).
const say = (text, language, opts = {}) => ({ type: 'say', text: oneLine(text), lang: language, ...opts });
const gap = (text, language, expect) => ({ type: 'gap', expect, text: oneLine(text) });
const breath = (ms) => ({ type: 'gap', expect: 'breath', fixedMs: ms });
const coach = (key) => ({ type: 'coach', key });

const cumulative = (chunks, i) => chunks.slice(0, i + 1).join(' ');

// The connections thread, narrated (the audio "See how it connects" — drivemode toggle).
// Plays the Way-authored `connection` line of each orbit station in canonical order
// (origin → … → consummation), so the user hears the whole-Bible context before
// memorizing. Listening only; no recite gaps. `orbit` is [{ position, connection }].
function compileConnections(orbit, language) {
  const steps = [coach('connectIntro')];
  const said = orbit.filter((st) => st && st.connection);
  said.forEach((st, i) => {
    steps.push(say(st.connection, language));
    if (i < said.length - 1) steps.push(breath(TUNING.connectBreathMs));
  });
  steps.push(coach('connectOutro'));
  return steps;
}

// A pseudo-rung (level 0) that fronts a verse with its connections thread.
const CONNECT_RUNG = { level: 0, key: 'connect', label: { en: 'How it connects', ko: '어떻게 이어지는지' } };

// — Per-rung compilers. Each returns an ordered Step[] for ONE rung of ONE verse.
// `p` is { text, language, reference }.
const COMPILE = {
  // LISTEN — hear the address, then the whole verse (twice if it's long). Listen only.
  [DriveRung.LISTEN]: (p) => {
    const steps = [coach('listen'), say(p.reference, p.language), say(p.text, p.language, { slow: true })];
    if (wordCount(p.text) >= TUNING.longVerseWords) {
      steps.push(breath(TUNING.listenBreathMs), say(p.text, p.language, { slow: true }));
    }
    steps.push(breath(TUNING.listenBreathMs));
    return steps;
  },

  // ECHO — get each phrase in the mouth: I read a line, you say it right back.
  [DriveRung.ECHO]: (p) => {
    const steps = [coach('echo')];
    for (const c of audioChunks(p.text)) {
      steps.push(say(c, p.language));
      steps.push(gap(c, p.language, 'echo'));
    }
    return steps;
  },

  // BUILD — the snowball. Add the next phrase, then recite from the beginning; I read
  // it back so you can check. The constant return to the start is what binds the order.
  [DriveRung.BUILD]: (p) => {
    const chunks = audioChunks(p.text);
    const steps = [coach('build')];
    chunks.forEach((c, i) => {
      if (i === 0) {
        // First phrase: recite it from memory, then I confirm.
        steps.push(gap(cumulative(chunks, 0), p.language, 'cumulative'));
        steps.push(say(cumulative(chunks, 0), p.language));
        return;
      }
      steps.push(say(c, p.language)); // hear the next phrase
      steps.push(coach('fromStart')); // "From the beginning."
      steps.push(gap(cumulative(chunks, i), p.language, 'cumulative')); // recite from the start
      steps.push(say(cumulative(chunks, i), p.language)); // confirming read
    });
    return steps;
  },

  // LEAD_IN — I give the opening; you carry it to the end; I confirm the whole verse.
  [DriveRung.LEAD_IN]: (p) => {
    const chunks = audioChunks(p.text);
    const opening = chunks[0];
    return [
      coach('leadIn'),
      say(p.reference, p.language),
      say(opening, p.language),
      coach('finish'),
      gap(chunks.slice(1).join(' ') || p.text, p.language, 'rest'),
      say(p.text, p.language), // confirm the whole verse
    ];
  },

  // REF_ONLY — reference only; recite the whole verse; I read it so you self-check.
  [DriveRung.REF_ONLY]: (p) => [
    coach('ref'),
    say(p.reference, p.language),
    gap(p.text, p.language, 'verse'),
    say(p.text, p.language),
  ],

  // FREE_RECALL — from the heart. Reference, silence, recitation, a confirming read.
  [DriveRung.FREE_RECALL]: (p) => [
    coach('memory'),
    say(p.reference, p.language),
    gap(p.text, p.language, 'verse'),
    say(p.text, p.language),
  ],
};

// Rung metadata for the surface (label) and coaching (key the player resolves).
export const RUNGS = [
  { level: DriveRung.LISTEN, key: 'listen', label: { en: 'Listen', ko: '듣기' } },
  { level: DriveRung.ECHO, key: 'echo', label: { en: 'Repeat', ko: '따라 말하기' } },
  { level: DriveRung.BUILD, key: 'build', label: { en: 'Build it up', ko: '쌓아가기' } },
  { level: DriveRung.LEAD_IN, key: 'lead-in', label: { en: 'Lead-in', ko: '이어 외우기' } },
  { level: DriveRung.REF_ONLY, key: 'ref-only', label: { en: 'Reference only', ko: '구절만' } },
  { level: DriveRung.FREE_RECALL, key: 'free-recall', label: { en: 'From memory', ko: '암송' } },
];

export const rungByLevel = (level) => RUNGS.find((r) => r.level === level);

// The rungs that run for a verse this drive: start where its state fits, climb to a
// cap (a brand-new verse is guided all the way to reference-only, but not pushed to
// free recall in one sitting — drivemode-spec §3).
export function selectRungs(startLevel, capLevel) {
  const lo = Math.max(DriveRung.LISTEN, Math.min(startLevel, capLevel));
  const hi = Math.min(DriveRung.FREE_RECALL, Math.max(startLevel, capLevel));
  return RUNGS.filter((r) => r.level >= lo && r.level <= hi);
}

/**
 * Compile one verse into its ladder of rungs for this drive.
 * @param {{text, language, reference}} passage
 * @param {{startLevel?:number, capLevel?:number, orbit?:Array}} opts
 * @returns {{ reference, language, rungs: Array<{level, key, label, steps}> }}
 */
export function compileVerse(passage, { startLevel = DriveRung.LISTEN, capLevel = DriveRung.FREE_RECALL, orbit = null } = {}) {
  const p = { text: passage.text, language: passage.language === 'ko' ? 'ko' : 'en', reference: passage.reference };
  const ladder = selectRungs(startLevel, capLevel).map((r) => ({
    level: r.level,
    key: r.key,
    label: r.label,
    steps: COMPILE[r.level](p),
  }));
  // Optionally front the verse with its narrated connections thread (toggle).
  const rungs =
    orbit && orbit.length
      ? [{ ...CONNECT_RUNG, steps: compileConnections(orbit, p.language) }, ...ladder]
      : ladder;
  return { reference: p.reference, language: p.language, rungs };
}
