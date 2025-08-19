'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Show friendly message if /login?error=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const msg = new URL(window.location.href).searchParams.get('error');
      if (msg && !error) {
        setError(
          msg === 'not_allowed'
            ? 'Your account is not allowed to view /admin yet.'
            : 'Login failed. Please try again.'
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // magic link callback
        shouldCreateUser: true,
      },
    });

    setSending(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email', // 6‑digit email OTP
    });

    setVerifying(false);
    if (error) setError(error.message);
    else window.location.href = '/admin';
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Hemp’in Directory — Admin</h1>
        <p className="auth-hint">Receive a magic link or enter the 6‑digit code from your email.</p>

        {/* Step 1: request magic link + code */}
        {!sent && (
          <form onSubmit={handleSend} className="auth-form">
            <label className="label">Email</label>
            <input
              type="email"
              required
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <button
              type="submit"
              disabled={sending}
              className="btn btn--primary auth-btn"
            >
              {sending ? 'Sending…' : 'Send magic link + 6‑digit code'}
            </button>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          </form>
        )}

        {/* Step 2: verify 6‑digit code */}
        {sent && (
          <div className="auth-form">
            <p className="auth-hint" style={{ marginBottom: 8 }}>
              Sent to <b>{email}</b>. You can click the link or paste the 6‑digit code:
            </p>
            <form onSubmit={handleVerifyCode} className="auth-form">
              <label className="label">6‑digit code</label>
              <input
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input"
                style={{ textAlign: 'center', letterSpacing: 4 }}
              />
              <button
                type="submit"
                disabled={verifying}
                className="btn btn--primary auth-btn"
              >
                {verifying ? 'Verifying…' : 'Verify & enter'}
              </button>
            </form>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            <p className="auth-hint" style={{ marginTop: 6 }}>
              Tip: open the link in the <b>same browser</b> you used to request it.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
