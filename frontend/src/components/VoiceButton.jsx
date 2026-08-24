import { useState, useCallback } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseCommand } from '../utils/nlp';

const LOCALES = [
  { code: 'en-US', label: 'EN', flag: '🇺🇸' },
  { code: 'hi-IN', label: 'HI', flag: '🇮🇳' },
];

export default function VoiceButton({ onCommand, disabled }) {
  const [locale, setLocale] = useState('en-US');

  const handleResult = useCallback(
    (transcript) => {
      const command = parseCommand(transcript);
      if (command) onCommand(command, transcript);
    },
    [onCommand]
  );

  const { listening, transcript, error, isSupported, start, stop } = useVoiceRecognition({
    onResult: handleResult,
    locale,
  });

  if (!isSupported) {
    return (
      <div className="voice-unsupported">
        🎙️ Voice not supported in this browser. Use Chrome/Edge.
      </div>
    );
  }

  return (
    <div className="voice-section">
      <div className="language-toggle">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            className={`lang-btn ${locale === l.code ? 'active' : ''}`}
            onClick={() => setLocale(l.code)}
            disabled={listening}
            aria-label={`Switch to ${l.label}`}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      <button
        id="voice-btn"
        className={`mic-btn ${listening ? 'listening' : ''}`}
        onClick={listening ? stop : start}
        disabled={disabled}
        aria-label={listening ? 'Stop listening' : 'Start voice command'}
      >
        <span className="mic-icon">{listening ? '⏹' : '🎙️'}</span>
        <span className="mic-label">{listening ? 'Listening…' : 'Tap to speak'}</span>
        {listening && <span className="pulse-ring" />}
      </button>

      {transcript && (
        <div className="transcript-bubble" aria-live="polite">
          "{transcript}"
        </div>
      )}

      {error && (
        <div className="voice-error" role="alert">
          {error === 'not-allowed'
            ? 'Microphone access denied. Please allow mic permissions.'
            : `Voice error: ${error}`}
        </div>
      )}
    </div>
  );
}
