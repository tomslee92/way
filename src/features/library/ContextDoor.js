import { createElement as h, useState, useEffect } from 'react';
import { fetchContext } from '../../lib/bible.js';
import './library.css';

// "Read it in context" (library-spec §4) — the only safe depth for a personal
// verse. It asserts NOTHING: no other verses, no cross-references, no generated
// connections. It shows the surrounding paragraph (via /api/bible) and pairs it
// with Rhema's fixed method questions so the *user* does the connecting. A door,
// never a hallway: quiet, optional, and it returns to the verse.

const T = {
  en: {
    eyebrow: 'Read it in context',
    intro: 'Before you memorize this, read it in its own paragraph.',
    ask: 'As you read, ask:',
    questions: [
      'Who is speaking?',
      'To whom?',
      'What came just before?',
      'Where does this land in Christ?',
    ],
    back: 'Back to the verse',
    loading: 'Opening the paragraph…',
    error: 'Couldn’t open the surrounding text. Go back and try again.',
  },
  ko: {
    eyebrow: '맥락 속에서 읽기',
    intro: '암송하기 전에, 이 구절을 한 단락 안에서 함께 읽어 보세요.',
    ask: '읽으면서 스스로 물어보세요:',
    questions: [
      '누가 말하고 있나요?',
      '누구에게 하는 말인가요?',
      '바로 앞에는 무슨 일이 있었나요?',
      '이 말씀은 그리스도 안에서 어디에 닿나요?',
    ],
    back: '구절로 돌아가기',
    loading: '단락을 여는 중…',
    error: '앞뒤 본문을 열지 못했어요. 돌아가서 다시 시도해 주세요.',
  },
};

// Personal-library Scripture is English-only; the surrounding text is English.
const SCRIPTURE_LANG = 'en';

export default function ContextDoor({ language = 'en', verse, onBack }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];

  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    fetchContext(SCRIPTURE_LANG, verse.passageId)
      .then((d) => alive && setContext(d))
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [verse.passageId]);

  let reading;
  if (loading) {
    reading = h('p', { className: 'context__note' }, t.loading);
  } else if (error || !context) {
    reading = h('p', { className: 'context__note' }, t.error);
  } else {
    reading = h(
      'div',
      null,
      h('p', { className: 'context__ref' }, context.reference),
      h('p', { className: 'context__text' }, context.text)
    );
  }

  return h(
    'section',
    { className: 'context view-in', lang },
    h(
      'header',
      { className: 'addverse__bar' },
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: onBack }, t.back),
      h('p', { className: 'addverse__kicker' }, t.eyebrow.toUpperCase()),
      h('span', { className: 'addverse__spacer' })
    ),
    h('p', { className: 'context__intro' }, t.intro),
    reading,
    h(
      'div',
      { className: 'context__method' },
      h('p', { className: 'context__ask' }, t.ask),
      h(
        'ul',
        { className: 'context__questions' },
        t.questions.map((q, i) => h('li', { key: i, className: 'context__question' }, q))
      )
    )
  );
}
