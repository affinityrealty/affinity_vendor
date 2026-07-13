'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function doSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    router.push('/');
  }

  return (
    <div className="auth-gate">
      <div style={{ textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <div style={{ marginBottom: 32 }}>
          <div className="auth-mark">A</div>
          <div className="auth-brand">Affinity Realty</div>
        </div>
        <div className="auth-card">
          <div className="auth-title">Set your password</div>
          <div className="auth-sub">Enter a new password to reset your account.</div>
          <form onSubmit={doSetPassword}>
            <input
              type="password"
              placeholder="Set your new password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Set Password & Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
