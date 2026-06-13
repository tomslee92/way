// Personal-library helper + seed verse sets.
//
// Renamed from data/curriculum.js so the name no longer collides with the new
// curated-topics tree at data/curriculum/ (anchor-and-orbit topics). This module
// owns the personal-library side: turning a chosen verse into a session-ready
// passage via buildPassage(). The `curriculum` array below is the original MVP
// seed set still rendered by TopicPicker; Phase 6 replaces that picker with the
// curated topics, after which this file keeps only the library helpers.
//
// IMPORTANT: this text (English ~ESV, Korean ~개역개정) is hand-entered seed data
// and must be verified against an authoritative source — ideally replaced by
// /api/bible (the user's chosen translation) — before real use. Accuracy
// matters: people memorize exactly what's shown. Line breaks define the
// fading-method "lines".
//
// Each verse: { reference, referenceKo, passageId, text (en), textKo (ko) }.

export const curriculum = [
  {
    topic: 'The Way',
    topicKo: '길',
    verses: [
      {
        reference: 'John 14:6',
        referenceKo: '요한복음 14:6',
        passageId: 'JHN.14.6',
        text: [
          'Jesus said to him,',
          '"I am the way, and the truth, and the life.',
          'No one comes to the Father',
          'except through me."',
        ].join('\n'),
        textKo: [
          '예수께서 이르시되',
          '내가 곧 길이요 진리요 생명이니',
          '나로 말미암지 않고는',
          '아버지께로 올 자가 없느니라',
        ].join('\n'),
      },
      {
        reference: 'John 8:12',
        referenceKo: '요한복음 8:12',
        passageId: 'JHN.8.12',
        text: [
          '"I am the light of the world.',
          'Whoever follows me will not walk in darkness,',
          'but will have the light of life."',
        ].join('\n'),
        textKo: [
          '나는 세상의 빛이니',
          '나를 따르는 자는 어둠에 다니지 아니하고',
          '생명의 빛을 얻으리라',
        ].join('\n'),
      },
    ],
  },
  {
    topic: 'Overcoming Fear',
    topicKo: '두려움을 이기기',
    verses: [
      {
        reference: 'Isaiah 41:10',
        referenceKo: '이사야 41:10',
        passageId: 'ISA.41.10',
        text: [
          'Fear not, for I am with you;',
          'be not dismayed, for I am your God;',
          'I will strengthen you, I will help you,',
          'I will uphold you with my righteous right hand.',
        ].join('\n'),
        textKo: [
          '두려워하지 말라 내가 너와 함께 함이라',
          '놀라지 말라 나는 네 하나님이 됨이라',
          '내가 너를 굳세게 하리라 참으로 너를 도와 주리라',
          '참으로 나의 의로운 오른손으로 너를 붙들리라',
        ].join('\n'),
      },
      {
        reference: '2 Timothy 1:7',
        referenceKo: '디모데후서 1:7',
        passageId: '2TI.1.7',
        text: [
          'For God gave us a spirit not of fear',
          'but of power and love and self-control.',
        ].join('\n'),
        textKo: [
          '하나님이 우리에게 주신 것은 두려워하는 마음이 아니요',
          '오직 능력과 사랑과 절제하는 마음이니',
        ].join('\n'),
      },
    ],
  },
  {
    topic: 'Love',
    topicKo: '사랑',
    verses: [
      {
        reference: 'John 3:16',
        referenceKo: '요한복음 3:16',
        passageId: 'JHN.3.16',
        text: [
          'For God so loved the world,',
          'that he gave his only Son,',
          'that whoever believes in him should not perish',
          'but have eternal life.',
        ].join('\n'),
        textKo: [
          '하나님이 세상을 이처럼 사랑하사',
          '독생자를 주셨으니',
          '이는 그를 믿는 자마다 멸망하지 않고',
          '영생을 얻게 하려 하심이라',
        ].join('\n'),
      },
      {
        reference: '1 John 4:19',
        referenceKo: '요한일서 4:19',
        passageId: '1JN.4.19',
        text: ['We love', 'because he first loved us.'].join('\n'),
        textKo: ['우리가 사랑함은', '그가 먼저 우리를 사랑하셨음이라'].join('\n'),
      },
    ],
  },
  {
    topic: 'Strength & Peace',
    topicKo: '힘과 평안',
    verses: [
      {
        reference: 'Joshua 1:9',
        referenceKo: '여호수아 1:9',
        passageId: 'JOS.1.9',
        text: [
          'Be strong and courageous.',
          'Do not be frightened, and do not be dismayed,',
          'for the Lord your God is with you',
          'wherever you go.',
        ].join('\n'),
        textKo: [
          '강하고 담대하라',
          '두려워하지 말며 놀라지 말라',
          '네가 어디로 가든지',
          '네 하나님 여호와가 너와 함께 하느니라',
        ].join('\n'),
      },
      {
        reference: 'Philippians 4:6-7',
        referenceKo: '빌립보서 4:6-7',
        passageId: 'PHP.4.6-PHP.4.7',
        text: [
          'do not be anxious about anything,',
          'but in everything by prayer and supplication',
          'with thanksgiving',
          'let your requests be made known to God.',
          'And the peace of God,',
          'which surpasses all understanding,',
          'will guard your hearts and your minds in Christ Jesus.',
        ].join('\n'),
        textKo: [
          '아무것도 염려하지 말고',
          '다만 모든 일에 기도와 간구로',
          '너희 구할 것을 감사함으로 하나님께 아뢰라',
          '그리하면 모든 지각에 뛰어난 하나님의 평강이',
          '그리스도 예수 안에서',
          '너희 마음과 생각을 지키시리라',
        ].join('\n'),
      },
    ],
  },
];

// Build a session-ready passage in the chosen language.
export function buildPassage(verse, language) {
  const lang = language === 'ko' ? 'ko' : 'en';
  return {
    reference: verse.reference,
    referenceKo: verse.referenceKo,
    passageId: verse.passageId,
    language: lang,
    text: lang === 'ko' ? verse.textKo : verse.text,
  };
}

// Build a session-ready passage from verified /api/bible text (a personal-
// library verse). A personal verse has a single reference (not an EN/KO pair),
// so both reference fields hold the same localized display string. Text is
// split into fading "lines" at sentence boundaries; clause-level splitting
// (commas/semicolons/colons, DESIGN.md §5.1) is part of the dedicated fade pass.
export function buildPassageFromText({ refDisplay, passageId, language, text }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  return {
    reference: refDisplay,
    referenceKo: refDisplay,
    passageId,
    language: lang,
    text: splitSentences(text).join('\n'),
  };
}

function splitSentences(text) {
  const clean = String(text).replace(/\s+/g, ' ').trim();
  // Keep each sentence's terminator; handles EN . ? ! and KO 。 ！ ？
  const parts = clean.match(/[^.!?。！？]+[.!?。！？]*\s*/g);
  const lines = (parts || [clean]).map((s) => s.trim()).filter(Boolean);
  return lines.length ? lines : [clean];
}
