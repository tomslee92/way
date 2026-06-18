import { createElement as h } from 'react';
import { getTopics } from '../../data/curriculum/curriculum.js';
import { memorizedVerseIds } from '../../lib/progress.js';
import ThemeToggle from './ThemeToggle.js';
import './picker.css';

// Choose a language and a curated topic. Each topic is an anchor-and-orbit
// grouping (see ../../data/curriculum); selecting one opens its landing, where
// the anchor is memorized and the orbit is walked. The selected language drives
// the verse text and Rhema's spoken instructions.
export default function TopicPicker({ language = 'en', onLanguage, onSelect, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const topics = getTopics(lang);

  return h(
    'section',
    { className: 'picker', lang },
    h(
      'header',
      { className: 'picker__bar' },
      onExit
        ? h(
            'button',
            { className: 'btn btn--quiet', type: 'button', onClick: onExit },
            lang === 'ko' ? '뒤로' : 'Back'
          )
        : h('span', { className: 'picker__spacer', 'aria-hidden': 'true' }),
      h('p', { className: 'picker__kicker' }, 'Way'),
      h(
        'div',
        { className: 'picker__tools' },
        h(ThemeToggle, { language: lang }),
        h(
          'div',
          { className: 'langtoggle', role: 'group', 'aria-label': 'Language' },
          h(
            'button',
            {
              type: 'button',
              className: 'langtoggle__opt',
              'data-on': lang === 'en' ? 'true' : undefined,
              onClick: () => onLanguage && onLanguage('en'),
            },
            'EN'
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'langtoggle__opt',
              'data-on': lang === 'ko' ? 'true' : undefined,
              onClick: () => onLanguage && onLanguage('ko'),
            },
            '한국어'
          )
        )
      )
    ),

    h(
      'h1',
      { className: 'picker__title' },
      lang === 'ko' ? '무엇을 마음에 새길까요?' : 'What will you hide in your heart?'
    ),

    h(
      'ul',
      { className: 'topic-list' },
      topics.map((topic) => {
        const total = topic.memoryVerses.length;
        const done = memorizedVerseIds(topic.id).size;
        const allDone = total > 0 && done === total;
        const progressLabel =
          lang === 'ko' ? `${total}구절 중 ${done}구절 암송함` : `${done} of ${total} memorized`;
        return h(
          'li',
          { key: topic.id },
          h(
            'button',
            { className: 'topic-card', type: 'button', 'data-complete': allDone ? 'true' : undefined, onClick: () => onSelect(topic.id) },
            h(
              'span',
              { className: 'topic-card__body' },
              h('span', { className: 'topic-card__title' }, topic.title),
              topic.subtitle
                ? h('span', { className: 'topic-card__subtitle' }, topic.subtitle)
                : null,
              h(
                'span',
                { className: 'topic-card__anchor' },
                lang === 'ko'
                  ? `${total}구절`
                  : `${total} ${total === 1 ? 'verse' : 'verses'}`
              )
            ),
            done
              ? h(
                  'span',
                  { className: 'topic-card__progress', role: 'img', 'aria-label': progressLabel },
                  allDone ? '✓' : `${done}/${total}`
                )
              : null
          )
        );
      })
    )
  );
}
