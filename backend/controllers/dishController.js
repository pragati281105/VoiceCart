const { getAllDishes, getDishById, getRecommendedDishes } = require('../utils/dishes');
const Item = require('../models/Item');

// GET /api/dishes  — all or by cuisine
const listDishes = (req, res) => {
  const { cuisine } = req.query;
  res.json(getAllDishes(cuisine));
};

// GET /api/dishes/recommended  — personalized by cart
const recommended = (req, res) => {
  try {
    const cartItems = Item.getAll(req.userId).map((i) => i.name);
    res.json(getRecommendedDishes(cartItems, 6));
  } catch {
    res.json(getRecommendedDishes([], 6));
  }
};

// GET /api/dishes/:id
const getDish = (req, res) => {
  const dish = getDishById(req.params.id);
  if (!dish) return res.status(404).json({ error: 'Dish not found' });
  res.json(dish);
};

module.exports = { listDishes, recommended, getDish };
