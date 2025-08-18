'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'working' | 'ok' | 'err'>('working');
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    const go = async () => {
      // Get the full URL and extract ?code=... safely
      const href = typeof window !== 'undefined' ? window.location.href : '';
      const code =
        typeof window !== 'undefined'
          ? new URL(window.location.href).searchParams.get('code')
          : null;

      if (!code) {
        setStatus('err');
        setMessage('Missing "code" in URL. Request a new magic link.');
        return;
      }

      const supabase = supabaseBrowser();

      // exchangeCodeForSession accepts the full URL
      const { error } = await supabase.auth.exchangeCodeForSession(href);

      if (error) {
        setStatus('err');
        setMessage(`Sign-in failed: ${error.message}`);
        return;
      }

      setStatus('ok');
      setMessage('Authenticated! Redirecting…');
      router.replace('/admin');
    };

    go();
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Auth Callback</h1>
      <p style={{ marginTop: 8, color: status === 'err' ? '#b91c1c' : '#111' }}>{message}</p>
      {status === 'err' && (
        <p style={{ marginTop: 8 }}>
          Tip: open the link in the <b>same browser</b> you used to request it,
          or use the 6‑digit code on <a href="/login">/login</a>.
        </p>
      )}
    </main>
  );
}
