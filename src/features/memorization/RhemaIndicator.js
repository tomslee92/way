import { createElement as h } from 'react';

// Rhema's presence, rendered in pure monochrome. The animation conveys state:
//   speaking    — a slow breathing pulse (Rhema is talking)
//   listening   — outward sonar rings (Rhema is hearing you)
//   processing  — a quiet rotating arc (Rhema is reflecting on your response)
//   idle        — a still, faint point
//
// `state` drives the CSS via the data attribute; all motion lives in session.css.
export default function RhemaIndicator({ state = 'idle', label }) {
  return h(
    'div',
    { className: 'rhema', 'data-state': state },
    h(
      'div',
      { className: 'rhema__orb', role: 'img', 'aria-label': `Rhema: ${state}` },
      h('span', { className: 'rhema__ring' }),
      h('span', { className: 'rhema__ring rhema__ring--2' }),
      h('span', { className: 'rhema__core' })
    ),
    label ? h('p', { className: 'rhema__label' }, label) : null
  );
}
