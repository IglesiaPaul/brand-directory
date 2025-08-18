'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [mode, setMode] = useState<'otp' | 'password'>('otp');

  return (
    <main className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Login</h1>

      <div className="flex gap-2 text-sm">
        <button
          className={`px-3 py-1 border rounded ${mode === 'otp' ? 'bg-black text-white' : ''}`}
          onClick={() => setMode('otp')}
        >
          Email code
        </button>
        <button
          className={`px-3 py-1 border rounded ${mode === 'password' ? 'bg-black text-white' : ''}`}
          onClick={() => setMode('password')}
        >
          Password (temporary)
        </button>
      </div>

      {mode === 'otp' ? <OtpLogin /> : <PasswordLogin />}
    </main>
  );
}

function OtpLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // magic link
        shouldCreateUser: true,
      },
    });

    if (error) setError(error.message);
    else setSent(true);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email', // 6-digit email OTP
    });

    if (error) setError(error.message);
    else window.location.href = '/admin';
  }

  return (
    <section className="space-y-6">
      {!sent ? (
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded">
            Send Magic Link + 6‑Digit Code
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      ) : (
        <div className="space-y-3">
          <p>
            We emailed a <b>magic link</b> and a <b>6‑digit code</b> to <b>{email}</b>.
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
            <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded">
              Verify Code
            </button>
          </form>
          {error && <p className="text-red-600">{error}</p>}
          <p className="text-sm opacity-70">
            Magic link tip: open it in the <b>same browser</b> you used to request it.
          </p>
        </div>
      )}
    </section>
  );
}

function PasswordLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = supabaseBrowser();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else window.location.href = '/admin';
  }

  return (
    <form onSubmit={handlePasswordLogin} className="space-y-4">
      <input
        type="email"
        required
        placeholder="you@yourdomain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        required
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded">
        Sign in
      </button>
      {error && <p className="text-red-600">{error}</p>}
      <p className="text-sm opacity-70">
        Use this only for temporary admin access. You can disable it later.
      </p>
    </form>
  );
}
