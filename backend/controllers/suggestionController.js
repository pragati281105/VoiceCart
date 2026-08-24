const db = require('../utils/db');
const { getSeasonalSuggestions, getSubstitutes } = require('../utils/suggestions');
const { fuzzySearchGroceryItems } = require('../utils/groceryDictionary');

const getHistorySuggestions = (req, res) => {
  try {
    const history = db.prepare(
      'SELECT name, frequency FROM history WHERE user_id = ? ORDER BY frequency DESC LIMIT 10'
    ).all(req.userId);
    res.json(history);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getSeasonal = (_req, res) => {
  res.json(getSeasonalSuggestions());
};

const getSubstituteSuggestions = (req, res) => {
  const { item } = req.params;
  if (!item) return res.status(400).json({ error: 'Item name required' });
  res.json(getSubstitutes(item));
};

// Autocomplete: match grocery dictionary by prefix
const getAutocompleteSuggestions = (req, res) => {
  const { q } = req.query;
  if (!q?.trim()) return res.json([]);
  res.json(fuzzySearchGroceryItems(q.trim(), 10));
};

// Popular items list for the Suggestions panel
const POPULAR_ITEMS = [
  'milk', 'eggs', 'bread', 'butter', 'cheese', 'yogurt', 'chicken breast',
  'rice', 'pasta', 'olive oil', 'apples', 'bananas', 'tomatoes', 'onions',
  'potatoes', 'garlic', 'carrots', 'spinach', 'orange juice', 'coffee',
  'sugar', 'salt', 'black pepper', 'ketchup', 'mayonnaise', 'peanut butter',
  'honey', 'oats', 'canned tomatoes', 'canned chickpeas',
];

const getPopularSuggestions = (_req, res) => {
  res.json(POPULAR_ITEMS);
};

module.exports = { getHistorySuggestions, getSeasonal, getSubstituteSuggestions, getAutocompleteSuggestions, getPopularSuggestions };

