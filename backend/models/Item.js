const db = require('../utils/db');
const { categorize } = require('../utils/categories');

function getAll(userId) {
  if (userId) {
    return db.prepare('SELECT * FROM items WHERE user_id = ? ORDER BY category, name').all(userId);
  }
  return db.prepare('SELECT * FROM items ORDER BY category, name').all();
}

function getById(id) {
  return db.prepare('SELECT * FROM items WHERE id = ?').get(id);
}

function create({ name, quantity = 1, unit = '', userId }) {
  const category = categorize(name);
  const info = db.prepare(
    'INSERT INTO items (name, quantity, unit, category, user_id) VALUES (?, ?, ?, ?, ?)'
  ).run(name, quantity, unit, category, userId || null);

  // Update purchase history (per-user)
  const existing = db.prepare(
    'SELECT * FROM history WHERE LOWER(name) = LOWER(?) AND (user_id = ? OR user_id IS NULL)'
  ).get(name, userId || null);

  if (existing) {
    db.prepare('UPDATE history SET frequency = frequency + 1, last_added = datetime("now") WHERE id = ?')
      .run(existing.id);
  } else {
    db.prepare('INSERT INTO history (name, user_id) VALUES (?, ?)').run(name, userId || null);
  }

  return getById(info.lastInsertRowid);
}

function update(id, fields) {
  const item = getById(id);
  if (!item) return null;

  const name = fields.name ?? item.name;
  const quantity = fields.quantity ?? item.quantity;
  const unit = fields.unit ?? item.unit;
  const checked = fields.checked ?? item.checked;
  const category = fields.name ? categorize(name) : item.category;

  db.prepare(
    `UPDATE items SET name=?, quantity=?, unit=?, checked=?, category=?, updated_at=datetime('now') WHERE id=?`
  ).run(name, quantity, unit, checked, category, id);

  return getById(id);
}

function remove(id) {
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(id);
  return info.changes > 0;
}

function search(query, userId) {
  const term = `%${query.toLowerCase()}%`;
  if (userId) {
    return db.prepare('SELECT * FROM items WHERE user_id = ? AND LOWER(name) LIKE ? ORDER BY category').all(userId, term);
  }
  return db.prepare('SELECT * FROM items WHERE LOWER(name) LIKE ? ORDER BY category').all(term);
}

function clearAll(userId) {
  if (userId) {
    db.prepare('DELETE FROM items WHERE user_id = ?').run(userId);
  } else {
    db.prepare('DELETE FROM items').run();
  }
}

module.exports = { getAll, getById, create, update, remove, search, clearAll };
