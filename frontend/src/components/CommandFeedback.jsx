import { useEffect, useState } from 'react';

export default function CommandFeedback({ message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div
      className={`command-feedback feedback-${type || 'info'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
