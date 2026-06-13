import { createElement as h, useState, useEffect, useRef } from 'react';
import MemorizationSession from './features/memorization/MemorizationSession.js';
import TopicPicker from './features/curriculum/TopicPicker.js';
import AddVerse from './features/library/AddVerse.js';
import LibraryView from './features/library/LibraryView.js';
import SignIn from './features/auth/SignIn.js';
import Onboarding from './features/auth/Onboarding.js';
import { buildPassage, buildPassageFromText } from './data/personalLibrary.js';
import { addVerse, setMemorizing, markRecalled, listLibrary } from './lib/library.js';
import { lookupScripture, languageFor } from './lib/bible.js';
import { getSession, onAuthChange, signOut } from './lib/auth.js';
import { getProfile, saveLanguage } from './lib/profile.js';
import { dueReviews } from './features/library/review.js';
import ReviewInvitation from './features/library/ReviewInvitation.js';

// Views: landing → picker (curated topics) | add (find a verse) | library
// (verses you carry) → session. The session returns to wherever it was opened.
export default function App() {
  const [view, setView] = useState('landing');
  // Language is remembered in localStorage for everyone (the open curated
  // experience needs no login); the profile syncs it for signed-in users.
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('way:language') === 'ko' ? 'ko' : 'en';
    } catch {
      return 'en';
    }
  });
  const [queue, setQueue] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [returnTo, setReturnTo] = useState('picker');
  const [reviewId, setReviewId] = useState(null); // set when a session is a §3 review
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [dueInvites, setDueInvites] = useState([]);
  const [dismissedInvites, setDismissedInvites] = useState(() => new Set());
  const profileLoadedRef = useRef(false);

  // Track the auth session. A magic-link return establishes it on load.
  useEffect(() => {
    let alive = true;
    getSession().then((s) => alive && setSession(s));
    const unsub = onAuthChange(setSession);
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  // Persist the chosen language: state + localStorage (everyone), and the
  // profile when signed in. Applying a language *from* the profile uses
  // setStoredLanguage so we don't write it straight back.
  function setStoredLanguage(lang) {
    setLanguage(lang);
    try {
      localStorage.setItem('way:language', lang);
    } catch {
      /* ignore */
    }
  }
  function applyLanguage(lang) {
    setStoredLanguage(lang);
    if (session) saveLanguage(lang).catch(() => {});
  }

  // After signing in, go where the user was headed (remembered across the
  // magic-link round-trip via sessionStorage). No pending → stay put.
  function consumePending() {
    const pending = sessionStorage.getItem('way:pending');
    if (pending) {
      sessionStorage.removeItem('way:pending');
      setView(pending);
    }
  }

  // On first sign-in, load the profile once: apply its language and continue,
  // or (no profile yet) send the user through onboarding. A missing table or
  // error never traps — proceed on the localStorage language.
  useEffect(() => {
    if (!session || profileLoadedRef.current) return undefined;
    profileLoadedRef.current = true;
    let alive = true;
    getProfile()
      .then((p) => {
        if (!alive) return;
        if (p && p.language) {
          setStoredLanguage(p.language);
          consumePending();
        } else {
          setView('onboarding');
        }
      })
      .catch(() => alive && consumePending());
    return () => {
      alive = false;
    };
  }, [session]);

  // Reset the once-guard on sign-out.
  useEffect(() => {
    if (!session) profileLoadedRef.current = false;
  }, [session]);

  // Surface §3 review invitations on the landing for signed-in users. Refetch
  // each time we land here so a just-reviewed verse drops off.
  useEffect(() => {
    if (!session || view !== 'landing') return undefined;
    let alive = true;
    listLibrary({ status: 'memorized' })
      .then((rows) => alive && setDueInvites(dueReviews(rows)))
      .catch(() => alive && setDueInvites([]));
    return () => {
      alive = false;
    };
  }, [session, view]);

  // The personal library is gated; the curated experience stays open.
  function requireAuth(target) {
    if (session) {
      setView(target);
      return;
    }
    sessionStorage.setItem('way:pending', target);
    setView('signin');
  }

  function handleSignOut() {
    signOut().catch(() => {});
    sessionStorage.removeItem('way:pending');
    setView('landing');
  }

  // Persist a freshly-found personal verse. Best-effort: writes are RLS-gated
  // and also need the migration applied, so a failure here must never block
  // memorizing — the verse is still memorizable in the moment.
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

  function startSession(passages, from, idx = 0, reviewItemId = null) {
    setQueue(passages);
    setStartIndex(idx);
    setReturnTo(from);
    setReviewId(reviewItemId);
    setView('session');
  }

  // Open a stored verse: re-fetch its verified text live (never stored), then
  // reuse the session. A review starts at Stage 4 and records markRecalled on
  // completion (time signal only — never status; the app never demotes). It
  // returns to wherever it was opened (`from`).
  async function openLibraryItem(item, review, from = 'library') {
    try {
      const lang = languageFor(item.translation);
      const v = await lookupScripture(lang, item.passage_id);
      startSession([buildPassageFromText(v)], from, 0, review ? item.id : null);
    } catch (e) {
      console.warn('[Way] could not open verse:', e?.message || e);
    }
  }

  if (view === 'picker') {
    return h(TopicPicker, {
      language,
      onLanguage: applyLanguage,
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
      onMemorize: (item) => openLibraryItem(item, false),
      onReview: (item) => openLibraryItem(item, true),
      onSignOut: handleSignOut,
      onExit: () => setView('landing'),
    });
  }

  if (view === 'signin') {
    return h(SignIn, {
      language,
      onCancel: () => {
        sessionStorage.removeItem('way:pending');
        setView('landing');
      },
    });
  }

  if (view === 'onboarding') {
    return h(Onboarding, {
      language,
      onChoose: (lang) => {
        applyLanguage(lang);
        const pending = sessionStorage.getItem('way:pending');
        sessionStorage.removeItem('way:pending');
        setView(pending || 'landing');
      },
    });
  }

  if (view === 'session' && queue) {
    return h(MemorizationSession, {
      passages: queue,
      startIndex,
      review: Boolean(reviewId),
      // A finished review records that it happened (never a status, never a grade).
      onComplete: reviewId ? () => markRecalled(reviewId).catch(() => {}) : undefined,
      onExit: () => setView(returnTo),
    });
  }

  // The most-overdue, not-yet-dismissed review (signed-in users only).
  const landingInvite = dueInvites.find((it) => !dismissedInvites.has(it.id));

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
      // §3 invitation — Rhema reaches out before you begin (signed-in + due).
      landingInvite
        ? h(ReviewInvitation, {
            item: landingInvite,
            language,
            onRevisit: (item) => openLibraryItem(item, true, 'landing'),
            onDismiss: () =>
              setDismissedInvites((prev) => {
                const next = new Set(prev);
                next.add(landingInvite.id);
                return next;
              }),
          })
        : null,
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
        { className: 'btn btn--quiet way-add', type: 'button', onClick: () => requireAuth('add') },
        'Add a verse'
      ),
      h(
        'button',
        { className: 'btn btn--quiet way-add', type: 'button', onClick: () => requireAuth('library') },
        'Library'
      ),
      h('p', { className: 'way-rhema' }, 'Coached by Rhema (ῥῆμα) — the spoken Word.')
    )
  );
}
