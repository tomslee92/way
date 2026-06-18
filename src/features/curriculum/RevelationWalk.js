import { createElement as h, useEffect, useRef, useState } from 'react';
import { lookupScripture } from '../../lib/bible.js';
import { useRhema } from '../memorization/useRhema.js';
import RhemaIndicator from '../memorization/RhemaIndicator.js';
import '../memorization/session.css'; // the §6 orb styles live here
import './picker.css';

// The revelation walk (DESIGN §5.2) — the orbit as a true canonical sequence
// (origin → unfolding → moment → aftermath → consummation), rendered as a
// literal vertical thread. Collapsed by default ("optional"); a door, never a
// hallway (library-spec §1).
//
// The memory verse heads the thread as its own playable station ("the verse").
// Tapping any station lets Rhema read it aloud (live TTS) and then speak the
// connecting remark that ties it to the memory verse — never a memorize action.
// "Play the whole thread" walks every station in one unbroken flow. Footed by
// Luke 24:27, the Emmaus shape.
//
// English verse text is fetched live (ESV) on expand; Korean uses stored text.

const T = {
  en: {
    optional: 'Optional',
    walk: 'See how it connects',
    hide: 'Hide',
    loading: 'Opening the thread…',
    playAll: 'Play the whole thread',
    stop: 'Stop',
    foot: 'Luke 24:27',
    pos: { verse: 'The verse', origin: 'Origin', unfolding: 'Unfolding', moment: 'Moment', aftermath: 'Echo', consummation: 'Consummation' },
  },
  ko: {
    optional: '선택',
    walk: '어떻게 이어지는지 보기',
    hide: '접기',
    loading: '길을 여는 중…',
    playAll: '전체 듣기',
    stop: '멈춤',
    foot: '누가복음 24:27',
    pos: { verse: '본문', origin: '시작', unfolding: '전개', moment: '그 순간', aftermath: '울림', consummation: '완성' },
  },
};

// The footer verse — Luke 24:27, the Emmaus shape behind every thread. Tappable:
// Rhema reads it aloud. English is fetched live (ESV, never stored); Korean is the
// stored 개역개정 (no Korean API).
const FOOT = {
  en: { ref: 'Luke 24:27', text: null },
  ko: {
    ref: '누가복음 24:27',
    text: '이에 모세와 모든 선지자의 글로 시작하여 모든 성경에 쓴 바 자기에 관한 것을 자세히 설명하시니라',
  },
};

export default function RevelationWalk({ orbit, language = 'en', memoryVerse = null }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const rhema = useRhema();

  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState({}); // stationId -> verse text
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [playingAll, setPlayingAll] = useState(false);
  const runRef = useRef(0); // bump to cancel an in-flight play-all
  const stationEls = useRef({}); // stationId -> DOM node, for auto-scroll
  const [footOpen, setFootOpen] = useState(false); // Luke 24:27 verse revealed
  const [footText, setFootText] = useState(null); // EN fetch cache (KO uses stored)

  // Keep the station being read aloud centered in view — the page tracks along
  // with Rhema (single taps and the full walk both set activeId). Honor reduced
  // motion with an instant jump instead of a smooth scroll.
  useEffect(() => {
    if (!activeId) return;
    const el = stationEls.current[activeId];
    if (!el || !el.scrollIntoView) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }, [activeId]);

  // The memory verse leads the thread as its own station, then the orbit.
  const lead = memoryVerse
    ? [{ id: '__memory', ref: memoryVerse.ref, text: memoryVerse.text || undefined, position: 'verse', isLead: true }]
    : [];
  const stations = [...lead, ...orbit];

  // Fetch any station texts we don't already have; returns the merged map so a
  // caller (play-all) can use fresh text without waiting on a state flush.
  async function loadTexts() {
    const need = stations.filter((o) => !o.text && texts[o.id] === undefined);
    if (!need.length) return texts;
    setLoading(true);
    try {
      const results = await Promise.all(
        need.map((o) =>
          lookupScripture(lang, o.ref)
            .then((v) => [o.id, v.text])
            .catch(() => [o.id, null])
        )
      );
      const merged = { ...texts };
      results.forEach(([id, txt]) => {
        merged[id] = txt;
      });
      setTexts(merged);
      return merged;
    } finally {
      setLoading(false);
    }
  }

  function expand() {
    setOpen(true);
    loadTexts();
  }

  function cancelPlayback() {
    runRef.current += 1;
    rhema.stop();
    setPlayingAll(false);
  }

  function toggle() {
    if (open) {
      setOpen(false);
      cancelPlayback();
      setActiveId(null);
    } else {
      expand();
    }
  }

  // Tap a single station: stop any running flow, then read it (verse → remark).
  function read(station) {
    cancelPlayback();
    const text = station.text || texts[station.id];
    if (!text) return;
    setActiveId(station.id);
    rhema.unlock();
    rhema
      .speak(text, lang)
      .then(() => (station.connection ? rhema.speak(station.connection, lang) : null))
      .then(() => setActiveId((cur) => (cur === station.id ? null : cur)));
  }

  // The Emmaus footer (Luke 24:27) — tap to REVEAL the verse and hear it read;
  // tap again to hide. EN fetched live (ESV, never stored); KO uses stored 개역개정.
  function readFoot() {
    if (footOpen) {
      setFootOpen(false);
      cancelPlayback();
      setActiveId((cur) => (cur === '__foot' ? null : cur));
      return;
    }
    cancelPlayback();
    setActiveId('__foot');
    setFootOpen(true);
    rhema.unlock();
    const done = () => setActiveId((cur) => (cur === '__foot' ? null : cur));
    const play = (txt) => {
      if (!FOOT[lang].text) setFootText(txt); // cache only the fetched (EN); KO uses stored
      return txt ? rhema.speak(txt, lang).then(done) : done();
    };
    const resolved = FOOT[lang].text || footText;
    if (resolved) play(resolved);
    else
      lookupScripture(lang, FOOT[lang].ref)
        .then((v) => play(v.text))
        .catch(() => {
          setFootOpen(false);
          done();
        });
  }

  // Walk every station in one flow: verse, then its remark, station by station.
  async function playAll() {
    const myRun = (runRef.current += 1);
    setPlayingAll(true);
    rhema.unlock();
    const map = await loadTexts();
    if (runRef.current !== myRun) return;
    for (const s of stations) {
      if (runRef.current !== myRun) break;
      setActiveId(s.id);
      const text = s.text || map[s.id];
      if (text) {
        await rhema.speak(text, lang);
        if (runRef.current !== myRun) break;
      }
      if (s.connection) {
        await rhema.speak(s.connection, lang);
        if (runRef.current !== myRun) break;
      }
    }
    if (runRef.current === myRun) {
      setActiveId(null);
      setPlayingAll(false);
    }
  }

  function stopAll() {
    cancelPlayback();
    setActiveId(null);
  }

  function station(s) {
    return h(
      'button',
      {
        key: s.id,
        className: 'station',
        type: 'button',
        ref: (el) => {
          if (el) stationEls.current[s.id] = el;
          else delete stationEls.current[s.id];
        },
        'data-lead': s.isLead ? 'true' : undefined,
        'data-active': activeId === s.id ? 'true' : undefined,
        onClick: () => read(s),
      },
      h('span', { className: 'station__dot', 'aria-hidden': 'true' }),
      h(
        'span',
        { className: 'station__body' },
        h('span', { className: 'station__eyebrow' }, (t.pos[s.position] || s.position).toUpperCase()),
        h('span', { className: 'station__ref' }, s.ref),
        h('span', { className: 'station__verse' }, s.text || texts[s.id] || '…'),
        s.connection ? h('span', { className: 'station__connection' }, s.connection) : null
      )
    );
  }

  return h(
    'div',
    { className: 'walk' },
    h('div', { className: 'walk__divider', 'aria-hidden': 'true' }),
    h(
      'button',
      {
        className: 'btn btn--quiet walk__toggle',
        type: 'button',
        'aria-expanded': open ? 'true' : 'false',
        onClick: toggle,
      },
      h('span', { className: 'walk__eyebrow' }, t.optional.toUpperCase()),
      h('span', { className: 'walk__label' }, open ? t.hide : t.walk)
    ),
    open
      ? h(
          'div',
          { className: 'thread view-in' },
          h(
            'button',
            {
              className: 'btn btn--quiet walk__play',
              type: 'button',
              onClick: playingAll ? stopAll : playAll,
            },
            h('span', { className: 'walk__play-dot', 'data-playing': playingAll ? 'true' : undefined, 'aria-hidden': 'true' }),
            h('span', null, playingAll ? t.stop : t.playAll)
          ),
          rhema.speaking
            ? h('div', { className: 'thread__orb' }, h(RhemaIndicator, { state: 'speaking', label: '' }))
            : null,
          loading ? h('p', { className: 'walk__note' }, t.loading) : null,
          h('div', { className: 'thread__list' }, stations.map(station)),
          h(
            'div',
            { className: 'thread__foot' },
            h(
              'button',
              {
                className: 'thread__foot-btn',
                type: 'button',
                'data-active': activeId === '__foot' ? 'true' : undefined,
                'aria-expanded': footOpen ? 'true' : 'false',
                onClick: readFoot,
              },
              t.foot
            ),
            footOpen
              ? h('p', { className: 'thread__foot-text' }, FOOT[lang].text || footText || '…')
              : null
          )
        )
      : null
  );
}
