require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const requireAuth = require('./middleware/auth');

// Ensure data directory exists (only relevant locally — Vercel FS is read-only)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try { fs.mkdirSync(dataDir); } catch { /* ignore */ }
}

const app = express();

// Allow any localhost OR Vercel preview/production origin
const ALLOWED_ORIGINS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/.*\.vercel\.app$/,
];

if (process.env.FRONTEND_URL) {
  ALLOWED_ORIGINS.push(new RegExp(`^${process.env.FRONTEND_URL.replace(/\./g, '\\.')}$`));
}

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser / curl
    if (ALLOWED_ORIGINS.some((r) => r.test(origin))) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ── Public routes ──
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/dishes', require('./routes/dishes'));

// ── Protected routes (require JWT) ──
app.use('/api/items',       requireAuth, require('./routes/items'));
app.use('/api/suggestions', requireAuth, require('./routes/suggestions'));

// ── Error handler ──
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start listening ONLY when running directly (not when imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

// Export for Vercel serverless and for testing
module.exports = app;
