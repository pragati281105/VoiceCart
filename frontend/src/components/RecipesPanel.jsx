import { useEffect, useState } from 'react';
import { getRecommendedDishes } from '../utils/api';

const CUISINE_COLORS = {
  Italian:  '#e74c3c',
  Indian:   '#f39c12',
  Modern:   '#27ae60',
  Asian:    '#e74c8b',
  American: '#3498db',
  Greek:    '#2980b9',
  Mexican:  '#e67e22',
  Chinese:  '#c0392b',
  Dessert:  '#8e44ad',
};

export default function RecipesPanel({ onAddIngredients }) {
  const [dishes,      setDishes]      = useState([]);
  const [selected,    setSelected]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [addingAll,   setAddingAll]   = useState(false);

  useEffect(() => {
    getRecommendedDishes()
      .then(({ data }) => setDishes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddIngredients = async (dish) => {
    setAddingAll(true);
    try {
      const items = dish.ingredients.map((ing) => {
        // Strip leading quantity+unit patterns: "400g", "2 cups", "1 tbsp", "½ cup", etc.
        const cleanName = ing
          .replace(/^[\d½¼¾⅓⅔]+[\w.]*\s+[\w]+\s+of\s+/i, '')  // "2 cups of milk" → "milk"
          .replace(/^[\d½¼¾⅓⅔]+[\w.]*\s+[\w]+\s+/i, '')         // "2 cups milk" → "milk"
          .replace(/^[\d½¼¾⅓⅔]+[\w.]*\s+/i, '')                 // "400g milk" → "milk"
          .replace(/^(a|an)\s+/i, '')                             // "a lemon" → "lemon"
          .trim();
        return { name: cleanName || ing, quantity: 1, unit: '' };
      });
      await onAddIngredients(items);
    } finally {
      setAddingAll(false);
    }
  };


  if (loading) {
    return (
      <div className="recipes-loading">
        <div className="spinner" />
        <p>Getting AI recommendations…</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="recipe-detail">
        <button className="recipe-back-btn" onClick={() => setSelected(null)}>
          ← Back to recommendations
        </button>

        <div className="recipe-detail-header">
          <span className="recipe-detail-emoji">{selected.emoji}</span>
          <div>
            <h2 className="recipe-detail-name">{selected.name}</h2>
            <div className="recipe-detail-meta">
              <span
                className="recipe-cuisine-tag"
                style={{ background: `${CUISINE_COLORS[selected.cuisine] || '#6c63ff'}22`,
                         color: CUISINE_COLORS[selected.cuisine] || '#a78bfa',
                         borderColor: `${CUISINE_COLORS[selected.cuisine] || '#6c63ff'}44` }}
              >
                {selected.cuisine}
              </span>
              <span className="recipe-meta-pill">⏱ {selected.time}</span>
              <span className="recipe-meta-pill">📊 {selected.difficulty}</span>
            </div>
          </div>
        </div>

        <p className="recipe-description">{selected.description}</p>

        <section className="recipe-section">
          <h3 className="recipe-section-title">🛒 Ingredients</h3>
          <ul className="recipe-ingredients">
            {selected.ingredients.map((ing, i) => (
              <li key={i} className="recipe-ingredient">
                <span className="ingredient-dot" />
                {ing}
              </li>
            ))}
          </ul>
          <button
            className="add-ingredients-btn"
            onClick={() => handleAddIngredients(selected)}
            disabled={addingAll}
          >
            {addingAll ? '⏳ Adding…' : '+ Add all to cart'}
          </button>
        </section>

        <section className="recipe-section">
          <h3 className="recipe-section-title">👨‍🍳 Cooking Steps</h3>
          <ol className="recipe-steps">
            {selected.steps.map((step, i) => (
              <li key={i} className="recipe-step">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    );
  }

  return (
    <section className="recipes-panel" aria-label="AI Recipe Recommendations">
      <div className="recipes-header">
        <h2 className="recipes-title">🤖 AI Dish Recommendations</h2>
        <p className="recipes-subtitle">Based on your shopping habits</p>
      </div>

      <div className="recipes-grid">
        {dishes.map((dish) => (
          <button
            key={dish.id}
            className="recipe-card"
            onClick={() => setSelected(dish)}
            id={`recipe-${dish.id}`}
          >
            <span className="recipe-emoji">{dish.emoji}</span>
            <div className="recipe-card-body">
              <span
                className="recipe-cuisine-tag"
                style={{ background: `${CUISINE_COLORS[dish.cuisine] || '#6c63ff'}22`,
                         color: CUISINE_COLORS[dish.cuisine] || '#a78bfa',
                         borderColor: `${CUISINE_COLORS[dish.cuisine] || '#6c63ff'}44` }}
              >
                {dish.cuisine}
              </span>
              <h3 className="recipe-name">{dish.name}</h3>
              <p className="recipe-desc">{dish.description}</p>
              <div className="recipe-footer">
                <span>⏱ {dish.time}</span>
                <span>📊 {dish.difficulty}</span>
                <span className="recipe-view-btn">View recipe →</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
