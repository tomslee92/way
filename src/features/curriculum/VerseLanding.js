import { createElement as h, useState, useEffect } from 'react';
import { getTopic } from '../../data/curriculum/curriculum.js';
import { lookupScripture } from '../../lib/bible.js';
import RevelationWalk from './RevelationWalk.js';
import './picker.css';

// One memory verse within a curated topic: the verse itself (memorize via the
// cue ladder) and ITS thread below — the verse's own image-thread when it has
// one, otherwise the topic's spine (§5.2 revelation walk). English text is
// fetched live (ESV); Korean uses the stored 개역개정 text.

const T = {
  en: { begin: 'Begin memorizing', back: 'Back', loading: 'Opening…', error: 'Couldn’t load this verse. Go back and try again.' },
  ko: { begin: '암송 시작', back: '뒤로', loading: '여는 중…', error: '구절을 불러오지 못했어요. 돌아가서 다시 시도해 주세요.' },
};

export default function VerseLanding({ topicId, verseId, language = 'en', onMemorize, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const topic = getTopic(topicId, lang);
  const verse = topic && topic.memoryVerses.find((v) => v.id === verseId);

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

  // The verse's own image-thread, or the topic spine as fallback.
  const orbit = verse.orbit && verse.orbit.length ? verse.orbit : topic.orbit;

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
      ? h(RevelationWalk, {
          orbit,
          language: lang,
          memoryVerse: { ref: verse.ref, text: text || undefined },
        })
      : null
  );
}
