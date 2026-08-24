import { useCallback, useEffect, useRef, useState } from 'react';
import { searchItems, getSubstitutes, getAutocompleteSuggestions } from '../utils/api';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

export default function SearchPanel({ onAdd }) {
  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState([]);
  const [substitutes,  setSubstitutes]  = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  // Fetch autocomplete suggestions while user types (short debounce)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 1) {
      setAutocomplete([]);
      setShowDropdown(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await getAutocompleteSuggestions(query);
        setAutocomplete(data);
        setShowDropdown(data.length > 0);
      } catch {
        setAutocomplete([]);
      }
    }, 200); // fast for autocomplete
    return () => clearTimeout(t);
  }, [query]);

  // Run full search with a slightly longer debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSubstitutes([]);
      setSearchedItem('');
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchItems(query);
        setResults(data);
        setSearchedItem(query);
        if (data.length === 0) {
          const subs = await getSubstitutes(query);
          setSubstitutes(subs.data);
        } else {
          setSubstitutes([]);
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  const pickAutocomplete = (item) => {
    setQuery(item);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleVoiceResult = useCallback((transcript) => {
    setQuery(transcript);
  }, []);

  const { listening, start, stop, isSupported } = useVoiceRecognition({
    onResult: handleVoiceResult,
    locale: 'en-US',
  });

  return (
    <section className="search-panel" aria-label="Search">
      <div className="search-bar" style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          className="text-input search-input"
          placeholder='Search items — e.g. "apples", "organic milk"…'
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onFocus={() => autocomplete.length > 0 && setShowDropdown(true)}
          aria-label="Search items"
          autoComplete="off"
        />
        {isSupported && (
          <button
            id="search-voice-btn"
            className={`mic-btn-small ${listening ? 'listening' : ''}`}
            onClick={listening ? stop : start}
            aria-label="Voice search"
          >
            🎙️
          </button>
        )}

        {/* Autocomplete dropdown */}
        {showDropdown && autocomplete.length > 0 && (
          <ul className="autocomplete-dropdown" role="listbox" aria-label="Suggestions">
            {autocomplete.map((item, i) => (
              <li
                key={i}
                className="autocomplete-item"
                role="option"
                onMouseDown={() => pickAutocomplete(item)}
              >
                <span className="autocomplete-icon">🔍</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <div className="search-loading"><div className="spinner-sm" /></div>}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li key={item.id} className="search-result-item">
              <span>{item.name}</span>
              <span className="search-result-cat">{item.category}</span>
            </li>
          ))}
        </ul>
      )}

      {!loading && searchedItem && results.length === 0 && (
        <div className="no-results">
          <p>No items in your list match "<strong>{searchedItem}</strong>"</p>
          {substitutes.length > 0 && (
            <>
              <p className="sub-title">Try these substitutes:</p>
              <ul className="suggestion-list">
                {substitutes.map((s, i) => (
                  <li key={i} className="suggestion-chip">
                    <button
                      className="suggestion-btn"
                      onClick={() => onAdd({ name: s, quantity: 1, unit: '' })}
                    >
                      + {s}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
