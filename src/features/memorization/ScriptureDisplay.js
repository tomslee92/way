import { createElement as h } from 'react';
import { tokenizeStage } from './fading.js';

// The Scripture — the hero. The fade (§5.1) is light receding, not text
// deleting: every word keeps its place and exact width; a hidden word simply
// goes transparent over a faint ruled line. Because the text is always present,
// the verse never shifts shape or wrapping between stages (§8). Keying the
// wrapper on `stage` re-triggers the entrance. Hidden words are aria-hidden so
// assistive tech matches the visual state (Rhema's voice carries the words).
export default function ScriptureDisplay({ text, stage }) {
  const lines = tokenizeStage(text, stage);

  return h(
    'div',
    { className: 'scripture', key: stage },
    lines.map((tokens, lineIndex) =>
      h(
        'p',
        { className: 'scripture__line', key: lineIndex },
        tokens.map((token, tokenIndex) =>
          h(
            'span',
            {
              className: 'scripture__word',
              key: tokenIndex,
              'data-hidden': token.hidden ? 'true' : undefined,
              'aria-hidden': token.hidden ? 'true' : undefined,
            },
            token.text
          )
        )
      )
    )
  );
}
