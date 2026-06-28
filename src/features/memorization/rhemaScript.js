// What Rhema says during a session — bilingual, warm, reverent. No gamified
// praise, no scores. Coaching, not grading: a stage loops with help until it's
// held, then advances. Korean uses 존댓말 (no 님 on first names).

export const rhemaScript = {
  en: {
    intro: "Let's begin. I'll read it once — then say it back to me.",
    reviewIntro: "Let's revisit this one. Say it from memory, as your own.",
    stagePrompt: {
      1: 'Here it is, in full. Read it with me.',
      2: 'Some words are hidden now. Fill them in as you go.',
      3: 'Only the first word of each line remains. You know more than you think.',
      4: 'From memory now. Speak it as your own.',
    },
    coach: {
      // Held it — advance.
      mastered: [
        "That's it — you've got it.",
        'Beautiful. That line is yours now.',
        'Yes — perfectly held.',
      ],
      // Not yet — Rhema reads it again and you try the same stage once more.
      again: [
        'Almost — let me read it once more, then take it again.',
        'So close. Listen, and try it again with me.',
        "Let's lock it in. Here it is one more time.",
      ],
      // Tried a few times — move on gently rather than trapping you.
      moveOn: [
        "We'll come back to this one. Let's keep the flow for now.",
        'Good work — we can revisit it. Moving gently on.',
      ],
    },
    continue: [
      'That’s hidden in your heart. Let’s carry on.',
      'Beautiful work. On to the next.',
    ],
    complete: "You've hidden this Word in your heart. Well done.",
  },
  ko: {
    intro: '시작해 볼게요. 제가 한 번 읽을 테니, 따라서 말해 주세요.',
    reviewIntro: '이 구절을 다시 만나볼게요. 마음에 담긴 그대로, 외워서 말해 주세요.',
    stagePrompt: {
      1: '전체 구절이에요. 함께 읽어 볼까요.',
      2: '이제 몇 단어가 사라졌어요. 빈칸을 채우며 외워 보세요.',
      3: '각 줄의 첫 단어만 남았어요. 생각보다 많이 알고 계실 거예요.',
      4: '이제 외워서 말해 보세요. 마음에 담긴 그대로요.',
    },
    coach: {
      mastered: ['바로 그거예요. 다 외우셨어요.', '아름다워요. 이 구절이 이제 마음에 담겼어요.', '네, 완벽하게 외우셨어요.'],
      again: ['거의 다 됐어요. 한 번 더 읽어드릴게요.', '조금만 더요. 듣고 다시 해 보세요.', '한 번 더 새겨볼까요. 다시 들려드릴게요.'],
      moveOn: ['이 구절은 나중에 다시 해 봐요. 지금은 흐름을 이어갈게요.', '좋아요. 다시 돌아올 수 있어요. 부드럽게 넘어갈게요.'],
    },
    continue: ['마음에 새겨졌어요. 계속 가 볼게요.', '잘하셨어요. 다음 구절로 가요.'],
    complete: '이 말씀을 마음에 새기셨어요. 정말 잘하셨어요.',
  },
};

// Short status labels shown beneath Rhema's indicator.
export const statusLabels = {
  en: {
    speaking: 'Rhema is reading',
    ready: 'When you’re ready, recite',
    listening: 'Listening…',
    processing: 'Rhema is reflecting…',
  },
  ko: {
    speaking: '레마가 읽고 있어요',
    ready: '준비되면 암송해 보세요',
    listening: '듣고 있어요…',
    processing: '레마가 살펴보고 있어요…',
  },
};

export function pick(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}
