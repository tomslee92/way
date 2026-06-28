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
      // The narrated connections thread (optional, before memorizing).
      connectIntro: ["Before we memorize, let's see how this verse connects across Scripture."],
      connectOutro: ["That's the thread. Now, let's carry it in memory."],
      // Each line names the task before the silence, so you always know what to say.
      listen: ["First, just listen to the whole verse."],
      echo: ["Now line by line. I'll read a part — say it right back to me."],
      build: ["Let's build it up. Each time, go back to the very beginning and add the next part."],
      fromStart: ['From the beginning.'], // micro-cue before each cumulative recital
      leadIn: ["I'll start you off — you carry it to the end."],
      finish: ['Keep going, all the way to the end.'],
      ref: ['Just the reference now. Say the whole verse.'],
      memory: ['From memory now. Take your time.'],
      // Gentle nudge (on a timeout — never a correction).
      again: ['Once more.', "Let's hear it again."],
    },
    ko: {
      connectIntro: ['외우기 전에, 이 말씀이 성경 전체에서 어떻게 이어지는지 함께 볼게요.'],
      connectOutro: ['이게 그 흐름이에요. 이제 마음에 새겨 볼게요.'],
      listen: ['먼저 구절 전체를 들어볼게요.'],
      echo: ['이제 한 부분씩 갈게요. 제가 읽으면, 바로 따라 말해 보세요.'],
      build: ['조금씩 쌓아 볼게요. 매번 맨 처음으로 돌아가서, 다음 부분을 더해 보세요.'],
      fromStart: ['처음부터요.'],
      leadIn: ['제가 처음을 열어드릴게요. 끝까지 이어서 외워 보세요.'],
      finish: ['끝까지 가 보세요.'],
      ref: ['이제 구절만 말씀드릴게요. 전체를 외워 보세요.'],
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
