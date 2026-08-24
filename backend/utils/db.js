const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// On Vercel, /var/task is read-only — write to /tmp instead.
// Locally, write to backend/data/ as before.
const DB_PATH = process.env.VERCEL
  ? '/tmp/voicecart.db'
  : path.join(__dirname, '..', 'data', 'shopping.db');

// Ensure directory exists (local only — /tmp always exists on Vercel)
if (!process.env.VERCEL) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Singleton connection
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// ── Create tables ──
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT '',
    category TEXT DEFAULT 'Other',
    checked INTEGER DEFAULT 0,
    added_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    frequency INTEGER DEFAULT 1,
    last_added TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT DEFAULT '',
    is_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

// ── Safe migrations: add columns that may not exist in older local DBs ──
function columnExists(table, column) {
  const cols = db.pragma(`table_info(${table})`);
  return cols.some((c) => c.name === column);
}

if (!columnExists('items',   'user_id')) {
  db.exec('ALTER TABLE items   ADD COLUMN user_id INTEGER');
  console.log('✅ Migrated: added user_id to items');
}

if (!columnExists('history', 'user_id')) {
  db.exec('ALTER TABLE history ADD COLUMN user_id INTEGER');
  console.log('✅ Migrated: added user_id to history');
}

module.exports = db;
