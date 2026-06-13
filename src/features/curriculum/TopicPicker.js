import { createElement as h } from 'react';
import { curriculum } from '../../data/personalLibrary.js';
import './picker.css';

// Choose a language and what to memorize. The selected language drives both the
// verse text and Rhema's spoken instructions in the session.
export default function TopicPicker({ language = 'en', onLanguage, onSelect, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';

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
    ),

    h(
      'h1',
      { className: 'picker__title' },
      lang === 'ko' ? '무엇을 마음에 새길까요?' : 'What will you hide in your heart?'
    ),

    h(
      'div',
      { className: 'picker__topics' },
      curriculum.map((topic, ti) =>
        h(
          'section',
          { className: 'topic', key: ti },
          h('h2', { className: 'topic__name' }, lang === 'ko' ? topic.topicKo : topic.topic),
          h(
            'ul',
            { className: 'topic__verses' },
            topic.verses.map((verse, vi) =>
              h(
                'li',
                { key: vi },
                h(
                  'button',
                  {
                    className: 'verse',
                    type: 'button',
                    // Hand the whole topic as a queue, starting at this verse,
                    // so the session flows continuously through the topic.
                    onClick: () => onSelect(topic.verses, vi),
                  },
                  h(
                    'span',
                    { className: 'verse__ref' },
                    lang === 'ko' ? verse.referenceKo : verse.reference
                  ),
                  h(
                    'span',
                    { className: 'verse__peek' },
                    peek(lang === 'ko' ? verse.textKo : verse.text)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

// First few words of a verse, as a quiet preview.
function peek(text) {
  const words = text.replace(/\n/g, ' ').replace(/^[^\p{L}"']+/u, '').split(/\s+/);
  return words.slice(0, 6).join(' ') + (words.length > 6 ? '…' : '');
}
