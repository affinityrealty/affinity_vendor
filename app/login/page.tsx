'use client';

import { useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 13px',
  border: '1.5px solid #C4C4BC',
  borderRadius: 8,
  fontSize: 15,
  fontFamily: 'inherit',
  marginBottom: 12,
  outline: 'none',
  boxSizing: 'border-box',
};

const primaryBtnStyle: CSSProperties = {
  width: '100%',
  padding: 13,
  background: '#1D2B1F',
  border: 'none',
  borderRadius: 9,
  fontFamily: 'inherit',
  fontSize: 15,
  fontWeight: 600,
  color: '#fff',
  cursor: 'pointer',
  marginBottom: 12,
};

const linkBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#8FB199',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError('Incorrect email or password.');
      return;
    }
    router.refresh();
    router.push('/');
  }

  async function doForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotMsg('');
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    setForgotMsg("If that email has an account, we've sent a recovery link.");
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#1D2B1F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Source Sans 3',system-ui,sans-serif",
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: '#8FB199',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia,serif',
              fontSize: 28,
              fontWeight: 600,
              color: '#1D2B1F',
              margin: '0 auto 16px',
            }}
          >
            A
          </div>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: '#fff', letterSpacing: '-.01em' }}>
            Affinity Realty
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#8FB199',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
            }}
          >
            Vendor Directory
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 8px 40px rgba(0,0,0,.35)' }}>
          {view === 'login' ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C18', marginBottom: 6 }}>Sign in</div>
              <div style={{ fontSize: 13, color: '#78786E', marginBottom: 20 }}>
                Access is restricted to authorized staff
              </div>
              <form onSubmit={doLogin}>
                <input
                  type="email"
                  placeholder="Email address"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  style={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && (
                  <div style={{ color: '#C0392B', fontSize: 13, marginBottom: 10, textAlign: 'left' }}>{error}</div>
                )}
                <button type="submit" style={primaryBtnStyle} disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <button
                onClick={() => {
                  setView('forgot');
                  setError('');
                }}
                style={linkBtnStyle}
              >
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C18', marginBottom: 6 }}>Reset password</div>
              <div style={{ fontSize: 13, color: '#78786E', marginBottom: 14, textAlign: 'left' }}>
                Enter your email and we&apos;ll send a recovery link.
              </div>
              <form onSubmit={doForgot}>
                <input
                  type="email"
                  placeholder="Email address"
                  style={{ ...inputStyle, marginBottom: 12 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {forgotMsg && (
                  <div style={{ color: '#2A6B35', fontSize: 13, marginBottom: 10 }}>{forgotMsg}</div>
                )}
                <button type="submit" style={{ ...primaryBtnStyle, marginBottom: 10 }} disabled={loading}>
                  {loading ? 'Sending…' : 'Send Recovery Email'}
                </button>
              </form>
              <button onClick={() => setView('login')} style={linkBtnStyle}>
                Back to sign in
              </button>
            </>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 20 }}>Secured with Supabase Auth</div>
      </div>
    </div>
  );
}
