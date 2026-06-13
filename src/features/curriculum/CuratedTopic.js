import { createElement as h, useState, useEffect } from 'react';
import { getTopic } from '../../data/curriculum/curriculum.js';
import { lookupScripture } from '../../lib/bible.js';
import './picker.css';

// Curated topic landing: the anchor verse (the one memorized) with "Begin
// memorizing". English text is fetched live via /api/bible (ESV); Korean uses
// the stored 개역개정 text when present (no Korean API). The §5.2 revelation
// walk (the thread / orbit) is added in Step B.

const T = {
  en: { anchor: 'Anchor', begin: 'Begin memorizing', back: 'Back', loading: 'Opening…', error: 'Couldn’t load this verse. Go back and try again.' },
  ko: { anchor: '중심 구절', begin: '암송 시작', back: '뒤로', loading: '여는 중…', error: '구절을 불러오지 못했어요. 돌아가서 다시 시도해 주세요.' },
};

export default function CuratedTopic({ topicId, language = 'en', onMemorize, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const topic = getTopic(topicId, lang);

  const stored = topic && topic.anchor.text ? topic.anchor.text : null;
  const [anchorText, setAnchorText] = useState(stored);
  const [loading, setLoading] = useState(Boolean(topic) && !stored);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!topic) return undefined;
    if (topic.anchor.text) {
      setAnchorText(topic.anchor.text);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    setError(false);
    // English: fetch the anchor's verified ESV text live (never stored).
    lookupScripture(lang, topic.anchor.ref)
      .then((v) => alive && setAnchorText(v.text))
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [topicId, lang]);

  const bar = h(
    'header',
    { className: 'picker__bar' },
    h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
    h('p', { className: 'picker__kicker' }, 'Way'),
    h('span', { className: 'picker__spacer', 'aria-hidden': 'true' })
  );

  if (!topic) {
    return h(
      'section',
      { className: 'curated view-in', lang },
      bar,
      h('p', { className: 'curated__note' }, t.error)
    );
  }

  function begin() {
    if (!anchorText) return;
    onMemorize({
      refDisplay: topic.anchor.ref,
      passageId: topic.anchor.passageId,
      language: lang,
      text: anchorText,
    });
  }

  return h(
    'section',
    { className: 'curated view-in', lang },
    bar,
    h('h1', { className: 'curated__title' }, topic.title),
    topic.subtitle ? h('p', { className: 'curated__subtitle' }, topic.subtitle) : null,
    h('p', { className: 'curated__eyebrow' }, t.anchor.toUpperCase()),
    h('p', { className: 'curated__ref' }, topic.anchor.ref),
    loading
      ? h('p', { className: 'curated__note' }, t.loading)
      : error
      ? h('p', { className: 'curated__note' }, t.error)
      : h('p', { className: 'curated__anchor' }, anchorText),
    h(
      'button',
      {
        className: 'btn btn--primary curated__begin',
        type: 'button',
        disabled: loading || error || !anchorText,
        onClick: begin,
      },
      t.begin
    )
  );
}
