import { useCallback, useRef, useState } from 'react';
import { speak as fetchSpeech } from '../../lib/elevenlabs.js';

// Rhema's voice. The reliable cross-browser pattern for "play audio after an
// async fetch triggered by a tap" is to keep ONE <audio> element, unlock it
// inside the user gesture (unlock()), then reuse it for every line — once an
// element has played from a gesture, later .play() calls are allowed (incl.
// Safari). Falls back to the browser's speech synthesis, and every path has a
// watchdog so the session can never hang on "Rhema is reading".

let silentWav;
function getSilentWav() {
  if (silentWav) return silentWav;
  // A valid 44-byte, zero-sample WAV — "plays" instantly so the gesture counts.
  const bytes = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x24, 0, 0, 0, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d,
    0x74, 0x20, 0x10, 0, 0, 0, 1, 0, 1, 0, 0x40, 0x1f, 0, 0, 0x40, 0x1f, 0, 0,
    1, 0, 8, 0, 0x64, 0x61, 0x74, 0x61, 0, 0, 0, 0,
  ]);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  silentWav = 'data:audio/wav;base64,' + btoa(bin);
  return silentWav;
}

export function useRhema() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  function getAudio() {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'auto';
      audioRef.current = a;
    }
    return audioRef.current;
  }

  // Call synchronously from a user gesture (the "Begin" tap) to unlock playback.
  const unlock = useCallback(() => {
    const a = getAudio();
    try {
      a.muted = true;
      a.src = getSilentWav();
      const p = a.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }).catch(() => {
          a.muted = false;
        });
      } else {
        a.muted = false;
      }
    } catch {
      a.muted = false;
    }
  }, []);

  const speak = useCallback(async (text, languageCode = null) => {
    if (!text) return;
    setSpeaking(true);
    let url;
    try {
      const blob = await fetchSpeech(text, { languageCode });
      url = URL.createObjectURL(blob);
      await playUrl(getAudio(), url);
    } catch (err) {
      console.warn('[Rhema] audio path failed — using browser speech.', err);
      await speakWithBrowser(text, languageCode);
    } finally {
      if (url) URL.revokeObjectURL(url);
      setSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        /* noop */
      }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speaking, speak, stop, unlock };
}

function playUrl(audio, url) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = setTimeout(finishOk, 20000); // safety watchdog

    function cleanup() {
      clearTimeout(timer);
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
    }
    function finishOk() {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    }
    function finishErr(err) {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err || new Error('audio error'));
    }

    audio.onended = finishOk;
    audio.onerror = () => finishErr(new Error('audio element error'));
    // Tighten the watchdog to the real duration once known.
    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        clearTimeout(timer);
        timer = setTimeout(finishOk, audio.duration * 1000 + 3000);
      }
    };

    audio.muted = false;
    audio.volume = 1;
    audio.src = url;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(finishErr);
  });
}

function speakWithBrowser(text, languageCode) {
  return new Promise((resolve) => {
    const estMs = Math.min(15000, 1000 + text.length * 70);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(resolve, estMs);
      return;
    }
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };
    const u = new SpeechSynthesisUtterance(text);
    if (languageCode === 'ko') u.lang = 'ko-KR';
    else if (languageCode === 'en') u.lang = 'en-US';
    u.rate = 0.95;
    u.onend = done;
    u.onerror = done;
    const timer = setTimeout(done, estMs + 2000); // watchdog
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      done();
    }
  });
}
