import { createElement as h, useState } from 'react';
import MemorizationSession from './features/memorization/MemorizationSession.js';
import TopicPicker from './features/curriculum/TopicPicker.js';
import { buildPassage } from './data/personalLibrary.js';

// Views: landing → picker (pick language + passage) → session → back to picker.
// Selecting a verse hands the session the whole topic as a queue (starting at
// that verse) so it flows continuously from one verse to the next.
export default function App() {
  const [view, setView] = useState('landing');
  const [language, setLanguage] = useState('en');
  const [queue, setQueue] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  if (view === 'picker') {
    return h(TopicPicker, {
      language,
      onLanguage: setLanguage,
      onSelect: (verses, idx) => {
        setQueue(verses.map((v) => buildPassage(v, language)));
        setStartIndex(idx);
        setView('session');
      },
      onExit: () => setView('landing'),
    });
  }

  if (view === 'session' && queue) {
    return h(MemorizationSession, {
      passages: queue,
      startIndex,
      onExit: () => setView('picker'),
    });
  }

  return h(
    'main',
    { className: 'way-app' },
    h(
      'div',
      { className: 'way-hero' },
      h('p', { className: 'way-kicker' }, 'Way'),
      h('h1', { className: 'way-title' }, 'I am the way, the truth, and the life.'),
      h('p', { className: 'way-ref' }, 'John 14:6 · 요한복음 14:6'),
      h(
        'p',
        { className: 'way-lede' },
        'A premium, voice-coached Scripture memorization companion — ',
        'one verse at a time, in English and 한국어.'
      ),
      h(
        'button',
        {
          className: 'btn btn--primary',
          type: 'button',
          onClick: () => setView('picker'),
        },
        'Begin memorizing'
      ),
      h(
        'p',
        { className: 'way-rhema' },
        'Coached by Rhema (ῥῆμα) — the spoken Word.'
      )
    )
  );
}
