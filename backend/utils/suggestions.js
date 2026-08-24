// Month-indexed (0=Jan) seasonal suggestions
const SEASONAL = {
  0: ['oranges', 'grapefruit', 'sweet potatoes'],
  1: ['avocados', 'cabbage', 'broccoli'],
  2: ['artichokes', 'peas', 'strawberries'],
  3: ['asparagus', 'spinach', 'mango'],
  4: ['blueberries', 'lemons', 'zucchini'],
  5: ['cherries', 'corn', 'tomatoes'],
  6: ['watermelon', 'peaches', 'eggplant'],
  7: ['plums', 'cantaloupe', 'green beans'],
  8: ['apples', 'grapes', 'bell peppers'],
  9: ['pumpkin', 'pomegranate', 'cauliflower'],
  10: ['cranberries', 'kale', 'sweet potatoes'],
  11: ['clementines', 'pears', 'brussels sprouts'],
};

// Item substitutes map
const SUBSTITUTES = {
  milk: ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  butter: ['margarine', 'coconut oil', 'olive oil'],
  sugar: ['honey', 'maple syrup', 'stevia'],
  flour: ['almond flour', 'oat flour', 'whole wheat flour'],
  beef: ['chicken', 'turkey', 'tofu'],
  chips: ['rice cakes', 'popcorn', 'veggie sticks'],
  soda: ['sparkling water', 'kombucha', 'juice'],
  bread: ['whole grain bread', 'sourdough', 'pita bread'],
  pasta: ['zucchini noodles', 'whole wheat pasta', 'rice noodles'],
  rice: ['quinoa', 'cauliflower rice', 'brown rice'],
};

function getSeasonalSuggestions() {
  const month = new Date().getMonth();
  return SEASONAL[month] || [];
}

function getSubstitutes(itemName) {
  const lower = itemName.toLowerCase();
  for (const [key, subs] of Object.entries(SUBSTITUTES)) {
    if (lower.includes(key)) return subs;
  }
  return [];
}

module.exports = { getSeasonalSuggestions, getSubstitutes };
