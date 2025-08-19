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

  // If login?error=... present, show a friendly message
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
  }, []); // eslint-disable-line

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // magic link
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
      type: 'email', // 6-digit email OTP
    });

    setVerifying(false);
    if (error) setError(error.message);
    else window.location.href = '/admin';
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Hemp’in Directory — Admin</h1>
        <p className="auth-hint">Use your email to receive a magic link or enter the 6‑digit code.</p>

        {/* STEP 1: request email */}
        {!sent && (
          <form onSubmit={handleSend} className="space-y-4 mt-6">
            <label className="label text-left">Email</label>
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
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Send magic link + 6‑digit code'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        )}

        {/* STEP 2: verify code (always shown after “Send”) */}
        {sent && (
          <div className="space-y-4 mt-6">
            <p className="text-sm">
              We sent a <b>magic link</b> and a <b>6‑digit code</b> to <b>{email}</b>.
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-3">
              <label className="label text-left">6‑digit code</label>
              <input
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input tracking-widest text-center"
              />
              <button
                type="submit"
                disabled={verifying}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {verifying ? 'Verifying…' : 'Verify code & enter'}
              </button>
            </form>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            <p className="text-xs opacity-70">
              Tip: open the magic link in the <b>same browser</b> you used to request it.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
