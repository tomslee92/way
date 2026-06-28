import { createElement as h, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { watchSystemTheme } from './lib/theme.js';
// Tokens first, then the type scale, then base/screen styles consume them.
import './styles/tokens.css';
import './styles/type.css';
import './styles/index.css';

// Follow the device's light/dark setting app-wide until the user picks a theme.
// (The initial theme is applied pre-paint by the inline script in index.html.)
watchSystemTheme();

const root = createRoot(document.getElementById('root'));
root.render(h(StrictMode, null, h(App)));
