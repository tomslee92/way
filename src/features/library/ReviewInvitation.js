import { createElement as h } from 'react';
import { useRhema } from '../memorization/useRhema.js';
import RhemaIndicator from '../memorization/RhemaIndicator.js';
import '../memorization/session.css'; // the §6 orb styles live here
import { sinceLabel } from './review.js';
import './library.css';

// A §3 review invitation — Rhema surfaces truth by invitation, never judgment.
// Warm, optional, non-gating: declining costs nothing and changes nothing. The
// line is dynamic ("it's been two weeks"), so hearing it is LIVE TTS (tap to
// hear — never autoplay, which browsers block and which would be less quiet).
const T = {
  en: {
    eyebrow: 'Revisit',
    line: (ref, since) => `Shall we revisit ${ref}? It's been ${since}.`,
    revisit: 'Revisit',
    notnow: 'Not now',
    hear: 'Hear it',
  },
  ko: {
    eyebrow: '다시 보기',
    line: (ref, since) => `${ref}, 다시 만나볼까요? 벌써 ${since} 됐어요.`,
    revisit: '다시 보기',
    notnow: '나중에',
    hear: '들어보기',
  },
};

export default function ReviewInvitation({ item, language = 'en', onRevisit, onDismiss }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const rhema = useRhema();

  const refMs = new Date(item.last_recalled_at || item.declared_memorized_at).getTime();
  const line = t.line(item.ref_display, sinceLabel(refMs, Date.now(), lang));

  // Tap unlocks audio (browser gesture requirement) and speaks the line live.
  const hear = () => {
    rhema.unlock();
    rhema.speak(line, lang);
  };

  return h(
    'div',
    { className: 'review' },
    h(
      'div',
      { className: 'review__head' },
      h('p', { className: 'review__eyebrow' }, t.eyebrow.toUpperCase()),
      h(
        'button',
        { className: 'review__hear', type: 'button', onClick: hear, 'aria-label': t.hear },
        h(RhemaIndicator, { state: rhema.speaking ? 'speaking' : 'idle', label: '' })
      )
    ),
    h('p', { className: 'review__line' }, line),
    h(
      'div',
      { className: 'review__actions' },
      h(
        'button',
        { className: 'btn btn--quiet', type: 'button', onClick: () => onRevisit(item) },
        t.revisit
      ),
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: onDismiss }, t.notnow)
    )
  );
}
