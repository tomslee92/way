// Light / dark theme. The whole palette is tokenized (tokens.css), so a theme is
// just `data-theme` on <html> — "dark" flips the inverted token block on.
// Persisted in localStorage (like the language choice); applied before paint by a
// tiny inline script in index.html to avoid a flash of the wrong theme.

const KEY = 'way:theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

// Apply a theme to the document and persist it. Returns the normalized value.
export function applyTheme(theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  try {
    document.documentElement.dataset.theme = t;
  } catch {
    /* SSR / no document — noop */
  }
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage blocked — still applied for the session */
  }
  return t;
}

export function toggleTheme() {
  return applyTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
}
