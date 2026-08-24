import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmojiBackground from '../components/EmojiBackground';

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Passed from RegisterPage or LoginPage
  const email      = location.state?.email     || '';
  const devOtp     = location.state?.devOtp    || null;   // only set in dev mode
  const devPreview = location.state?.devPreview || null;
  const isDevMode  = location.state?.isDevMode  ?? false;

  const [code,       setCode]       = useState('');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [resending,  setResending]  = useState(false);
  const [newDevOtp,  setNewDevOtp]  = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  const [resendOk,   setResendOk]   = useState(false);

  const currentDevOtp  = newDevOtp  ?? devOtp;
  const currentPreview = newPreview ?? devPreview;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResendOk(false);
    try {
      const data = await resendOtp(email);
      setNewDevOtp(data.devOtp || null);
      setNewPreview(data.devPreview || null);
      setResendOk(true);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
  };

  // Auto-fill when user clicks the dev OTP badge
  const fillDevOtp = () => {
    if (currentDevOtp) setCode(currentDevOtp);
  };

  return (
    <div className="auth-page">
      <EmojiBackground />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">📧</span>
          <span className="auth-logo-text">Verify Email</span>
        </div>
        <h1 className="auth-title">Enter your OTP</h1>
        <p className="auth-subtitle">
          {isDevMode
            ? 'Dev mode — no real email was sent. Your OTP is shown below.'
            : <>Code sent to <strong style={{ color: 'var(--accent-2)' }}>{email}</strong></>
          }
        </p>

        {/* ── Dev-mode OTP badge ── */}
        {isDevMode && currentDevOtp && (
          <button
            type="button"
            className="dev-otp-badge"
            onClick={fillDevOtp}
            title="Click to auto-fill"
          >
            <span className="dev-otp-label">🔧 Dev OTP (click to fill)</span>
            <span className="dev-otp-code">{currentDevOtp}</span>
            {currentPreview && (
              <a
                href={currentPreview}
                target="_blank"
                rel="noreferrer"
                className="dev-otp-preview"
                onClick={(e) => e.stopPropagation()}
              >
                View email preview ↗
              </a>
            )}
          </button>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            6-Digit Verification Code
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="auth-input otp-input"
              placeholder="_ _ _ _ _ _"
              value={code}
              onChange={handleChange}
              maxLength={6}
              required
              autoFocus
              autoComplete="one-time-code"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {resendOk && !isDevMode && (
            <p style={{ fontSize: '0.82rem', color: 'var(--green)', textAlign: 'center' }}>
              ✅ New code sent! Check your inbox.
            </p>
          )}
          {resendOk && isDevMode && (
            <p style={{ fontSize: '0.82rem', color: 'var(--green)', textAlign: 'center' }}>
              ✅ New OTP generated — see badge above.
            </p>
          )}

          <button
            id="otp-submit"
            type="submit"
            className="auth-btn"
            disabled={loading || code.length < 6}
          >
            {loading ? <span className="auth-spinner" /> : 'Verify & Start Shopping 🛒'}
          </button>

          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending…' : "Didn't receive it? Resend OTP"}
          </button>
        </form>

        <p className="auth-footer">
          Wrong email? <Link to="/register" className="auth-link">Go back</Link>
        </p>
      </div>
    </div>
  );
}
