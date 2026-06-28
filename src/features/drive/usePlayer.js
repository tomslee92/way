import { useCallback, useRef, useState } from 'react';
import { compileVerse, gapFor, DriveRung, TUNING } from './driveLadder.js';
import { coachLine, frameLine, verseIntro } from './driveScript.js';

// The Drive Mode player: an interruptible step runner. It walks each verse's audio
// ladder (driveLadder), speaking through Rhema and leaving sized silences — timed in
// Tier 1, voice-activity-gated in Tier 2 — and exposes calm controls (play/pause,
// repeat, skip, back, slower/faster, exit) that a moving user can hit blind.
//
// Control flow lives in refs (so it survives re-renders and can be interrupted mid
// step); the small slice the surface needs is mirrored into state. A step runs under
// an AbortController: pause/skip/repeat abort the in-flight step and the loop re-reads
// its position. Pausing mid-step simply re-runs that step on resume — re-reading the
// phrase, which is exactly what you want when memorizing.

const RATE_MIN = 0.6;
const RATE_MAX = 1.6;
const RATE_STEP = 0.15;

export function usePlayer({ playlist, rhema, vad, useVad = false, loop = false, onRecall, onComplete }) {
  const [status, setStatus] = useState('idle'); // idle | playing | paused | done
  const [verseIndex, setVerseIndex] = useState(0);
  const [reference, setReference] = useState('');
  const [rungLabel, setRungLabel] = useState(null);
  const [phase, setPhase] = useState('speaking'); // speaking | waiting
  const [listening, setListening] = useState(false);
  const [rate, setRate] = useState(1);

  // The runner loop starts once and closes over first-render values; route everything
  // mutable through refs so the loop always sees the live instance / flag / callback.
  const rhemaRef = useRef(rhema);
  rhemaRef.current = rhema;
  const vadRef = useRef(vad);
  vadRef.current = vad;
  const useVadRef = useRef(useVad);
  useVadRef.current = useVad;
  const loopRef = useRef(loop);
  loopRef.current = loop;
  const onRecallRef = useRef(onRecall);
  onRecallRef.current = onRecall;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const posRef = useRef({ v: 0, r: 0, s: 0 });
  const compiledRef = useRef(new Map());
  const rateRef = useRef(1);
  const pausedRef = useRef(false);
  const cancelledRef = useRef(false);
  const repositionedRef = useRef(false);
  const abortRef = useRef(null);
  const resumeWaitersRef = useRef([]);
  const introdRef = useRef(-1); // last verse index we spoke an intro for
  const startedRef = useRef(false);

  const getCompiled = useCallback(
    (v) => {
      if (!compiledRef.current.has(v)) {
        const entry = playlist[v];
        compiledRef.current.set(
          v,
          compileVerse(entry.passage, { startLevel: entry.startLevel, capLevel: entry.capLevel })
        );
      }
      return compiledRef.current.get(v);
    },
    [playlist]
  );

  // — pause gate —
  const waitWhilePaused = useCallback(
    () =>
      pausedRef.current
        ? new Promise((resolve) => resumeWaitersRef.current.push(resolve))
        : Promise.resolve(),
    []
  );
  const releaseWaiters = useCallback(() => {
    const waiters = resumeWaitersRef.current;
    resumeWaitersRef.current = [];
    waiters.forEach((fn) => fn());
  }, []);

  // — abortable primitives —
  function runSay(text, lang, signal) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve();
      };
      const onAbort = () => {
        rhemaRef.current.stop();
        finish();
      };
      if (signal) {
        if (signal.aborted) {
          rhemaRef.current.stop();
          return finish();
        }
        signal.addEventListener('abort', onAbort, { once: true });
      }
      // rhema.speak resolves on audio end (or its own watchdog); abort wins the race.
      rhemaRef.current.speak(text, lang).then(finish).catch(finish);
    });
  }

  function abortableDelay(ms, signal) {
    return new Promise((resolve) => {
      if (signal && signal.aborted) return resolve();
      const id = setTimeout(() => {
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(id);
        resolve();
      };
      if (signal) signal.addEventListener('abort', onAbort, { once: true });
    });
  }

  // — run a single step. Returns nothing; advancement is decided by the loop. —
  async function runStep(step, lang, signal) {
    if (step.type === 'coach') {
      setPhase('speaking');
      await runSay(coachLine(step.key, lang), lang, signal);
      return;
    }
    if (step.type === 'say') {
      setPhase('speaking');
      await runSay(step.text, lang, signal);
      return;
    }
    // gap — the user's turn.
    setPhase('waiting');
    const ms = step.fixedMs != null ? step.fixedMs : gapFor(step.text, lang, rateRef.current);
    if (useVadRef.current && step.expect !== 'breath' && vadRef.current.ready()) {
      setListening(true);
      await vadRef.current.waitForSpeechEnd({
        maxMs: ms,
        leadMs: TUNING.leadMs,
        minSpeechMs: TUNING.minSpeechMs,
        trailingSilenceMs: TUNING.trailingSilenceMs,
        signal,
      });
      setListening(false);
    } else {
      await abortableDelay(ms, signal);
    }
  }

  // — the loop —
  async function loop() {
    // Spoken session frame (drivemode-spec §6).
    await runSay(frameLine('start', playlist[0]?.passage.language), playlist[0]?.passage.language);

    while (!cancelledRef.current) {
      const pos = posRef.current;
      if (pos.v >= playlist.length) {
        // Cycle the whole queue again until the user stops (topic listen-and-recite).
        if (loopRef.current && playlist.length) {
          pos.v = 0;
          pos.r = 0;
          pos.s = 0;
          introdRef.current = -1;
          continue;
        }
        await runSay(frameLine('complete', lastLang()), lastLang());
        setStatus('done');
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }

      const compiled = getCompiled(pos.v);
      const lang = compiled.language;

      // Entering a verse: surface it, and (after the first) speak a warm transition.
      if (pos.r === 0 && pos.s === 0 && introdRef.current !== pos.v) {
        introdRef.current = pos.v;
        setVerseIndex(pos.v);
        setReference(compiled.reference);
        if (pos.v > 0) {
          const ctrl = newAbort();
          await waitWhilePaused();
          if (cancelledRef.current) return;
          await runSay(verseIntro(compiled.reference, lang), lang, ctrl.signal);
          if (consumeReposition()) continue;
        }
      }

      const rung = compiled.rungs[pos.r];
      if (!rung) {
        // Verse exhausted → record (library only) and move on.
        finishVerse(pos.v, compiled);
        pos.v += 1;
        pos.r = 0;
        pos.s = 0;
        continue;
      }
      setRungLabel(rung.label);

      const step = rung.steps[pos.s];
      if (!step) {
        // Rung exhausted → climb, or end the verse.
        if (pos.r + 1 >= compiled.rungs.length) {
          finishVerse(pos.v, compiled);
          pos.v += 1;
          pos.r = 0;
          pos.s = 0;
        } else {
          pos.r += 1;
          pos.s = 0;
        }
        continue;
      }

      await waitWhilePaused();
      if (cancelledRef.current) return;

      const ctrl = newAbort();
      await runStep(step, lang, ctrl.signal);

      if (consumeReposition()) continue; // repeat/skip/back moved us
      if (pausedRef.current) continue; // paused mid-step → re-run this step on resume
      pos.s += 1; // normal advance
    }
  }

  function finishVerse(v, compiled) {
    const entry = playlist[v];
    const last = compiled.rungs[compiled.rungs.length - 1];
    if (entry && entry.libraryId && last && last.level === DriveRung.FREE_RECALL && onRecallRef.current) {
      onRecallRef.current(entry.libraryId); // time signal only — never status (drivemode-spec §8)
    }
  }

  const lastLang = () => playlist[playlist.length - 1]?.passage.language || 'en';

  function newAbort() {
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    return ctrl;
  }
  function consumeReposition() {
    if (repositionedRef.current) {
      repositionedRef.current = false;
      return true;
    }
    return false;
  }
  function reposition(mutate) {
    mutate(posRef.current);
    repositionedRef.current = true;
    abortRef.current?.abort();
    if (pausedRef.current) {
      pausedRef.current = false;
      setStatus('playing');
      releaseWaiters();
    }
  }

  // — controls (stable) —
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus('playing');
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playPause = useCallback(() => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setStatus('playing');
      releaseWaiters();
    } else {
      pausedRef.current = true;
      setStatus('paused');
      abortRef.current?.abort(); // stop the in-flight read/gap immediately
    }
  }, [releaseWaiters]);

  const repeat = useCallback(() => reposition((p) => { p.s = 0; }), []); // restart current rung
  const skip = useCallback(() => reposition((p) => { introdRef.current = -1; p.v += 1; p.r = 0; p.s = 0; }), []);
  const back = useCallback(() => reposition((p) => { introdRef.current = -1; p.v = Math.max(0, p.v - 1); p.r = 0; p.s = 0; }), []);

  const slower = useCallback(() => {
    rateRef.current = Math.max(RATE_MIN, +(rateRef.current - RATE_STEP).toFixed(2));
    setRate(rateRef.current);
  }, []);
  const faster = useCallback(() => {
    rateRef.current = Math.min(RATE_MAX, +(rateRef.current + RATE_STEP).toFixed(2));
    setRate(rateRef.current);
  }, []);

  const exit = useCallback(() => {
    cancelledRef.current = true;
    pausedRef.current = false;
    abortRef.current?.abort();
    releaseWaiters();
    rhemaRef.current.stop();
  }, [releaseWaiters]);

  return {
    status,
    verseIndex,
    reference,
    rungLabel,
    phase,
    listening,
    rate,
    total: playlist.length,
    start,
    playPause,
    repeat,
    skip,
    back,
    slower,
    faster,
    exit,
  };
}
