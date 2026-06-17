// Light / dark theme. The whole palette is tokenized (tokens.css), so a theme is
// just `data-theme` on <html> — "dark" flips the inverted token block on.
//
// Default: FOLLOW THE DEVICE (prefers-color-scheme). A manual toggle stores an
// explicit choice in localStorage that overrides the system from then on. While
// no explicit choice is set, the app tracks the OS live. Applied before paint by
// a tiny inline script in index.html to avoid a flash of the wrong theme.

const KEY = 'way:theme';

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
}

export function hasExplicitChoice() {
  return readStored() != null;
}

export function systemPrefersDark() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch {
    return false;
  }
}

// The theme in effect now: an explicit choice wins; otherwise follow the device.
export function getEffectiveTheme() {
  return readStored() || (systemPrefersDark() ? 'dark' : 'light');
}

function setAttr(t) {
  try {
    document.documentElement.dataset.theme = t;
  } catch {
    /* no document — noop */
  }
}

// Set + persist an explicit choice (a manual toggle). Returns the normalized value.
export function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  setAttr(t);
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage blocked — still applied for the session */
  }
  return t;
}

export function toggleTheme() {
  return applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
}

// Track the OS theme while no explicit choice is set (updates the document, and
// calls onChange so UI can reflect it). Returns an unsubscribe fn.
export function watchSystemTheme(onChange) {
  let mq;
  try {
    mq = window.matchMedia('(prefers-color-scheme: dark)');
  } catch {
    return () => {};
  }
  const handler = () => {
    if (hasExplicitChoice()) return; // a manual choice overrides the system
    const t = mq.matches ? 'dark' : 'light';
    setAttr(t);
    if (onChange) onChange(t);
  };
  if (mq.addEventListener) {
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }
  // Safari < 14
  try {
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  } catch {
    return () => {};
  }
}
