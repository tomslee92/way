import { useCallback, useRef } from 'react';

// Tier 2 voice-activity detection (drivemode-spec §5). Detects that the user spoke
// and then fell silent — NEVER what they said. Pure Web Audio RMS energy on-device:
// no transcription, no network, no recording is kept. This is what keeps adaptive
// pacing on-brand (coaching-not-grading): there is nothing here to be wrong about.
//
// Degrades silently: if the mic is unsupported or declined, requestPermission()
// returns false and the player falls back to Tier 1 fixed timers. Even when granted,
// a too-noisy environment simply yields timeouts — which also advance — so Drive Mode
// always works.

const hasAudio =
  typeof navigator !== 'undefined' &&
  navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  (typeof AudioContext !== 'undefined' || typeof window !== 'undefined');

function AudioCtx() {
  return typeof AudioContext !== 'undefined' ? AudioContext : window.webkitAudioContext;
}

export function useVoiceActivity() {
  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const floorRef = useRef(0.01); // ambient noise floor (RMS), calibrated on grant
  const readyRef = useRef(false);

  // Call from a user gesture (the entry tap). Opens the mic, wires an analyser, and
  // samples the room briefly to learn its noise floor. Returns whether VAD is usable.
  const requestPermission = useCallback(async () => {
    if (!hasAudio) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctx = AudioCtx();
      const ctx = new Ctx();
      if (ctx.state === 'suspended') await ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);

      streamRef.current = stream;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      readyRef.current = true;

      // Learn the ambient floor over ~400ms of (assumed) quiet.
      await calibrate(analyser, 400, floorRef);
      return true;
    } catch {
      readyRef.current = false;
      return false;
    }
  }, []);

  // Whether VAD is wired and usable right now.
  const ready = useCallback(() => readyRef.current, []);

  // Resolve when the user has spoken and then gone quiet, or a window elapses.
  // Resolves 'spoke' | 'timeout'. Honors an AbortSignal so the player can cancel the
  // listen (pause / skip) — an aborted wait resolves 'timeout' (advance, never hang).
  const waitForSpeechEnd = useCallback((opts = {}) => {
    const {
      maxMs = 30000,
      leadMs = 8000,
      minSpeechMs = 350,
      trailingSilenceMs = 1100,
      signal,
    } = opts;
    const analyser = analyserRef.current;
    if (!readyRef.current || !analyser) return Promise.resolve('timeout');

    return new Promise((resolve) => {
      const buf = new Uint8Array(analyser.fftSize);
      const t0 = performance.now();
      let last = t0;
      let speechMs = 0; // time above threshold before "started"
      let silenceMs = 0; // time below threshold after "started"
      let started = false;
      let raf = 0;
      let settled = false;

      function finish(result) {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(raf);
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve(result);
      }
      function onAbort() {
        finish('timeout');
      }
      if (signal) {
        if (signal.aborted) return finish('timeout');
        signal.addEventListener('abort', onAbort, { once: true });
      }

      function tick() {
        const now = performance.now();
        const dt = now - last;
        last = now;
        const elapsed = now - t0;

        const rms = readRms(analyser, buf);
        // Adapt the floor downward toward quiet; threshold sits above it.
        if (rms < floorRef.current) floorRef.current = floorRef.current * 0.9 + rms * 0.1;
        const threshold = floorRef.current * 2.5 + 0.012;

        if (rms > threshold) {
          speechMs += dt;
          silenceMs = 0;
          if (!started && speechMs >= minSpeechMs) started = true;
        } else if (started) {
          silenceMs += dt;
          if (silenceMs >= trailingSilenceMs) return finish('spoke');
        }

        if (!started && elapsed >= leadMs) return finish('timeout');
        if (elapsed >= maxMs) return finish('timeout');
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    });
  }, []);

  // Release the mic and audio graph entirely (on exit).
  const release = useCallback(() => {
    readyRef.current = false;
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {
      /* noop */
    }
    try {
      ctxRef.current?.close();
    } catch {
      /* noop */
    }
    streamRef.current = null;
    ctxRef.current = null;
    analyserRef.current = null;
  }, []);

  return { supported: hasAudio, requestPermission, ready, waitForSpeechEnd, release };
}

function readRms(analyser, buf) {
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128; // center & normalize to [-1, 1]
    sum += v * v;
  }
  return Math.sqrt(sum / buf.length);
}

function calibrate(analyser, ms, floorRef) {
  return new Promise((resolve) => {
    const buf = new Uint8Array(analyser.fftSize);
    const t0 = performance.now();
    let min = 1;
    let raf = 0;
    function tick() {
      const rms = readRms(analyser, buf);
      if (rms < min) min = rms;
      if (performance.now() - t0 >= ms) {
        cancelAnimationFrame(raf);
        floorRef.current = Math.max(0.004, min); // never trust an impossibly low floor
        return resolve();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  });
}
