import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmojiBackground from '../components/EmojiBackground';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const registeredSuccess = location.state?.registered;
  const initialEmail = location.state?.email || '';

  const [form, setForm]       = useState({ email: initialEmail, password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);


  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <EmojiBackground />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🛒</span>
          <span className="auth-logo-text">VoiceCart</span>
        </div>
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-subtitle">Sign in to your shopping list</p>

        {registeredSuccess && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: 10,
            padding: '12px 16px',
            color: '#4ade80',
            fontSize: '0.9rem',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            ✅ Account created successfully! Please sign in below.
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          <label className="auth-label">
            Email Address
            <input
              id="login-email"
              type="email"
              className="auth-input"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              id="login-password"
              type="password"
              className="auth-input"
              placeholder="Your password"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button id="login-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
