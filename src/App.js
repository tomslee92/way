import { createElement as h, useState, useEffect, useRef } from 'react';
import MemorizationSession from './features/memorization/MemorizationSession.js';
import TopicPicker from './features/curriculum/TopicPicker.js';
import CuratedTopic from './features/curriculum/CuratedTopic.js';
import VerseLanding from './features/curriculum/VerseLanding.js';
import AddVerse from './features/library/AddVerse.js';
import LibraryView from './features/library/LibraryView.js';
import DriveSession from './features/drive/DriveSession.js';
import { singleVersePlaylist, buildLibraryPlaylist, buildTopicPlaylist } from './features/drive/playlist.js';
import SignIn from './features/auth/SignIn.js';
import Onboarding from './features/auth/Onboarding.js';
import { buildPassageFromText } from './data/personalLibrary.js';
import { addVerse, setMemorizing, markRecalled, listLibrary } from './lib/library.js';
import { lookupScripture, languageFor } from './lib/bible.js';
import { getSession, onAuthChange, signOut } from './lib/auth.js';
import { getProfile, saveLanguage } from './lib/profile.js';
import { markMemorized, syncProgress } from './lib/progress.js';
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
  const [memorizeTarget, setMemorizeTarget] = useState(null); // {topicId, verseId} for a curated verse
  const [topicId, setTopicId] = useState(null); // selected curated topic
  const [verseId, setVerseId] = useState(null); // selected memory verse within it
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [dueInvites, setDueInvites] = useState([]);
  const [dismissedInvites, setDismissedInvites] = useState(() => new Set());
  const [drivePlaylist, setDrivePlaylist] = useState(null); // verses for a listen-and-recite session
  const [preparingDrive, setPreparingDrive] = useState(false);
  const [driveLoop, setDriveLoop] = useState(false); // cycle the playlist until stopped
  const [pickerIntent, setPickerIntent] = useState('memorize'); // 'memorize' | 'listen'
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

  // On sign-in, merge curated progress: pull the account's verses and push any
  // collected anonymously (union, never demoted). Best-effort — local stays the
  // source of truth if it fails.
  useEffect(() => {
    if (session) syncProgress();
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

  function startSession(passages, from, idx = 0, reviewItemId = null, target = null) {
    setQueue(passages);
    setStartIndex(idx);
    setReturnTo(from);
    setReviewId(reviewItemId);
    setMemorizeTarget(target);
    setView('session');
  }

  // Listen & recite (drivemode-spec): hands-free, eyes-free practice. A single curated
  // verse uses the text VerseLanding already fetched; the library session assembles a
  // playlist (due reviews + in-progress); a topic session cycles every verse in a
  // topic until the user stops (loop). All navigate to the 'drive' view.
  function startDriveSingle(passage, from) {
    setDriveLoop(false);
    setDrivePlaylist(singleVersePlaylist(passage));
    setReturnTo(from);
    setView('drive');
  }
  async function startDriveFromLibrary(from) {
    if (preparingDrive) return;
    setPreparingDrive(true);
    try {
      const pl = await buildLibraryPlaylist();
      setDriveLoop(false);
      setDrivePlaylist(pl);
      setReturnTo(from);
      setView('drive');
    } finally {
      setPreparingDrive(false);
    }
  }
  // Cycle a whole topic, looping until stopped. Navigates immediately (playlist null →
  // a "Preparing…" screen) so the live text fetch can finish without blocking the tap.
  async function startTopicListen(id) {
    setDriveLoop(true);
    setDrivePlaylist(null);
    setReturnTo('picker');
    setView('drive');
    const pl = await buildTopicPlaylist(id, language);
    setDrivePlaylist(pl);
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
      signedIn: Boolean(session),
      // Save-across-devices nudge → sign in, then return to the picker.
      onSignIn: () => requireAuth('picker'),
      onSelect: (id) => {
        // A topic chosen for listen-and-recite cycles the whole topic; otherwise it
        // opens the topic's verse list to memorize on screen.
        if (pickerIntent === 'listen') {
          startTopicListen(id);
          return;
        }
        setTopicId(id);
        setView('topic');
      },
      onExit: () => setView('landing'),
    });
  }

  if (view === 'topic' && topicId) {
    return h(CuratedTopic, {
      topicId,
      language,
      onSelectVerse: (vid) => {
        setVerseId(vid);
        setView('verse');
      },
      onExit: () => setView('picker'),
    });
  }

  if (view === 'verse' && topicId && verseId) {
    return h(VerseLanding, {
      topicId,
      verseId,
      language,
      // Memorize the verse: its text was fetched live (ESV) on the landing. Pass
      // the curated identity so a from-memory completion marks it memorized.
      onMemorize: (verse) => startSession([buildPassageFromText(verse)], 'verse', 0, null, { topicId, verseId }),
      onDrive: (verse) => startDriveSingle(verse, 'verse'),
      onExit: () => setView('topic'),
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
      onDrive: () => startDriveFromLibrary('library'),
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
      // On a from-memory finish: a review records that it happened (time signal,
      // never a grade); a curated verse is marked memorized (local, never demoted).
      onComplete: reviewId
        ? () => markRecalled(reviewId).catch(() => {})
        : memorizeTarget
        ? () => markMemorized(memorizeTarget.topicId, memorizeTarget.verseId)
        : undefined,
      onExit: () => setView(returnTo),
    });
  }

  if (view === 'drive') {
    // Playlist still loading (topic text fetch) → a calm "Preparing…" screen.
    if (drivePlaylist === null) {
      return h(
        'section',
        { className: 'drive view-in', lang: language },
        h(
          'header',
          { className: 'drive__bar' },
          h('button', { className: 'btn btn--quiet', type: 'button', onClick: () => setView(returnTo) }, language === 'ko' ? '뒤로' : 'Back'),
          h('p', { className: 'drive__kicker' }, 'Way'),
          h('span', { className: 'drive__spacer', 'aria-hidden': 'true' })
        ),
        h('div', { className: 'drive__gate' }, h('p', { className: 'drive__lede' }, language === 'ko' ? '준비하고 있어요…' : 'Preparing…'))
      );
    }
    return h(DriveSession, {
      playlist: drivePlaylist,
      language,
      loop: driveLoop,
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
          onClick: () => {
            setPickerIntent('memorize');
            setView('picker');
          },
        },
        'Begin memorizing'
      ),
      // Hands-free, eyes-free: pick a topic and I'll cycle its verses aloud until you
      // stop (drivemode-spec). Open to everyone — no sign-in, drawn from the curriculum.
      h(
        'button',
        {
          className: 'btn btn--quiet way-add',
          type: 'button',
          onClick: () => {
            setPickerIntent('listen');
            setView('picker');
          },
        },
        'Listen & recite'
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
