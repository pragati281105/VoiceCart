const CATEGORY_MAP = {
  Dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'paneer', 'ghee', 'curd', 'whey'],
  Produce: ['apple', 'banana', 'mango', 'tomato', 'onion', 'potato', 'lettuce', 'spinach', 'carrot', 'broccoli', 'garlic', 'ginger', 'lemon', 'orange', 'grape', 'strawberry', 'vegetable', 'fruit'],
  Bakery: ['bread', 'bun', 'bagel', 'muffin', 'croissant', 'cake', 'cookie', 'pastry', 'roll', 'pita', 'naan', 'roti', 'chapati'],
  Meat: ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'lamb', 'mutton', 'turkey', 'salmon', 'tuna', 'egg', 'meat'],
  Beverages: ['water', 'juice', 'soda', 'cola', 'coffee', 'tea', 'wine', 'beer', 'drink', 'beverage', 'smoothie', 'lemonade'],
  Snacks: ['chips', 'popcorn', 'biscuit', 'cracker', 'candy', 'chocolate', 'granola', 'bar', 'nut', 'almond', 'cashew', 'peanut', 'pretzel'],
  Grains: ['rice', 'pasta', 'noodle', 'oat', 'quinoa', 'flour', 'cereal', 'wheat', 'barley', 'lentil', 'dal', 'bean'],
  Frozen: ['frozen', 'ice cream', 'pizza', 'nugget', 'fries'],
  Condiments: ['sauce', 'ketchup', 'mustard', 'mayonnaise', 'vinegar', 'oil', 'salt', 'pepper', 'spice', 'sugar', 'honey', 'jam', 'pickle', 'dressing', 'masala'],
  Hygiene: ['soap', 'shampoo', 'toothpaste', 'toothbrush', 'deodorant', 'lotion', 'razor', 'tissue', 'sanitizer', 'facewash'],
  Household: ['detergent', 'cleaner', 'bleach', 'sponge', 'bag', 'foil', 'wrap', 'battery', 'bulb', 'towel', 'paper'],
};

function categorize(name) {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'Other';
}

module.exports = { categorize };
