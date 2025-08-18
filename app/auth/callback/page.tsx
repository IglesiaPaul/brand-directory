'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const search = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState('Signing you in…');

  useEffect(() => {
    const run = async () => {
      const code = search.get('code');
      if (!code) {
        setMsg('Missing code in URL. Try requesting a new magic link.');
        router.replace('/login?error=missing_code');
        return;
      }
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMsg(`Sign-in failed: ${error.message}`);
        router.replace('/login?error=1');
        return;
      }
      router.replace('/admin');
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Auth Callback</h1>
      <p>{msg}</p>
    </main>
  );
}
