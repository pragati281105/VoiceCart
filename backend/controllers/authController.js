const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'voicecart_dev_secret_change_in_prod';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// ── Is this a real email config? ──
const HAS_REAL_EMAIL = !!(process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASS?.trim());

// ── Email transporter ──
async function getTransporter() {
  if (HAS_REAL_EMAIL) {
    return {
      transport: nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      }),
      isTest: false,
    };
  }
  // Dev fallback: try Ethereal test account; if network fails, use mock transporter
  try {
    const testAccount = await Promise.race([
      nodemailer.createTestAccount(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Ethereal timeout')), 4000)),
    ]);
    return {
      transport: nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      }),
      isTest: true,
    };
  } catch (err) {
    console.warn('⚠️ Ethereal test account setup failed/timed out, using mock delivery:', err.message);
    return {
      transport: {
        sendMail: async () => ({ messageId: `dev-mock-${Date.now()}` }),
      },
      isTest: true,
    };
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Shared: generate OTP + send email ──
async function sendOtpEmail(email, name) {
  const code = generateOTP();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  // Store OTP (delete any old one first)
  db.prepare('DELETE FROM otps WHERE email = ?').run(email);
  db.prepare('INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)').run(email, code, expiresAt);

  let isTest = true;
  let devPreview = null;

  try {
    const res = await getTransporter();
    isTest = res.isTest;
    const info = await res.transport.sendMail({
      from: `"VoiceCart" <${process.env.EMAIL_USER || 'noreply@voicecart.app'}>`,
      to: email,
      subject: 'Your VoiceCart Verification Code',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d0f1a;color:#f0f2ff;border-radius:16px;">
          <h1 style="font-size:1.8rem;background:linear-gradient(135deg,#a78bfa,#6c63ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;">🛒 VoiceCart</h1>
          <p style="color:#8891a8;margin-bottom:24px;">Your smart voice-powered shopping assistant</p>
          <p style="margin-bottom:16px;">Hi ${name || 'there'}, here is your one-time verification code:</p>
          <div style="background:#161929;border:1px solid rgba(108,99,255,0.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:2.5rem;font-weight:700;letter-spacing:12px;color:#a78bfa;">${code}</span>
          </div>
          <p style="color:#8891a8;font-size:0.85rem;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    if (isTest && nodemailer.getTestMessageUrl) {
      devPreview = nodemailer.getTestMessageUrl(info);
    }
  } catch (err) {
    console.warn('⚠️ sendMail failed, proceeding in dev mode:', err.message);
  }

  return { code, devPreview, isTest };
}


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

module.exports = { register, resendOtp, verifyOtp, login, getMe };
