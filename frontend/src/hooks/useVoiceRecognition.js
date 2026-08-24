import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function useVoiceRecognition({ onResult, locale = 'en-US' }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  // Keep onResult in a ref so the effect never needs to re-run when it changes.
  // This stops the recognition from being aborted every time items state updates.
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const isSupported = Boolean(SpeechRecognition);

  // Create the recognition instance ONCE (or when locale changes).
  // onResult changes don't trigger a teardown anymore.
  useEffect(() => {
    if (!isSupported) return;

    const rec = new SpeechRecognition();
    rec.continuous    = false;
    rec.interimResults = true;
    rec.lang = locale;

    rec.onstart = () => { setListening(true); setError(null); setTranscript(''); };
    rec.onend   = () => setListening(false);
    rec.onerror = (e) => { setError(e.error); setListening(false); };

    rec.onresult = (e) => {
      // Always use ONLY the latest result to avoid cross-utterance concatenation.
      // With continuous=false there is only ever one result set, but using the
      // last entry is still safer than joining all interim chunks.
      const lastResult = e.results[e.results.length - 1];
      const text = lastResult[0].transcript.trim();

      setTranscript(text);

      if (lastResult.isFinal) {
        onResultRef.current(text);   // call through ref — always the latest handler
      }
    };

    recognitionRef.current = rec;
    return () => rec.abort();
  // Only re-create when locale changes — NOT when onResult changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, isSupported]);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setTranscript('');
    recognitionRef.current.lang = locale;
    try {
      recognitionRef.current.start();
    } catch {
      // Already started — ignore
    }
  }, [listening, locale]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { listening, transcript, error, isSupported, start, stop };
}
