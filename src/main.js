import { createElement as h, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
// Tokens first, then the type scale, then base/screen styles consume them.
import './styles/tokens.css';
import './styles/type.css';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(h(StrictMode, null, h(App)));
