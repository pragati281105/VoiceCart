const Item = require('../models/Item');

const getItems = (req, res) => {
  try {
    res.json(Item.getAll(req.userId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createItem = (req, res) => {
  const { name, quantity, unit } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Item name is required' });
  try {
    const item = Item.create({ name: name.trim(), quantity, unit, userId: req.userId });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const updateItem = (req, res) => {
  const { id } = req.params;
  try {
    const item = Item.update(parseInt(id), req.body);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const deleteItem = (req, res) => {
  const { id } = req.params;
  try {
    const deleted = Item.remove(parseInt(id));
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const searchItems = (req, res) => {
  const { q } = req.query;
  if (!q?.trim()) return res.json([]);
  try {
    res.json(Item.search(q.trim(), req.userId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const clearList = (req, res) => {
  try {
    Item.clearAll(req.userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem, searchItems, clearList };
