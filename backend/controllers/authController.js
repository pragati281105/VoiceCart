const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'voicecart_dev_secret_change_in_prod';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// POST /api/auth/register
const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email?.trim() || !password) return res.status(400).json({ error: 'Email and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const normalEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalEmail);
    if (existing) return res.status(409).json({ error: 'Email already registered. Please log in.' });

    const hash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (email, password_hash, name, is_verified) VALUES (?, ?, ?, 1)').run(normalEmail, hash, name || '');

    res.json({
      message: 'Account created successfully! Please sign in.',
      email: normalEmail,
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed: ' + e.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/auth/me
const getMe = (req, res) => {
  const user = db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

module.exports = { register, login, getMe };

