import { createElement as h, useState } from 'react';
import { getStoredTheme, toggleTheme } from '../../lib/theme.js';

// A single quiet control to invert the app (light ⇄ dark). The glyph is a
// half-filled circle — the universal contrast mark — and it inverts with the
// palette, so it always reads against the current background. Strict B&W, no emoji.
export default function ThemeToggle({ language = 'en' }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const dark = theme === 'dark';
  const label =
    language === 'ko'
      ? dark ? '밝은 모드로 전환' : '어두운 모드로 전환'
      : dark ? 'Switch to light' : 'Switch to dark';

  return h(
    'button',
    {
      type: 'button',
      className: 'themetoggle',
      'aria-label': label,
      'aria-pressed': dark ? 'true' : 'false',
      title: label,
      onClick: () => setTheme(toggleTheme()),
    },
    h('span', { className: 'themetoggle__glyph', 'data-dark': dark ? 'true' : undefined, 'aria-hidden': 'true' })
  );
}
