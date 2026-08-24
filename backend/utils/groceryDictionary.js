// Comprehensive grocery item dictionary for autocomplete suggestions
// Organized by aisle/category as you'd find in a shopping mall / supermarket

const GROCERY_ITEMS = [
  // Dairy & Eggs
  'milk', 'whole milk', 'skimmed milk', 'low-fat milk', 'almond milk', 'oat milk',
  'soy milk', 'coconut milk', 'rice milk', 'condensed milk', 'evaporated milk',
  'buttermilk', 'cream', 'heavy cream', 'whipping cream', 'sour cream', 'half and half',
  'cheese', 'cheddar cheese', 'mozzarella', 'parmesan', 'brie', 'gouda', 'feta cheese',
  'cream cheese', 'cottage cheese', 'ricotta', 'swiss cheese', 'paneer',
  'butter', 'salted butter', 'unsalted butter', 'ghee', 'margarine',
  'yogurt', 'greek yogurt', 'plain yogurt', 'flavored yogurt',
  'eggs', 'large eggs', 'white eggs', 'brown eggs', 'free-range eggs',
  'curd', 'whey', 'kefir',

  // Produce – Fruits
  'apples', 'red apples', 'green apples', 'fuji apples', 'gala apples', 'granny smith',
  'bananas', 'plantains', 'mangoes', 'alphonso mangoes', 'strawberries', 'blueberries',
  'raspberries', 'blackberries', 'grapes', 'green grapes', 'red grapes', 'cherries',
  'watermelon', 'cantaloupe', 'honeydew', 'pineapple', 'papaya', 'kiwi', 'guava',
  'lychee', 'dragon fruit', 'passion fruit', 'pomegranate', 'peaches', 'nectarines',
  'plums', 'apricots', 'oranges', 'clementines', 'tangerines', 'grapefruit',
  'lemons', 'limes', 'avocados', 'coconut', 'dates', 'figs', 'raisins',
  'dried cranberries', 'prunes',

  // Produce – Vegetables
  'tomatoes', 'cherry tomatoes', 'roma tomatoes', 'onions', 'red onions', 'spring onions',
  'green onions', 'shallots', 'garlic', 'ginger', 'potatoes', 'sweet potatoes',
  'baby potatoes', 'yam', 'carrots', 'baby carrots', 'celery', 'cucumber',
  'zucchini', 'eggplant', 'bell peppers', 'red pepper', 'green pepper', 'yellow pepper',
  'jalapeño', 'chili peppers', 'broccoli', 'cauliflower', 'cabbage', 'red cabbage',
  'brussels sprouts', 'spinach', 'baby spinach', 'kale', 'lettuce', 'romaine lettuce',
  'arugula', 'bok choy', 'asparagus', 'artichokes', 'beets', 'radishes', 'turnips',
  'parsnips', 'leeks', 'fennel', 'okra', 'corn', 'peas', 'green beans', 'snap peas',
  'edamame', 'mushrooms', 'portobello mushrooms', 'shiitake mushrooms', 'button mushrooms',

  // Bakery
  'bread', 'white bread', 'whole wheat bread', 'sourdough bread', 'multigrain bread',
  'gluten-free bread', 'baguette', 'ciabatta', 'pita bread', 'naan', 'roti', 'chapati',
  'tortillas', 'flour tortillas', 'corn tortillas', 'wraps', 'bagels', 'english muffins',
  'croissants', 'muffins', 'blueberry muffins', 'bran muffins', 'rolls', 'dinner rolls',
  'hot dog buns', 'hamburger buns', 'brioche', 'focaccia',
  'cake', 'chocolate cake', 'cupcakes', 'cookies', 'chocolate chip cookies',
  'oatmeal cookies', 'brownies', 'pastries', 'donuts', 'cinnamon rolls',

  // Meat & Seafood
  'chicken', 'chicken breast', 'chicken thighs', 'chicken wings', 'chicken drumsticks',
  'whole chicken', 'ground chicken', 'beef', 'ground beef', 'beef steak', 'sirloin',
  'ribeye', 'tenderloin', 'brisket', 'beef ribs', 'pork', 'pork chops', 'pork loin',
  'bacon', 'ham', 'prosciutto', 'salami', 'sausage', 'hot dogs',
  'lamb', 'lamb chops', 'lamb shanks', 'mutton',
  'turkey', 'ground turkey', 'turkey breast',
  'salmon', 'fresh salmon', 'smoked salmon', 'tilapia', 'tuna', 'cod', 'halibut',
  'shrimp', 'prawns', 'crab', 'lobster', 'scallops', 'oysters', 'mussels', 'clams',
  'sardines', 'anchovies',

  // Beverages
  'water', 'sparkling water', 'mineral water', 'coconut water',
  'orange juice', 'apple juice', 'grape juice', 'cranberry juice', 'tomato juice',
  'lemonade', 'iced tea', 'green tea', 'black tea', 'herbal tea', 'chai',
  'coffee', 'ground coffee', 'whole bean coffee', 'instant coffee', 'espresso',
  'cold brew', 'energy drinks', 'sports drinks', 'gatorade',
  'soda', 'cola', 'diet cola', 'ginger ale', 'tonic water', 'root beer',
  'kombucha', 'smoothies', 'aloe vera juice',
  'beer', 'wine', 'red wine', 'white wine', 'rose wine', 'champagne',
  'whiskey', 'vodka', 'rum', 'gin', 'tequila',
  'milk tea', 'protein shake', 'meal replacement shake',

  // Snacks
  'chips', 'potato chips', 'tortilla chips', 'corn chips', 'pita chips',
  'popcorn', 'microwave popcorn', 'caramel popcorn', 'cheese popcorn',
  'pretzels', 'crackers', 'rice cakes', 'granola bars', 'protein bars', 'energy bars',
  'nuts', 'almonds', 'cashews', 'peanuts', 'walnuts', 'pecans', 'pistachios',
  'mixed nuts', 'peanut butter', 'almond butter', 'nutella',
  'chocolate', 'dark chocolate', 'milk chocolate', 'chocolate bar',
  'candy', 'gummy bears', 'gummy worms', 'licorice', 'jelly beans', 'lollipops',
  'popcorn', 'trail mix', 'dried fruit mix', 'veggie straws',
  'biscuits', 'digestive biscuits', 'wafers', 'keto snacks',

  // Grains & Pasta
  'rice', 'white rice', 'brown rice', 'basmati rice', 'jasmine rice', 'sushi rice',
  'wild rice', 'quinoa', 'couscous', 'barley', 'farro', 'bulgur wheat',
  'pasta', 'spaghetti', 'penne', 'fusilli', 'rigatoni', 'linguine', 'fettuccine',
  'lasagna sheets', 'orzo', 'whole wheat pasta', 'gluten-free pasta',
  'noodles', 'rice noodles', 'egg noodles', 'ramen', 'udon', 'soba noodles',
  'flour', 'all-purpose flour', 'whole wheat flour', 'almond flour', 'bread flour',
  'oats', 'rolled oats', 'steel-cut oats', 'instant oats',
  'cereal', 'corn flakes', 'granola', 'muesli', 'bran flakes',
  'lentils', 'red lentils', 'green lentils', 'dal', 'chickpeas', 'kidney beans',
  'black beans', 'navy beans', 'soybeans', 'tofu', 'tempeh',
  'bread crumbs', 'panko', 'cornmeal', 'polenta',

  // Frozen Foods
  'frozen peas', 'frozen corn', 'frozen broccoli', 'frozen mixed vegetables',
  'frozen spinach', 'frozen berries', 'frozen mango chunks',
  'ice cream', 'gelato', 'sorbet', 'frozen yogurt',
  'pizza', 'frozen pizza', 'frozen burritos', 'frozen meals',
  'fish sticks', 'chicken nuggets', 'frozen fries', 'tater tots',
  'frozen waffles', 'frozen pancakes', 'edamame',

  // Condiments & Sauces
  'ketchup', 'mustard', 'yellow mustard', 'dijon mustard', 'mayonnaise',
  'hot sauce', 'sriracha', 'tabasco', 'soy sauce', 'teriyaki sauce',
  'worcestershire sauce', 'oyster sauce', 'fish sauce', 'hoisin sauce',
  'barbecue sauce', 'buffalo sauce', 'ranch dressing', 'italian dressing',
  'caesar dressing', 'balsamic vinegar', 'apple cider vinegar', 'white vinegar',
  'olive oil', 'extra virgin olive oil', 'vegetable oil', 'canola oil',
  'coconut oil', 'sesame oil', 'avocado oil',
  'salsa', 'guacamole', 'hummus', 'tzatziki', 'pesto',
  'tomato sauce', 'marinara sauce', 'alfredo sauce', 'pasta sauce',
  'curry paste', 'red curry paste', 'green curry paste',

  // Baking Supplies
  'sugar', 'white sugar', 'brown sugar', 'powdered sugar', 'cane sugar',
  'honey', 'maple syrup', 'agave syrup', 'molasses', 'corn syrup',
  'baking soda', 'baking powder', 'yeast', 'active dry yeast',
  'vanilla extract', 'almond extract', 'cocoa powder', 'chocolate chips',
  'sprinkles', 'food coloring', 'gelatin', 'cornstarch', 'arrowroot',

  // Spices & Herbs
  'salt', 'sea salt', 'himalayan pink salt', 'kosher salt', 'black pepper',
  'cumin', 'coriander', 'turmeric', 'paprika', 'smoked paprika', 'cayenne pepper',
  'chili powder', 'garlic powder', 'onion powder', 'ginger powder',
  'cinnamon', 'nutmeg', 'cardamom', 'cloves', 'allspice', 'star anise',
  'oregano', 'basil', 'thyme', 'rosemary', 'bay leaves', 'parsley',
  'dill', 'cilantro', 'mint', 'chives', 'sage', 'tarragon',
  'curry powder', 'garam masala', 'tandoori masala', 'biryani masala',
  'red chili flakes', 'mustard seeds', 'fennel seeds', 'fenugreek',

  // Canned & Jarred
  'canned tomatoes', 'diced tomatoes', 'crushed tomatoes', 'tomato paste', 'tomato puree',
  'canned beans', 'canned chickpeas', 'canned lentils', 'canned corn',
  'canned tuna', 'canned salmon', 'canned sardines', 'canned crab',
  'canned soup', 'chicken broth', 'vegetable broth', 'beef broth',
  'coconut cream', 'canned coconut milk', 'olives', 'capers', 'roasted peppers',
  'artichoke hearts', 'sun-dried tomatoes', 'pickles', 'jalapeños',
  'peanut butter', 'jam', 'strawberry jam', 'raspberry jam', 'orange marmalade',
  'applesauce', 'fruit cups',

  // Deli & Prepared Foods
  'sliced turkey', 'sliced ham', 'roast beef', 'pepperoni', 'bologna',
  'deli chicken', 'rotisserie chicken', 'hummus', 'olives', 'coleslaw',
  'potato salad', 'pasta salad', 'quiche', 'sushi', 'spring rolls',
  'samosas', 'dumplings', 'soup', 'ready meals',

  // Hygiene & Personal Care
  'soap', 'hand soap', 'body wash', 'shampoo', 'conditioner', 'dry shampoo',
  'toothpaste', 'toothbrush', 'electric toothbrush', 'mouthwash', 'dental floss',
  'deodorant', 'antiperspirant', 'body lotion', 'moisturizer', 'sunscreen',
  'face wash', 'toner', 'serum', 'lip balm', 'razors', 'shaving cream',
  'feminine hygiene products', 'tampons', 'sanitary pads', 'diapers', 'wet wipes',
  'cotton balls', 'cotton swabs', 'bandages', 'antiseptic', 'hand sanitizer',
  'toilet paper', 'tissues', 'paper towels',

  // Household
  'laundry detergent', 'fabric softener', 'bleach', 'all-purpose cleaner',
  'glass cleaner', 'bathroom cleaner', 'dishwashing liquid', 'dishwasher tablets',
  'sponges', 'scrubbing pads', 'rubber gloves', 'garbage bags', 'recycling bags',
  'zip-lock bags', 'aluminum foil', 'plastic wrap', 'parchment paper',
  'batteries', 'light bulbs', 'candles', 'matches', 'lighter',
  'air freshener', 'pest control', 'insect repellent',

  // Baby Products
  'baby formula', 'baby food', 'baby cereal', 'baby wipes', 'diapers',
  'sippy cups', 'baby shampoo', 'baby lotion', 'teething rings',

  // Pet Supplies
  'dog food', 'cat food', 'pet treats', 'cat litter', 'pet shampoo',
];

// Returns up to `limit` items matching the prefix (case-insensitive)
function searchGroceryItems(prefix, limit = 10) {
  if (!prefix || prefix.trim().length === 0) return [];
  const lower = prefix.toLowerCase().trim();
  return GROCERY_ITEMS
    .filter((item) => item.toLowerCase().startsWith(lower))
    .slice(0, limit);
}

// Returns items that contain the query anywhere (broader match), up to `limit`
function fuzzySearchGroceryItems(query, limit = 10) {
  if (!query || query.trim().length === 0) return [];
  const lower = query.toLowerCase().trim();
  const startsWith = GROCERY_ITEMS.filter((item) => item.toLowerCase().startsWith(lower));
  const contains = GROCERY_ITEMS.filter(
    (item) => !item.toLowerCase().startsWith(lower) && item.toLowerCase().includes(lower)
  );
  return [...startsWith, ...contains].slice(0, limit);
}

module.exports = { GROCERY_ITEMS, searchGroceryItems, fuzzySearchGroceryItems };
