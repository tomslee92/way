import { createElement as h, useState } from 'react';
import MemorizationSession from './features/memorization/MemorizationSession.js';
import TopicPicker from './features/curriculum/TopicPicker.js';
import AddVerse from './features/library/AddVerse.js';
import LibraryView from './features/library/LibraryView.js';
import { buildPassage, buildPassageFromText } from './data/personalLibrary.js';
import { addVerse, setMemorizing } from './lib/library.js';
import { lookupScripture, languageFor } from './lib/bible.js';

// Views: landing → picker (curated topics) | add (find a verse) | library
// (verses you carry) → session. The session returns to wherever it was opened.
export default function App() {
  const [view, setView] = useState('landing');
  const [language, setLanguage] = useState('en');
  const [queue, setQueue] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [returnTo, setReturnTo] = useState('picker');

  // Persist a freshly-found personal verse. Best-effort: the library is
  // auth-gated (RLS) and sign-in isn't wired yet, so a failure here must never
  // block memorizing — the data layer lights up once auth lands.
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

  function startSession(passages, from, idx = 0) {
    setQueue(passages);
    setStartIndex(idx);
    setReturnTo(from);
    setView('session');
  }

  if (view === 'picker') {
    return h(TopicPicker, {
      language,
      onLanguage: setLanguage,
      onSelect: (verses, idx) =>
        startSession(verses.map((v) => buildPassage(v, language)), 'picker', idx),
      onExit: () => setView('landing'),
    });
  }

  if (view === 'add') {
    return h(AddVerse, {
      language,
      // save → memorize: the default path (library-spec §1).
      onMemorize: (verse) => {
        persist(verse, true);
        startSession([buildPassageFromText(verse)], 'library');
      },
      // carry it now, memorize later (status 'saved').
      onSave: (verse) => {
        persist(verse, false);
        setView('library');
      },
      onExit: () => setView('landing'),
    });
  }

  if (view === 'library') {
    return h(LibraryView, {
      language,
      onAdd: () => setView('add'),
      // Memorize a stored verse: re-fetch its verified text live (never stored),
      // then reuse the session. Status changes are owned by LibraryView.
      onMemorize: async (item) => {
        try {
          const lang = languageFor(item.translation);
          const v = await lookupScripture(lang, item.passage_id);
          startSession([buildPassageFromText(v)], 'library');
        } catch (e) {
          console.warn('[Way] could not open verse:', e?.message || e);
        }
      },
      onExit: () => setView('landing'),
    });
  }

  if (view === 'session' && queue) {
    return h(MemorizationSession, {
      passages: queue,
      startIndex,
      onExit: () => setView(returnTo),
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
        { className: 'btn btn--quiet way-add', type: 'button', onClick: () => setView('add') },
        'Add a verse'
      ),
      h(
        'button',
        { className: 'btn btn--quiet way-add', type: 'button', onClick: () => setView('library') },
        'Library'
      ),
      h('p', { className: 'way-rhema' }, 'Coached by Rhema (ῥῆμα) — the spoken Word.')
    )
  );
}
