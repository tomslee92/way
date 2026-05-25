import { createElement as h } from 'react';
import { tokenizeStage } from './fading.js';

// The Scripture — the most important thing on the screen. Hidden words become
// elegant underlines sized to the word they replace, never literal characters.
// Keying the wrapper on `stage` re-triggers the entrance animation each time
// the text fades to the next stage.
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
          token.hidden
            ? h('span', {
                className: 'scripture__blank',
                key: tokenIndex,
                'aria-hidden': 'true',
                style: { width: `${Math.max(2, token.text.length)}ch` },
              })
            : h(
                'span',
                { className: 'scripture__word', key: tokenIndex },
                token.text
              )
        )
      )
    )
  );
}
