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
};

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
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 8px 40px rgba(0,0,0,.35)' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1C1C18', marginBottom: 6 }}>
            Set your password
          </div>
          <div style={{ fontSize: 13, color: '#78786E', marginBottom: 20 }}>
            Enter a new password to reset your account.
          </div>
          <form onSubmit={doSetPassword}>
            <input
              type="password"
              placeholder="Set your new password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div style={{ color: '#C0392B', fontSize: 13, marginBottom: 10, textAlign: 'left' }}>{error}</div>}
            <button type="submit" style={primaryBtnStyle} disabled={loading}>
              {loading ? 'Saving…' : 'Set Password & Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
