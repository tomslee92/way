import { createElement as h } from 'react';
import { getTopic } from '../../data/curriculum/curriculum.js';
import { memorizedVerseIds } from '../../lib/progress.js';
import './picker.css';

// Curated topic landing: the CLUSTER of red-letter memory verses (Jesus's words
// on the theme). Tapping a verse opens its own landing — the verse + its thread
// + the cue ladder. (A typological cluster like I AM gives each verse its own
// image-thread; a thematic cluster shares the topic thread.)

const T = {
  en: { eyebrow: 'Memory verses', back: 'Back', missing: 'This topic isn’t available yet.', memorized: 'Memorized' },
  ko: { eyebrow: '암송 구절', back: '뒤로', missing: '이 주제는 아직 준비되지 않았어요.', memorized: '암송함' },
};

export default function CuratedTopic({ topicId, language = 'en', onSelectVerse, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const topic = getTopic(topicId, lang);

  const bar = h(
    'header',
    { className: 'picker__bar' },
    h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
    h('p', { className: 'picker__kicker' }, 'Way'),
    h('span', { className: 'picker__spacer', 'aria-hidden': 'true' })
  );

  if (!topic) {
    return h('section', { className: 'curated view-in', lang }, bar, h('p', { className: 'curated__note' }, t.missing));
  }

  // Which verses in this topic have been carried from memory (local progress).
  const done = memorizedVerseIds(topicId);
  const total = topic.memoryVerses.length;
  const eyebrow = done.size ? `${t.eyebrow} · ${done.size}/${total}` : t.eyebrow;

  return h(
    'section',
    { className: 'curated view-in', lang },
    bar,
    h('h1', { className: 'curated__title' }, topic.title),
    topic.subtitle ? h('p', { className: 'curated__subtitle' }, topic.subtitle) : null,
    h('p', { className: 'curated__eyebrow' }, eyebrow.toUpperCase()),
    h(
      'ul',
      { className: 'mv-list' },
      topic.memoryVerses.map((verse) => {
        const memorized = done.has(verse.id);
        return h(
          'li',
          { key: verse.id },
          h(
            'button',
            { className: 'mv', type: 'button', 'data-memorized': memorized ? 'true' : undefined, onClick: () => onSelectVerse(verse.id) },
            h(
              'span',
              { className: 'mv__text' },
              h('span', { className: 'mv__label' }, verse.label || verse.ref),
              h('span', { className: 'mv__ref' }, verse.ref)
            ),
            memorized
              ? h('span', { className: 'mv__check', role: 'img', 'aria-label': t.memorized }, '✓')
              : null
          )
        );
      })
    )
  );
}
