import { formatQuantity } from '../utils/nlp';

const CATEGORY_ICONS = {
  Dairy: '🥛',
  Produce: '🥦',
  Bakery: '🍞',
  Meat: '🥩',
  Beverages: '🥤',
  Snacks: '🍿',
  Grains: '🌾',
  Frozen: '🧊',
  Condiments: '🫙',
  Hygiene: '🧴',
  Household: '🧹',
  Other: '🛒',
};

export default function ShoppingItem({ item, onToggle, onDelete, onEdit }) {
  return (
    <li className={`shopping-item ${item.checked ? 'checked' : ''}`} id={`item-${item.id}`}>
      <button
        className="check-btn"
        onClick={() => onToggle(item.id, !item.checked)}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
      >
        <span className="check-icon">{item.checked ? '✅' : '⬜'}</span>
      </button>

      <div className="item-details">
        <span className="item-category-icon" title={item.category}>
          {CATEGORY_ICONS[item.category] || '🛒'}
        </span>
        <span className="item-name">{item.name}</span>
        {(item.quantity > 1 || item.unit) && (
          <span className="item-qty">{formatQuantity(item.quantity, item.unit)}</span>
        )}
        <span className="item-category-tag">{item.category}</span>
      </div>

      <div className="item-actions">
        <button
          className="icon-btn edit-btn"
          onClick={() => onEdit(item)}
          aria-label={`Edit ${item.name}`}
        >
          ✏️
        </button>
        <button
          className="icon-btn delete-btn"
          onClick={() => onDelete(item.id)}
          aria-label={`Delete ${item.name}`}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
