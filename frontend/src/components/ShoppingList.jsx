import ShoppingItem from './ShoppingItem';

export default function ShoppingList({ items, loading, onToggle, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="list-loading" aria-live="polite">
        <div className="spinner" />
        <p>Loading your list…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="list-empty">
        <span className="empty-icon">🛒</span>
        <p>Your list is empty.</p>
        <p className="hint">Say <em>"Add milk"</em> or type an item below.</p>
      </div>
    );
  }

  // Group by category
  const groups = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="shopping-list">
      {Object.entries(groups).map(([category, categoryItems]) => (
        <section key={category} className="category-section">
          <h2 className="category-header">{category}</h2>
          <ul className="category-items">
            {categoryItems.map((item) => (
              <ShoppingItem
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
