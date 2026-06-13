import { createElement as h, useState } from 'react';
import MemorizationSession from './features/memorization/MemorizationSession.js';
import TopicPicker from './features/curriculum/TopicPicker.js';
import AddVerse from './features/library/AddVerse.js';
import { buildPassage, buildPassageFromText } from './data/personalLibrary.js';
import { addVerse, setMemorizing } from './lib/library.js';

// Views: landing → picker (curated topics) or add (personal verse) → session.
// Selecting a curated verse hands the session the whole topic as a queue;
// a personal verse is a single-passage session.
export default function App() {
  const [view, setView] = useState('landing');
  const [language, setLanguage] = useState('en');
  const [queue, setQueue] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  // Persist the personal verse if a session is available. This is best-effort:
  // the library is auth-gated (RLS) and sign-in isn't wired yet, so a failure
  // here must never block memorizing — the data layer lights up once auth lands.
  async function persist(verse, memorizing) {
    try {
      const row = await addVerse({
        passageId: verse.passageId,
        refDisplay: verse.reference,
        translation: verse.translation,
      });
      if (memorizing && row) await setMemorizing(row.id);
    } catch (e) {
      console.warn('[Way] library save skipped:', e?.message || e);
    }
  }

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

  if (view === 'add') {
    return h(AddVerse, {
      language,
      onLanguage: setLanguage,
      // save → memorize: the default path (library-spec §1).
      onMemorize: (verse) => {
        persist(verse, true);
        setQueue([buildPassageFromText(verse)]);
        setStartIndex(0);
        setView('session');
      },
      // carry it now, memorize later (status 'saved').
      onSave: (verse) => {
        persist(verse, false);
        setView('landing');
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
        'button',
        {
          className: 'btn btn--quiet way-add',
          type: 'button',
          onClick: () => setView('add'),
        },
        'Add a verse'
      ),
      h(
        'p',
        { className: 'way-rhema' },
        'Coached by Rhema (ῥῆμα) — the spoken Word.'
      )
    )
  );
}
