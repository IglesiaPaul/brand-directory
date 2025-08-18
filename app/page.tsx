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
      if (msg && !error) setError(msg === 'not_allowed'
        ? 'Your account is not allowed to view /admin yet.'
        : 'Login failed. Please try again.');
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
    <main className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Login</h1>

      {/* STEP 1: request email */}
      {!sent && (
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            required
            placeholder="me@pauliglesia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send Magic Link + 6‑Digit Code'}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      )}

      {/* STEP 2: verify code (always shown after “Send”) */}
      {sent && (
        <div className="space-y-4">
          <p>
            We sent a <b>magic link</b> and a <b>6‑digit code</b> to <b>{email}</b>.
          </p>
          <form onSubmit={handleVerifyCode} className="space-y-3">
            <input
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded tracking-widest"
            />
            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {verifying ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>

          {error && <p className="text-red-600">{error}</p>}
          <p className="text-sm opacity-70">
            Magic link tip: open it in the <b>same browser</b> you used to request it.
          </p>
        </div>
      )}
    </main>
  );
}
