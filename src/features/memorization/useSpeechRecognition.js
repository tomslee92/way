import { useCallback, useRef, useState } from 'react';

// Web Speech API wrapper for capturing the user's recitation, hands-free.
// `listen()` runs in continuous mode and resolves with the full transcript once
// the user pauses for `silenceMs` (so multi-line verses aren't cut off at the
// first breath). `requestPermission()` primes the mic from a user gesture so
// later auto-listening doesn't trigger a prompt mid-flow.

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function useSpeechRecognition() {
  const supported = Boolean(SpeechRecognitionImpl);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef(null);

  const requestPermission = useCallback(async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, []);

  const listen = useCallback(
    (lang = 'en-US', { silenceMs = 2500, leadMs = 7000, maxMs = 40000 } = {}) =>
      new Promise((resolve) => {
        if (!supported) {
          resolve('');
          return;
        }
        const rec = new SpeechRecognitionImpl();
        recognitionRef.current = rec;
        rec.lang = lang;
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        let finalText = '';
        let silenceTimer = null;
        let maxTimer = null;

        const armSilence = (ms) => {
          clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            try {
              rec.stop();
            } catch {
              /* already stopping */
            }
          }, ms);
        };

        rec.onresult = (event) => {
          let interimText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const r = event.results[i];
            if (r.isFinal) finalText += r[0].transcript + ' ';
            else interimText += r[0].transcript;
          }
          setInterim(interimText);
          armSilence(silenceMs); // reset the pause countdown on every utterance
        };
        rec.onspeechstart = () => armSilence(silenceMs);
        rec.onend = () => {
          clearTimeout(silenceTimer);
          clearTimeout(maxTimer);
          setListening(false);
          setInterim('');
          recognitionRef.current = null;
          resolve(finalText.trim());
        };
        // onerror is followed by onend, which resolves with whatever we caught.

        setListening(true);
        setInterim('');
        maxTimer = setTimeout(() => {
          try {
            rec.stop();
          } catch {
            /* noop */
          }
        }, maxMs);
        try {
          rec.start();
          armSilence(leadMs); // give the user a moment to begin
        } catch {
          setListening(false);
          resolve('');
        }
      }),
    [supported]
  );

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* noop */
      }
    }
  }, []);

  return { supported, listening, interim, listen, stop, requestPermission };
}
