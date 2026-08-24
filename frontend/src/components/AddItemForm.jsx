import { useState } from 'react';
import { parseMultipleItems } from '../utils/nlp';

export default function AddItemForm({ onAdd, loading }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('');

  // Does the name field contain multiple items?
  const isMulti = /\band\b|,/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isMulti) {
      // Parse and add each item separately
      const items = parseMultipleItems(name);
      for (const item of items) {
        await onAdd({ name: item.name, quantity: item.quantity, unit: item.unit });
      }
    } else {
      await onAdd({ name: name.trim(), quantity: Number(quantity), unit });
    }

    setName('');
    setQuantity(1);
    setUnit('');
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} aria-label="Add item form">
      <div className="add-form-row">
        <input
          id="item-name-input"
          type="text"
          className="text-input"
          placeholder="Item name — or &quot;milk, eggs and bread&quot; for multiple"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          aria-label="Item name"
        />
        {!isMulti && (
          <>
            <input
              id="item-qty-input"
              type="number"
              className="qty-input"
              min="0.5"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              aria-label="Quantity"
            />
            <input
              id="item-unit-input"
              type="text"
              className="unit-input"
              placeholder="unit (kg, L…)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              disabled={loading}
              aria-label="Unit"
            />
          </>
        )}
        <button
          id="add-item-btn"
          type="submit"
          className="add-btn"
          disabled={loading || !name.trim()}
          aria-label="Add item"
        >
          {loading ? '…' : isMulti ? '+ Add All' : '+ Add'}
        </button>
      </div>
      {isMulti && (
        <p className="multi-item-hint">
          📦 Will add: {parseMultipleItems(name).map((i) => i.name).join(' · ')}
        </p>
      )}
    </form>
  );
}
