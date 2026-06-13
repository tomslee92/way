import { createElement as h } from 'react';
import { tokenizeStage, tokenizeRung } from './fading.js';

// The Scripture — the hero. The fade (§5.1) / cue ladder (method-spec §3) is
// light receding, not text deleting: every word keeps its place and exact width
// (no layout shift, §8) while support thins. Keying the wrapper on the rung/stage
// re-triggers the entrance. Hidden/blank words are aria-hidden so assistive tech
// matches the visual state (Rhema's voice carries the words).
//
// Pass `rung` (method-spec cue ladder) or `stage` (legacy 4-stage fade).
export default function ScriptureDisplay({ text, stage, rung }) {
  // — cue ladder: each word renders its initial + the rest separately so the
  //   first-letter rung can show just the initial while keeping full width —
  if (rung != null) {
    const lines = tokenizeRung(text, rung);
    return h(
      'div',
      { className: 'scripture', key: `r${rung}` },
      lines.map((tokens, lineIndex) =>
        h(
          'p',
          { className: 'scripture__line', key: lineIndex },
          tokens.map((tok, tokenIndex) =>
            h(
              'span',
              {
                className: 'scripture__word',
                key: tokenIndex,
                'data-mode': tok.mode,
                'aria-hidden': tok.mode === 'shape' || tok.mode === 'gone' ? 'true' : undefined,
              },
              h('span', { className: 'w-ini' }, tok.initial),
              tok.rest ? h('span', { className: 'w-rest' }, tok.rest) : null
            )
          )
        )
      )
    );
  }

  // — legacy 4-stage fade (transparent word + ruled rule) —
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
