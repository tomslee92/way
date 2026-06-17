import { createElement as h } from 'react';
import { getTopics } from '../../data/curriculum/curriculum.js';
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
      topics.map((topic) =>
        h(
          'li',
          { key: topic.id },
          h(
            'button',
            { className: 'topic-card', type: 'button', onClick: () => onSelect(topic.id) },
            h('span', { className: 'topic-card__title' }, topic.title),
            topic.subtitle
              ? h('span', { className: 'topic-card__subtitle' }, topic.subtitle)
              : null,
            h(
              'span',
              { className: 'topic-card__anchor' },
              lang === 'ko'
                ? `${topic.memoryVerses.length}구절`
                : `${topic.memoryVerses.length} ${topic.memoryVerses.length === 1 ? 'verse' : 'verses'}`
            )
          )
        )
      )
    )
  );
}
