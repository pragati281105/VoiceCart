// Curated AI dish recommendations with ingredients and cooking directions
// Used by the /api/dishes endpoint

const DISHES = [
  {
    id: 1,
    name: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    emoji: '🍝',
    time: '25 min',
    difficulty: 'Easy',
    description: 'Creamy Roman pasta with crispy pancetta and a silky egg sauce.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large eggs',
      '100g Pecorino Romano or Parmesan, grated',
      '2 cloves garlic',
      'Black pepper to taste',
      'Salt',
    ],
    steps: [
      'Cook spaghetti in well-salted boiling water until al dente.',
      'Fry pancetta in a large pan over medium heat until crispy. Remove from heat.',
      'Whisk eggs with grated cheese and a generous amount of black pepper in a bowl.',
      'Reserve 1 cup pasta water, then drain pasta.',
      'Add hot pasta to the pancetta pan (off heat). Pour egg mixture over, tossing quickly.',
      'Add splashes of pasta water to create a creamy, silky sauce. Do not scramble the eggs.',
      'Serve immediately with extra cheese and black pepper.',
    ],
  },
  {
    id: 2,
    name: 'Chicken Tikka Masala',
    cuisine: 'Indian',
    emoji: '🍛',
    time: '45 min',
    difficulty: 'Medium',
    description: 'Tender grilled chicken in a rich, aromatic tomato-cream curry sauce.',
    ingredients: [
      '700g chicken breast, cubed',
      '1 cup yogurt',
      '2 tbsp tandoori masala',
      '1 tbsp garam masala',
      '1 can (400g) crushed tomatoes',
      '1 cup heavy cream',
      '1 large onion, chopped',
      '4 garlic cloves, minced',
      '1 inch ginger, grated',
      '2 tbsp butter',
      'Salt to taste',
      'Fresh cilantro to garnish',
    ],
    steps: [
      'Marinate chicken in yogurt, tandoori masala, and salt for at least 30 min.',
      'Grill or broil chicken until charred. Set aside.',
      'Melt butter in a large pan. Sauté onions until golden.',
      'Add garlic and ginger; cook 2 minutes until fragrant.',
      'Pour in crushed tomatoes. Simmer 15 minutes until sauce thickens.',
      'Stir in garam masala and heavy cream. Simmer 5 minutes.',
      'Add grilled chicken. Simmer 10 minutes to meld flavors.',
      'Garnish with cilantro. Serve with naan or basmati rice.',
    ],
  },
  {
    id: 3,
    name: 'Avocado Toast',
    cuisine: 'Modern',
    emoji: '🥑',
    time: '10 min',
    difficulty: 'Easy',
    description: 'Creamy smashed avocado on toasted sourdough with a perfect soft-boiled egg.',
    ingredients: [
      '2 slices sourdough bread',
      '1 ripe avocado',
      '2 eggs',
      '1 lemon, juiced',
      'Red chili flakes',
      'Sea salt & black pepper',
      'Olive oil drizzle',
    ],
    steps: [
      'Soft-boil eggs: simmer in boiling water for exactly 6.5 minutes, then ice-bath.',
      'Toast sourdough until golden and crispy.',
      'Halve avocado, remove pit, and scoop flesh into a bowl.',
      'Add lemon juice, salt, and pepper. Mash to your preferred consistency.',
      'Spread avocado generously over toast.',
      'Peel and halve the soft-boiled eggs. Place on top.',
      'Drizzle with olive oil, sprinkle chili flakes and sea salt.',
    ],
  },
  {
    id: 4,
    name: 'Beef Stir-Fry',
    cuisine: 'Asian',
    emoji: '🥢',
    time: '20 min',
    difficulty: 'Easy',
    description: 'Tender beef strips with crisp vegetables in a savory umami sauce.',
    ingredients: [
      '500g beef sirloin, thinly sliced',
      '2 cups broccoli florets',
      '1 red bell pepper, sliced',
      '1 carrot, julienned',
      '3 garlic cloves, minced',
      '1 inch ginger, grated',
      '3 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '1 tbsp sesame oil',
      '1 tsp cornstarch',
      'Vegetable oil',
      'Sesame seeds',
    ],
    steps: [
      'Toss beef slices with cornstarch and 1 tbsp soy sauce. Marinate 10 min.',
      'Mix remaining soy sauce, oyster sauce, and sesame oil for the stir-fry sauce.',
      'Heat oil in a wok over high heat until smoking.',
      'Sear beef in batches 1-2 min per side. Remove and set aside.',
      'Stir-fry garlic and ginger 30 seconds until fragrant.',
      'Add vegetables; cook 3-4 minutes keeping them crisp.',
      'Return beef to wok. Pour sauce over everything.',
      'Toss and cook 1-2 minutes. Serve over rice with sesame seeds.',
    ],
  },
  {
    id: 5,
    name: 'Banana Pancakes',
    cuisine: 'American',
    emoji: '🥞',
    time: '20 min',
    difficulty: 'Easy',
    description: 'Fluffy, naturally sweet pancakes using ripe bananas — no sugar needed!',
    ingredients: [
      '2 ripe bananas',
      '2 eggs',
      '1 cup all-purpose flour',
      '1 cup milk',
      '1 tsp baking powder',
      '1 tsp vanilla extract',
      'Pinch of salt',
      'Butter for cooking',
      'Maple syrup, berries to serve',
    ],
    steps: [
      'Mash bananas thoroughly in a large bowl.',
      'Add eggs, milk, and vanilla extract. Whisk to combine.',
      'Sift in flour, baking powder, and salt. Mix until just combined (lumps are fine).',
      'Heat a pan over medium heat. Add a small knob of butter.',
      'Pour ¼ cup batter per pancake. Cook until bubbles form on surface (~2 min).',
      'Flip and cook 1-2 more minutes until golden.',
      'Serve warm with maple syrup, fresh berries, and a dusting of powdered sugar.',
    ],
  },
  {
    id: 6,
    name: 'Greek Salad',
    cuisine: 'Greek',
    emoji: '🥗',
    time: '15 min',
    difficulty: 'Easy',
    description: 'Crisp cucumbers, juicy tomatoes, olives and creamy feta in a bright dressing.',
    ingredients: [
      '3 large tomatoes, chunked',
      '1 cucumber, sliced',
      '1 red onion, thinly sliced',
      '200g feta cheese, cubed',
      '100g kalamata olives',
      '1 green pepper, sliced',
      '3 tbsp extra virgin olive oil',
      '1 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Salt & black pepper',
    ],
    steps: [
      'Combine tomatoes, cucumber, onion, and green pepper in a large bowl.',
      'Add olives and feta cheese on top.',
      'Whisk together olive oil, vinegar, oregano, salt, and pepper.',
      'Pour dressing over salad.',
      'Toss gently to combine. Serve immediately.',
    ],
  },
  {
    id: 7,
    name: 'Mushroom Risotto',
    cuisine: 'Italian',
    emoji: '🍄',
    time: '40 min',
    difficulty: 'Medium',
    description: 'Velvety Arborio rice slowly cooked with umami-rich mushrooms and Parmesan.',
    ingredients: [
      '300g Arborio rice',
      '400g mixed mushrooms (portobello, shiitake, button)',
      '1L warm chicken or vegetable broth',
      '1 large onion, finely diced',
      '4 garlic cloves, minced',
      '120ml dry white wine',
      '80g Parmesan, grated',
      '3 tbsp butter',
      '2 tbsp olive oil',
      'Fresh thyme',
      'Salt & pepper',
    ],
    steps: [
      'Sauté mushrooms in butter over high heat until golden. Season and set aside.',
      'Heat olive oil in a wide pan. Soften onion 5 minutes.',
      'Add garlic and rice; toast 2 minutes until rice turns translucent at edges.',
      'Pour in wine; stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly. Wait until each ladle is absorbed before adding next.',
      'Continue for 18-20 minutes until rice is creamy and al dente.',
      'Stir in mushrooms, butter, and half the Parmesan.',
      'Season, top with remaining cheese and fresh thyme. Serve immediately.',
    ],
  },
  {
    id: 8,
    name: 'Fish Tacos',
    cuisine: 'Mexican',
    emoji: '🌮',
    time: '25 min',
    difficulty: 'Easy',
    description: 'Crispy seasoned fish in warm tortillas with zingy lime slaw and chipotle mayo.',
    ingredients: [
      '400g white fish fillets (cod or tilapia)',
      '8 small flour/corn tortillas',
      '2 cups shredded cabbage',
      '1 lime',
      '1 avocado, sliced',
      '½ cup mayonnaise',
      '1 chipotle in adobo, minced',
      '1 tsp cumin',
      '1 tsp paprika',
      'Salt & pepper',
      'Fresh cilantro',
    ],
    steps: [
      'Mix cumin, paprika, salt, and pepper. Rub over fish fillets.',
      'Pan-fry fish in oil 3-4 minutes per side until flaky and golden.',
      'Mix cabbage with lime juice and a pinch of salt for quick slaw.',
      'Whisk together mayo and chipotle for the sauce.',
      'Warm tortillas in a dry pan or directly over a flame.',
      'Break fish into chunks. Layer on tortillas: fish, slaw, avocado slices.',
      'Drizzle chipotle mayo, squeeze lime, scatter cilantro. Serve immediately.',
    ],
  },
  {
    id: 9,
    name: 'Egg Fried Rice',
    cuisine: 'Chinese',
    emoji: '🍳',
    time: '15 min',
    difficulty: 'Easy',
    description: 'Restaurant-style fried rice with fluffy egg, garlicky aromatics, and soy sauce.',
    ingredients: [
      '3 cups cooked rice (day-old is best)',
      '3 large eggs',
      '1 cup frozen peas and carrots',
      '4 garlic cloves, minced',
      '3 spring onions, sliced',
      '3 tbsp soy sauce',
      '1 tbsp oyster sauce',
      '1 tsp sesame oil',
      '2 tbsp vegetable oil',
    ],
    steps: [
      'Heat oil in a wok or large pan over very high heat.',
      'Add garlic; stir-fry 30 seconds until fragrant.',
      'Add peas and carrots; cook 2 minutes.',
      'Push everything to one side. Scramble eggs on the empty side until just set, then mix in.',
      'Add rice, breaking up any clumps. Stir-fry 3-4 minutes.',
      'Pour soy sauce and oyster sauce over rice. Mix well.',
      'Drizzle sesame oil. Toss and serve garnished with spring onions.',
    ],
  },
  {
    id: 10,
    name: 'Chocolate Lava Cakes',
    cuisine: 'Dessert',
    emoji: '🍫',
    time: '20 min',
    difficulty: 'Medium',
    description: 'Decadent individual cakes with a warm, flowing molten chocolate centre.',
    ingredients: [
      '200g dark chocolate (70%)',
      '120g butter',
      '4 eggs + 4 yolks',
      '120g powdered sugar',
      '60g all-purpose flour',
      '1 tsp vanilla extract',
      'Pinch of salt',
      'Butter & cocoa powder (for ramekins)',
      'Vanilla ice cream to serve',
    ],
    steps: [
      'Preheat oven to 220°C (425°F). Butter 6 ramekins and dust with cocoa.',
      'Melt chocolate and butter together over a double boiler. Cool slightly.',
      'Whisk eggs, yolks, sugar, and vanilla until pale and slightly thick.',
      'Fold chocolate mixture into egg mixture.',
      'Sift in flour and salt; fold gently until just combined.',
      'Divide between ramekins. Can refrigerate up to 2 days at this point.',
      'Bake 12 minutes — edges firm but centre jiggly.',
      'Let rest 1 minute. Invert onto plates. Serve immediately with ice cream.',
    ],
  },
];

/**
 * Returns all dishes or dishes filtered by cuisine
 */
function getAllDishes(cuisine) {
  if (cuisine) {
    return DISHES.filter((d) => d.cuisine.toLowerCase() === cuisine.toLowerCase());
  }
  return DISHES;
}

/**
 * Returns a single dish by id
 */
function getDishById(id) {
  return DISHES.find((d) => d.id === Number(id)) || null;
}

/**
 * Returns a randomized selection, optionally weighted by items in user's cart
 */
function getRecommendedDishes(cartItemNames = [], limit = 6) {
  if (cartItemNames.length === 0) {
    // Shuffle all and return `limit` dishes
    return DISHES.sort(() => Math.random() - 0.5).slice(0, limit);
  }

  const lowerCart = cartItemNames.map((n) => n.toLowerCase());

  // Score: how many ingredients match cart items
  const scored = DISHES.map((dish) => {
    const score = dish.ingredients.filter((ing) =>
      lowerCart.some((cartItem) => ing.toLowerCase().includes(cartItem) || cartItem.includes(ing.toLowerCase().split(' ')[0]))
    ).length;
    return { ...dish, score };
  });

  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);
  return scored.slice(0, limit);
}

module.exports = { DISHES, getAllDishes, getDishById, getRecommendedDishes };
