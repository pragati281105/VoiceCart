import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmojiBackground from '../components/EmojiBackground';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/login', {
        state: {
          registered: true,
          email: form.email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Shop smarter with voice & AI</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Full Name
            <input
              id="reg-name"
              type="text"
              className="auth-input"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
          </label>
          <label className="auth-label">
            Email Address
            <input
              id="reg-email"
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
              id="reg-password"
              type="password"
              className="auth-input"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              required
              autoComplete="new-password"
            />
          </label>
          <label className="auth-label">
            Confirm Password
            <input
              id="reg-confirm"
              type="password"
              className="auth-input"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set('confirm')}
              required
              autoComplete="new-password"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button id="reg-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>


        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
