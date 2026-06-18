import { createElement as h, useState, useEffect } from 'react';
import { getTopic } from '../../data/curriculum/curriculum.js';
import { lookupScripture } from '../../lib/bible.js';
import { isMemorized, subscribeProgress } from '../../lib/progress.js';
import RevelationWalk from './RevelationWalk.js';
import './picker.css';

// One memory verse within a curated topic: the verse itself (memorize via the
// cue ladder) and ITS thread below — the verse's own image-thread when it has
// one, otherwise the topic's spine (§5.2 revelation walk). English text is
// fetched live (ESV); Korean uses the stored 개역개정 text.

const T = {
  en: { begin: 'Begin memorizing', back: 'Back', loading: 'Opening…', error: 'Couldn’t load this verse. Go back and try again.', memorized: 'Memorized' },
  ko: { begin: '암송 시작', back: '뒤로', loading: '여는 중…', error: '구절을 불러오지 못했어요. 돌아가서 다시 시도해 주세요.', memorized: '암송함' },
};

// A spine-riding verse (no thread of its own) borrows the topic spine, but with
// the `moment` station replaced by the rider verse — so the thread always pivots
// on the words being memorized, while the build-up (origin → unfolding) and
// outflow (echo → consummation) carry over unchanged. EN text is fetched live
// (by ref); KO uses the verse's stored 개역개정 text. The pivot's narration comes
// from the verse's own `momentConnection`, falling back to the spine's when the
// rider already IS the spine's moment.
function personalizeSpine(spine, verse) {
  if (!spine || !spine.length) return spine;
  return spine.map((st) =>
    st.position === 'moment'
      ? {
          ...st,
          id: `${verse.id}-moment`,
          ref: verse.ref,
          passageId: verse.passageId,
          text: verse.text,
          connection: verse.momentConnection || st.connection,
        }
      : st
  );
}

export default function VerseLanding({ topicId, verseId, language = 'en', onMemorize, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const topic = getTopic(topicId, lang);
  const verse = topic && topic.memoryVerses.find((v) => v.id === verseId);

  // Re-render when a background sync lands (so the Memorized marker appears).
  const [, tick] = useState(0);
  useEffect(() => subscribeProgress(() => tick((n) => n + 1)), []);

  const stored = verse && verse.text ? verse.text : null;
  const [text, setText] = useState(stored);
  const [loading, setLoading] = useState(Boolean(verse) && !stored);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!verse) return undefined;
    if (verse.text) {
      setText(verse.text);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    setError(false);
    lookupScripture(lang, verse.ref)
      .then((v) => alive && setText(v.text))
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [verseId, lang]);

  const bar = h(
    'header',
    { className: 'picker__bar' },
    h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
    h('p', { className: 'picker__kicker' }, 'Way'),
    h('span', { className: 'picker__spacer', 'aria-hidden': 'true' })
  );

  if (!verse) {
    return h('section', { className: 'curated view-in', lang }, bar, h('p', { className: 'curated__note' }, t.error));
  }

  // The verse's own image-thread, or the topic spine personalized to this verse —
  // the spine's `moment` becomes THIS memory verse, so the thread always pivots on
  // the words being memorized.
  const orbit =
    verse.orbit && verse.orbit.length ? verse.orbit : personalizeSpine(topic.orbit, verse);

  function begin() {
    if (!text) return;
    onMemorize({ refDisplay: verse.ref, passageId: verse.passageId, language: lang, text });
  }

  return h(
    'section',
    { className: 'curated view-in', lang },
    bar,
    verse.label ? h('h1', { className: 'curated__title' }, verse.label) : null,
    h('p', { className: 'curated__ref' }, verse.ref),
    isMemorized(topicId, verseId)
      ? h(
          'p',
          { className: 'curated__memorized' },
          h('span', { className: 'curated__memorized-mark', 'aria-hidden': 'true' }, '✓'),
          t.memorized
        )
      : null,
    loading
      ? h('p', { className: 'curated__note' }, t.loading)
      : error
      ? h('p', { className: 'curated__note' }, t.error)
      : h('p', { className: 'curated__anchor' }, text),
    h(
      'button',
      {
        className: 'btn btn--primary curated__begin',
        type: 'button',
        disabled: loading || error || !text,
        onClick: begin,
      },
      t.begin
    ),
    orbit && orbit.length
      ? h(RevelationWalk, { orbit, language: lang })
      : null
  );
}
