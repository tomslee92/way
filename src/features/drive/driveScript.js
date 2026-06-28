// What Rhema says in Drive Mode — bilingual, warm, unhurried (drivemode-spec §6, §7).
// She is a companion narrator here, not a quizmaster: she reads, leaves room,
// encourages sparingly, confirms, and never evaluates a recitation. Korean is
// written in 해요체 rhythm (no 님 on first names), not translated word-for-word.
//
// Coaching is the only "chrome" over the audio; keep it brief so silence carries
// the experience. Lines that rotate are arrays — resolve with pick().

import { pick } from '../memorization/rhemaScript.js';

export const driveScript = {
  // Per-rung opening line. The ladder emits a { type:'coach', key } step at the
  // top of each rung; the player resolves it through here for the current language.
  coach: {
    en: {
      listen: ["Let's listen first."],
      echo: ['Now, say each line back to me.'],
      fill: ["I'll start each line — you finish it."],
      leadIn: ["I'll give you the opening. Carry it on."],
      ref: ['Just the reference now. Say it as your own.'],
      memory: ['From memory now. Take your time.'],
      // Gentle repeat (low rungs, on a timeout — never a correction).
      again: ['Once more.', "Let's hear it again."],
    },
    ko: {
      listen: ['먼저 들어볼게요.'],
      echo: ['이제 한 구절씩 따라 말해 보세요.'],
      fill: ['제가 먼저 시작할게요. 나머지를 채워 보세요.'],
      leadIn: ['처음만 들려드릴게요. 이어서 외워 보세요.'],
      ref: ['이제 구절만 말씀드릴게요. 마음에 담긴 그대로 외워 보세요.'],
      memory: ['이제 외워서 말해 보세요. 천천히 하셔도 돼요.'],
      again: ['한 번 더요.', '다시 한 번 들어볼게요.'],
    },
  },

  // Sparse between-phrase encouragement. Used rarely (the player rate-limits it);
  // restraint reads as confidence (drivemode-spec §6).
  between: {
    en: ['Beautiful.', 'Yes.', 'That’s it.'],
    ko: ['아름다워요.', '네, 좋아요.', '바로 그거예요.'],
  },

  // Spoken session frame.
  start: {
    en: ["Let's begin. Put the screen away — I'll guide you."],
    ko: ['시작해 볼게요. 화면은 내려놓으세요. 제가 안내할게요.'],
  },
  complete: {
    en: ["That's all for now. You carried it well."],
    ko: ['오늘은 여기까지예요. 정말 잘 담아내셨어요.'],
  },
};

// "Next, John 14:6." — the warm transition between verses. The reference is passed
// in already localized (English ref for ESV verses, Korean ref for 개역개정).
export function verseIntro(reference, language = 'en') {
  return language === 'ko' ? `다음은, ${reference}이에요.` : `Next — ${reference}.`;
}

// Resolve a rung's coach line for the language.
export function coachLine(key, language = 'en') {
  const set = driveScript.coach[language === 'ko' ? 'ko' : 'en'];
  return pick(set[key] || ['']);
}

// A frame line (start / complete) for the language.
export function frameLine(key, language = 'en') {
  return pick(driveScript[key][language === 'ko' ? 'ko' : 'en']);
}

// A sparse encouragement for the language.
export function betweenLine(language = 'en') {
  return pick(driveScript.between[language === 'ko' ? 'ko' : 'en']);
}
