import { useEffect, useState } from 'react';
import {
  getHistorySuggestions,
  getSeasonalSuggestions,
  getPopularSuggestions,
} from '../utils/api';

const TABS = [
  { id: 'frequent', label: '🔁 Frequent', emoji: '🔁' },
  { id: 'popular',  label: '🔥 Popular',  emoji: '🔥' },
  { id: 'seasonal', label: '🌿 Seasonal', emoji: '🌿' },
];

export default function Suggestions({ onAdd }) {
  const [history,  setHistory]  = useState([]);
  const [popular,  setPopular]  = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [tab,      setTab]      = useState('popular');

  useEffect(() => {
    getHistorySuggestions().then((r) => setHistory(r.data)).catch(() => {});
    getSeasonalSuggestions().then((r) => setSeasonal(r.data)).catch(() => {});
    getPopularSuggestions().then((r)  => setPopular(r.data)).catch(() => {});
  }, []);

  const displayItems = (() => {
    if (tab === 'frequent') {
      if (history.length === 0) return [];
      return history.map((h) => ({ label: h.name, sub: `Added ${h.frequency}×`, tag: 'history' }));
    }
    if (tab === 'popular') {
      return popular.map((p) => ({ label: p, sub: 'Popular choice', tag: 'popular' }));
    }
    // seasonal
    return seasonal.map((s) => ({ label: s, sub: 'In season now 🌱', tag: 'seasonal' }));
  })();

  const emptyMsg = {
    frequent: 'Add items to build your purchase history.',
    popular:  'Loading popular picks…',
    seasonal: 'Loading seasonal picks…',
  }[tab];

  return (
    <section className="suggestions-panel" aria-label="Suggestions">
      <div className="suggestions-tabs">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            id={`tab-${id}`}
            className={`tab-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {displayItems.length === 0 ? (
        <p className="no-suggestions">{emptyMsg}</p>
      ) : (
        <ul className="suggestion-list">
          {displayItems.map((s, i) => (
            <li key={i} className={`suggestion-chip chip-${s.tag}`}>
              <button
                className="suggestion-btn"
                onClick={() => onAdd({ name: s.label, quantity: 1, unit: '' })}
                aria-label={`Add ${s.label}`}
              >
                + {s.label}
              </button>
              <span className="suggestion-sub">{s.sub}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
