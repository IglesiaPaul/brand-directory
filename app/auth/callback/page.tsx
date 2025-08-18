'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<'working' | 'ok' | 'err'>('working');
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    const go = async () => {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      const code = params.get('code');
      if (!code) {
        setStatus('err');
        setMessage('Missing "code" in URL. Request a new magic link.');
        return;
      }

      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(url);

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
  }, [params, router]);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Auth Callback</h1>
      <p style={{ marginTop: 8, color: status === 'err' ? '#b91c1c' : '#111' }}>{message}</p>
      {status === 'err' && (
        <p style={{ marginTop: 8 }}>
          Tip: open the link in the <b>same browser</b> you used to request it, or use the
          6‑digit code flow on <a href="/login">/login</a>.
        </p>
      )}
    </main>
  );
}
