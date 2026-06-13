import { createElement as h, useEffect, useRef, useState } from 'react';
import { FadingStage, STAGES } from './fading.js';
import { assessRecall } from './coaching.js';
import { rhemaScript, statusLabels, pick } from './rhemaScript.js';
import { useRhema } from './useRhema.js';
import { useSpeechRecognition } from './useSpeechRecognition.js';
import RhemaIndicator from './RhemaIndicator.js';
import ScriptureDisplay from './ScriptureDisplay.js';
import './session.css';

// Hands-free, adaptive, continuous flow:
//   per stage: speak → listen → (mastered ? advance : re-read + loop)
//   per verse: stages 1→4, then flow straight into the next verse in the queue.
// Progress is coaching, not grading — a stage loops with help until recall is
// solid, with a cap so the user is never trapped, and a Skip if they choose.
const PHASE = {
  intro: 'intro',
  speaking: 'speaking',
  ready: 'ready', // manual fallback when speech is unsupported
  listening: 'listening',
  processing: 'processing',
  feedback: 'feedback',
  complete: 'complete',
};

const MAX_STAGE_ATTEMPTS = 4;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function MemorizationSession({ passages, startIndex = 0, onExit }) {
  const [index, setIndex] = useState(startIndex);
  const [stage, setStage] = useState(FadingStage.FULL);
  const [phase, setPhase] = useState(PHASE.intro);

  const passage = passages[index];
  // A queue is built in one language, so these are constant across it.
  const lang = passages[0].language === 'ko' ? 'ko' : 'en';
  const script = rhemaScript[lang];
  const labels = statusLabels[lang];
  const recLang = lang === 'ko' ? 'ko-KR' : 'en-US';
  const reference = lang === 'ko' ? passage.referenceKo : passage.reference;

  const rhema = useRhema();
  const speech = useSpeechRecognition();
  const startedRef = useRef(false);
  const skipRef = useRef(false);
  const aliveRef = useRef(true); // false once the session ends/unmounts

  // Stop audio + halt the in-flight async flow when the session unmounts.
  useEffect(() => {
    return () => {
      aliveRef.current = false;
      rhema.stop();
      speech.stop();
    };
    // stop fns are stable (useCallback); run cleanup only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Truly end: stop the voice, halt the loop, leave.
  const endSession = () => {
    aliveRef.current = false;
    rhema.stop();
    speech.stop();
    onExit();
  };

  const read = (p) => rhema.speak(p.text.replace(/\n/g, ' '), lang);

  // Move past the current stage: next stage, next verse, or finish.
  const afterStage = async (p, i, n) => {
    if (!aliveRef.current) return;
    if (n < FadingStage.BLANK) {
      await runStage(p, i, n + 1, false);
      return;
    }
    if (i + 1 < passages.length) {
      await rhema.speak(pick(script.continue), lang); // bridge to next verse
      if (!aliveRef.current) return;
      await runVerse(i + 1, false);
    } else {
      await rhema.speak(script.complete, lang);
      if (!aliveRef.current) return;
      setPhase(PHASE.complete);
    }
  };

  // Listen, then either advance (held it) or loop this stage with a re-read.
  const reciteStage = async (p, i, n, attempt) => {
    if (!aliveRef.current) return;
    skipRef.current = false;
    setPhase(PHASE.listening);
    const transcript = await speech.listen(recLang, { silenceMs: 2500 });
    if (!aliveRef.current) return;

    setPhase(PHASE.processing);
    await delay(600); // a brief, deliberate beat — Rhema reflecting
    if (!aliveRef.current) return;
    const { mastered } = assessRecall(transcript, p.text);

    setPhase(PHASE.feedback);
    if (mastered || skipRef.current) {
      await rhema.speak(
        pick(skipRef.current ? script.coach.moveOn : script.coach.mastered),
        lang
      );
      if (!aliveRef.current) return;
      await afterStage(p, i, n);
      return;
    }
    if (attempt >= MAX_STAGE_ATTEMPTS) {
      await rhema.speak(pick(script.coach.moveOn), lang);
      if (!aliveRef.current) return;
      await afterStage(p, i, n);
      return;
    }
    // Not yet — encourage, read it again to help, then retry the SAME stage.
    await rhema.speak(pick(script.coach.again), lang);
    if (!aliveRef.current) return;
    await read(p);
    if (!aliveRef.current) return;
    await reciteStage(p, i, n, attempt + 1);
  };

  const runStage = async (p, i, n, withIntro) => {
    if (!aliveRef.current) return;
    setStage(n);
    setPhase(PHASE.speaking);
    if (withIntro) {
      await rhema.speak(script.intro, lang);
      if (!aliveRef.current) return;
    }
    await rhema.speak(script.stagePrompt[n], lang);
    if (!aliveRef.current) return;
    if (n === FadingStage.FULL) {
      await read(p);
      if (!aliveRef.current) return;
    }
    if (!speech.supported) {
      setPhase(PHASE.ready); // manual fallback
      return;
    }
    await reciteStage(p, i, n, 1);
  };

  const runVerse = async (i, withIntro) => {
    if (!aliveRef.current) return;
    setIndex(i);
    await runStage(passages[i], i, FadingStage.FULL, withIntro);
  };

  // First gesture: unlock audio + prime the mic, then run hands-free.
  const begin = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    rhema.unlock();
    if (speech.supported) speech.requestPermission();
    runVerse(startIndex, true);
  };

  // Manual progression when speech recognition is unavailable.
  const advanceManually = () => afterStage(passage, index, stage);

  // Skip the current stage (advance without it being held).
  const skipStage = () => {
    skipRef.current = true;
    speech.stop();
  };

  const indicatorState =
    phase === PHASE.speaking
      ? 'speaking'
      : phase === PHASE.listening
        ? 'listening'
        : phase === PHASE.processing
          ? 'processing'
          : 'idle';

  const statusLabel =
    phase === PHASE.speaking
      ? labels.speaking
      : phase === PHASE.ready
        ? labels.ready
        : phase === PHASE.listening
          ? labels.listening
          : phase === PHASE.processing
            ? labels.processing
            : '';

  const stageMeta = STAGES.find((s) => s.stage === stage);

  return h(
    'section',
    { className: 'session', lang },
    h(
      'header',
      { className: 'session__bar' },
      h(
        'button',
        { className: 'btn btn--quiet', type: 'button', onClick: endSession },
        lang === 'ko' ? '종료' : 'End'
      ),
      h('p', { className: 'session__ref' }, reference),
      h(
        'span',
        { className: 'session__count', 'aria-hidden': 'true' },
        passages.length > 1 ? `${index + 1} / ${passages.length}` : ''
      )
    ),

    h(
      'div',
      { className: 'stages', role: 'progressbar', 'aria-valuenow': stage, 'aria-valuemax': 4 },
      STAGES.map((s) =>
        h('span', {
          key: s.stage,
          className: 'stages__mark',
          'data-active': s.stage === stage ? 'true' : undefined,
          'data-done': s.stage < stage ? 'true' : undefined,
        })
      )
    ),
    stageMeta ? h('p', { className: 'stages__label' }, stageMeta.label[lang]) : null,

    h(
      'div',
      {
        className: 'session__stage',
        'data-dim': phase === PHASE.processing ? 'true' : undefined,
      },
      phase === PHASE.complete
        ? h(
            'div',
            { className: 'session__complete' },
            h('p', { className: 'session__complete-ref' }, reference),
            h('p', { className: 'session__complete-text' }, passage.text.replace(/\n/g, ' '))
          )
        : h(ScriptureDisplay, { text: passage.text, stage, key: `${index}-${stage}` })
    ),

    h(
      'footer',
      { className: 'session__foot' },
      phase === PHASE.complete
        ? null
        : h(RhemaIndicator, { state: indicatorState, label: statusLabel }),

      speech.listening && speech.interim
        ? h('p', { className: 'session__heard' }, speech.interim)
        : null,

      h('div', { className: 'session__controls' }, renderControls())
    )
  );

  function renderControls() {
    switch (phase) {
      case PHASE.intro:
        return h(
          'button',
          { className: 'btn btn--primary', type: 'button', onClick: begin },
          lang === 'ko' ? '시작하기' : 'Begin'
        );

      case PHASE.listening:
        return h(
          'div',
          { className: 'session__actions' },
          h(
            'button',
            { className: 'btn btn--quiet', type: 'button', onClick: speech.stop },
            lang === 'ko' ? '암송 완료' : 'Done reciting'
          ),
          h(
            'button',
            { className: 'btn btn--quiet', type: 'button', onClick: skipStage },
            lang === 'ko' ? '건너뛰기' : 'Skip'
          )
        );

      case PHASE.ready: // speech unsupported
        return [
          h(
            'p',
            { className: 'session__note', key: 'note' },
            lang === 'ko'
              ? '이 브라우저는 음성 입력을 지원하지 않아요.'
              : "This browser doesn't support voice input."
          ),
          h(
            'button',
            {
              className: 'btn btn--primary',
              type: 'button',
              key: 'advance',
              onClick: advanceManually,
            },
            lang === 'ko' ? '다음 단계' : 'Continue'
          ),
        ];

      case PHASE.complete:
        return h(
          'button',
          { className: 'btn btn--primary', type: 'button', onClick: endSession },
          lang === 'ko' ? '다른 구절 선택' : 'Choose another'
        );

      default:
        return null;
    }
  }
}
