'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    <div className="auth-gate">
      <div style={{ textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <div className="auth-mark">A</div>
          <div className="auth-brand">Affinity Realty</div>
          <div className="auth-brand-sub">Vendor Directory</div>
        </div>

        <div className="auth-card">
          {view === 'login' ? (
            <>
              <div className="auth-title">Sign in</div>
              <div className="auth-sub">Access is restricted to authorized staff</div>
              <form onSubmit={doLogin}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <button
                onClick={() => {
                  setView('forgot');
                  setError('');
                }}
                className="auth-link"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <div className="auth-title">Reset password</div>
              <div className="auth-sub">Enter your email and we&apos;ll send a recovery link.</div>
              <form onSubmit={doForgot}>
                <input
                  type="email"
                  placeholder="Email address"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {forgotMsg && <div className="auth-success">{forgotMsg}</div>}
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Recovery Email'}
                </button>
              </form>
              <button onClick={() => setView('login')} className="auth-link">
                Back to sign in
              </button>
            </>
          )}
        </div>
        <div className="auth-footer">Secured with Supabase Auth</div>
      </div>
    </div>
  );
}
