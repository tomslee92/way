import { createElement as h, useState } from 'react';
import { getTopic } from '../../data/curriculum/curriculum.js';
import { lookupScripture } from '../../lib/bible.js';
import RevelationWalk from './RevelationWalk.js';
import './picker.css';

// Curated topic landing: a CLUSTER of red-letter memory verses (Jesus's words on
// the theme) — pick any to memorize via the cue ladder — and one thread (the
// OT→NT arc) below, walked for context (the §5.2 revelation walk). English text
// is fetched live (ESV) on tap; Korean uses the stored 개역개정 text when present.

const T = {
  en: { eyebrow: 'Memory verses', back: 'Back', loading: 'Opening…', error: 'Couldn’t load this verse. Try again.' },
  ko: { eyebrow: '암송 구절', back: '뒤로', loading: '여는 중…', error: '구절을 불러오지 못했어요. 다시 시도해 주세요.' },
};

export default function CuratedTopic({ topicId, language = 'en', onMemorize, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const topic = getTopic(topicId, lang);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(false);

  const bar = h(
    'header',
    { className: 'picker__bar' },
    h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
    h('p', { className: 'picker__kicker' }, 'Way'),
    h('span', { className: 'picker__spacer', 'aria-hidden': 'true' })
  );

  if (!topic) {
    return h('section', { className: 'curated view-in', lang }, bar, h('p', { className: 'curated__note' }, t.error));
  }

  async function memorize(verse) {
    setBusyId(verse.id);
    setError(false);
    try {
      // English: fetch the verse's verified ESV text live; Korean: stored text.
      const text = verse.text || (await lookupScripture(lang, verse.ref)).text;
      onMemorize({ refDisplay: verse.ref, passageId: verse.passageId, language: lang, text });
    } catch (e) {
      setError(true);
    } finally {
      setBusyId(null);
    }
  }

  return h(
    'section',
    { className: 'curated view-in', lang },
    bar,
    h('h1', { className: 'curated__title' }, topic.title),
    topic.subtitle ? h('p', { className: 'curated__subtitle' }, topic.subtitle) : null,
    h('p', { className: 'curated__eyebrow' }, t.eyebrow.toUpperCase()),
    h(
      'ul',
      { className: 'mv-list' },
      topic.memoryVerses.map((verse) =>
        h(
          'li',
          { key: verse.id },
          h(
            'button',
            {
              className: 'mv',
              type: 'button',
              disabled: busyId === verse.id,
              onClick: () => memorize(verse),
            },
            h('span', { className: 'mv__label' }, verse.label || verse.ref),
            h('span', { className: 'mv__ref' }, busyId === verse.id ? t.loading : verse.ref)
          )
        )
      )
    ),
    error ? h('p', { className: 'curated__note' }, t.error) : null,
    topic.orbit && topic.orbit.length ? h(RevelationWalk, { topic, language: lang }) : null
  );
}
