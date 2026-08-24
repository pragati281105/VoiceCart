import { useEffect, useState } from 'react';

export default function EditModal({ item, onSave, onClose, loading }) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit || '');

  useEffect(() => {
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit || '');
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(item.id, { name: name.trim(), quantity: Number(quantity), unit });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Edit item">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Edit Item</h3>
        <form onSubmit={handleSubmit}>
          <label className="modal-label">
            Name
            <input
              id="edit-name-input"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <div className="modal-row">
            <label className="modal-label">
              Qty
              <input
                id="edit-qty-input"
                type="number"
                className="qty-input"
                min="0.5"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>
            <label className="modal-label">
              Unit
              <input
                id="edit-unit-input"
                className="unit-input"
                placeholder="kg, L, pack…"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
