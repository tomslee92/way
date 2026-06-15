import { createElement as h, useState } from 'react';
import { lookupScripture } from '../../lib/bible.js';
import { useRhema } from '../memorization/useRhema.js';
import RhemaIndicator from '../memorization/RhemaIndicator.js';
import '../memorization/session.css'; // the §6 orb styles live here
import './picker.css';

// The revelation walk (DESIGN §5.2) — the orbit as a true canonical sequence
// (origin → unfolding → moment → aftermath → consummation), rendered as a
// literal vertical thread. Collapsed by default ("optional"); a door, never a
// hallway (library-spec §1). Tapping a station lets Rhema READ that verse aloud
// (live TTS) — never a memorize action. Footed by Luke 24:27, the Emmaus shape.
//
// English verse text is fetched live (ESV) on expand; Korean uses stored text.

const T = {
  en: {
    optional: 'Optional',
    walk: 'Walk the thread',
    hide: 'Hide the thread',
    loading: 'Opening the thread…',
    foot: 'Luke 24:27',
    pos: { origin: 'Origin', unfolding: 'Unfolding', moment: 'Moment', aftermath: 'Aftermath', consummation: 'Consummation' },
  },
  ko: {
    optional: '선택',
    walk: '묵상의 길 걷기',
    hide: '접기',
    loading: '길을 여는 중…',
    foot: '누가복음 24:27',
    pos: { origin: '기원', unfolding: '전개', moment: '그 순간', aftermath: '그 후', consummation: '완성' },
  },
};

export default function RevelationWalk({ orbit, language = 'en' }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const rhema = useRhema();

  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState({}); // stationId -> verse text
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);

  async function expand() {
    setOpen(true);
    // Seed stored texts (Korean), fetch the rest live (English ESV).
    const seeded = {};
    orbit.forEach((o) => {
      if (o.text) seeded[o.id] = o.text;
    });
    if (Object.keys(seeded).length) setTexts((m) => ({ ...m, ...seeded }));

    const need = orbit.filter((o) => !o.text && texts[o.id] === undefined);
    if (!need.length) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        need.map((o) =>
          lookupScripture(lang, o.ref)
            .then((v) => [o.id, v.text])
            .catch(() => [o.id, null])
        )
      );
      setTexts((m) => {
        const next = { ...m };
        results.forEach(([id, txt]) => {
          next[id] = txt;
        });
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    if (open) {
      setOpen(false);
      rhema.stop();
      setActiveId(null);
    } else {
      expand();
    }
  }

  function read(station) {
    const text = station.text || texts[station.id];
    if (!text) return;
    setActiveId(station.id);
    rhema.unlock();
    rhema.speak(text, lang).then(() => setActiveId((cur) => (cur === station.id ? null : cur)));
  }

  function station(s) {
    return h(
      'button',
      {
        key: s.id,
        className: 'station',
        type: 'button',
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
          rhema.speaking
            ? h('div', { className: 'thread__orb' }, h(RhemaIndicator, { state: 'speaking', label: '' }))
            : null,
          loading ? h('p', { className: 'walk__note' }, t.loading) : null,
          h('div', { className: 'thread__list' }, orbit.map(station)),
          h('p', { className: 'thread__foot' }, t.foot)
        )
      : null
  );
}
