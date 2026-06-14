import { createElement as h, useState, useEffect } from 'react';
import { Rung, RUNGS } from './fading.js';
import { useRhema } from './useRhema.js';
import RhemaIndicator from './RhemaIndicator.js';
import ScriptureDisplay from './ScriptureDisplay.js';
import './session.css';

// The memorization session (method-spec). Self-paced silent recall against a
// six-rung cue ladder: cue → attempt (silent, never captured) → reveal → self-
// check (Not yet / Almost / Yes). The self-check drives the rung — Yes climbs,
// Almost repeats, Not yet drops — and (Phase 3) feeds scheduling, never a score.
// No ASR; voice is offered ("Hear it"), never imposed. Encoding rungs (Absorb,
// Trace) just read through; retrieval rungs (3–6) run the cue→reveal→check loop.
//
// Props unchanged from the old flow: passages, startIndex, onExit, review,
// onComplete. `review` enters straight at Free recall (a recall test).

const T = {
  en: {
    encode: 'Read it through.',
    attempt: 'Bring it to mind — then reveal.',
    selfcheck: 'Did it come to mind?',
    revealLabel: 'The verse',
    continue: 'Continue',
    hear: 'Hear it',
    reveal: 'Reveal',
    showMore: 'Show more',
    notYet: 'Not yet',
    almost: 'Almost',
    yes: 'Yes',
    end: 'End',
    done: 'Done',
  },
  ko: {
    encode: '한 번 읽어 보세요.',
    attempt: '마음에 떠올린 뒤, 확인해 보세요.',
    selfcheck: '마음에 떠올랐나요?',
    revealLabel: '본문',
    continue: '계속',
    hear: '들어보기',
    reveal: '확인',
    showMore: '한 단계 쉽게',
    notYet: '아직',
    almost: '거의',
    yes: '네',
    end: '종료',
    done: '완료',
  },
};

export default function MemorizationSession({ passages, startIndex = 0, onExit, review = false, onComplete }) {
  const lang = passages[0].language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const startRung = review ? Rung.FREE_RECALL : Rung.ABSORB;

  const [index, setIndex] = useState(startIndex);
  const [rung, setRung] = useState(startRung);
  const [phase, setPhase] = useState('cue'); // cue | reveal | complete

  const rhema = useRhema();

  // Stop the voice when the session unmounts.
  useEffect(() => () => rhema.stop(), [rhema]);

  const passage = passages[index];
  const reference = lang === 'ko' ? passage.referenceKo : passage.reference;
  const isEncoding = rung <= Rung.TRACE;
  const rungMeta = RUNGS.find((r) => r.rung === rung);

  function hearIt() {
    rhema.unlock();
    rhema.speak(passage.text.replace(/\n/g, ' '), lang);
  }

  function nextRung() {
    rhema.stop();
    setRung((r) => Math.min(Rung.FREE_RECALL, r + 1));
    setPhase('cue');
  }

  function dropRung() {
    rhema.stop();
    setRung((r) => Math.max(Rung.ABSORB, r - 1));
    setPhase('cue');
  }

  // Self-check: Yes climbs (or completes), Almost repeats this rung, Not yet drops.
  function onYes() {
    rhema.stop();
    if (rung < Rung.FREE_RECALL) {
      setRung((r) => r + 1);
      setPhase('cue');
      return;
    }
    // Free recall held — this verse is carried.
    if (index + 1 < passages.length) {
      setIndex(index + 1);
      setRung(startRung);
      setPhase('cue');
    } else {
      setPhase('complete');
      if (onComplete) onComplete();
    }
  }

  function endSession() {
    rhema.stop();
    onExit();
  }

  const prompt =
    phase === 'complete'
      ? null
      : phase === 'reveal'
      ? t.selfcheck
      : isEncoding
      ? t.encode
      : t.attempt;

  function renderControls() {
    if (phase === 'complete') {
      return h('button', { className: 'btn btn--primary', type: 'button', onClick: endSession }, t.done);
    }
    if (phase === 'reveal') {
      // Equal-weight, strictly B&W — no red/green, no scoring affect (§9).
      return h(
        'div',
        { className: 'selfcheck' },
        h('button', { className: 'btn btn--quiet', type: 'button', onClick: dropRung }, t.notYet),
        h('button', { className: 'btn btn--quiet', type: 'button', onClick: () => setPhase('cue') }, t.almost),
        h('button', { className: 'btn btn--quiet', type: 'button', onClick: onYes }, t.yes)
      );
    }
    if (isEncoding) {
      return h(
        'div',
        { className: 'session__actions' },
        h('button', { className: 'btn btn--primary', type: 'button', onClick: nextRung }, t.continue),
        rung === Rung.ABSORB
          ? h('button', { className: 'btn btn--quiet', type: 'button', onClick: hearIt }, t.hear)
          : null
      );
    }
    return h(
      'div',
      { className: 'session__actions' },
      h('button', { className: 'btn btn--primary', type: 'button', onClick: () => setPhase('reveal') }, t.reveal),
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: dropRung }, t.showMore)
    );
  }

  return h(
    'section',
    { className: 'session', lang },
    h(
      'header',
      { className: 'session__bar' },
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: endSession }, t.end),
      h('p', { className: 'session__ref' }, reference),
      h(
        'span',
        { className: 'session__count', 'aria-hidden': 'true' },
        passages.length > 1 ? `${index + 1} / ${passages.length}` : ''
      )
    ),

    // rung indicator — replaces the I–IV stage rail (same restrained treatment)
    h(
      'div',
      { className: 'stages', role: 'progressbar', 'aria-valuenow': rung, 'aria-valuemax': 6 },
      RUNGS.map((r) =>
        h('span', {
          key: r.rung,
          className: 'stages__mark',
          'data-active': r.rung === rung ? 'true' : undefined,
          'data-done': r.rung < rung ? 'true' : undefined,
        })
      )
    ),
    phase === 'complete'
      ? null
      : h(
          'p',
          { className: 'stages__label' },
          // During the reveal the full verse is up — name it "the verse", not
          // the rung being tested, so the indicator never contradicts the text.
          phase === 'reveal' ? t.revealLabel : rungMeta.label[lang]
        ),

    h(
      'div',
      { className: 'session__stage' },
      phase === 'complete'
        ? h(
            'div',
            { className: 'session__complete' },
            h('p', { className: 'session__complete-ref' }, reference),
            h('p', { className: 'session__complete-text' }, passage.text.replace(/\n/g, ' '))
          )
        : h(ScriptureDisplay, {
            // Key on the element forces a clean remount when the rung or verse
            // changes (instant new cue, in step with the indicator); the reveal
            // keeps the same key so it dissolves cue→full in place.
            key: `v${index}-r${rung}`,
            text: passage.text,
            rung,
            revealed: phase === 'reveal',
          })
    ),

    h(
      'footer',
      { className: 'session__foot' },
      phase === 'complete'
        ? null
        : rhema.speaking
        ? h(RhemaIndicator, { state: 'speaking', label: '' })
        : null,
      prompt ? h('p', { className: 'session__note' }, prompt) : null,
      h('div', { className: 'session__controls' }, renderControls())
    )
  );
}
