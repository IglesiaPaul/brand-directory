'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = supabaseBrowser();

      // exchange the token in the URL for a session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error('Auth error:', error.message);
        router.push('/login?error=1');
      } else {
        // success: redirect to admin dashboard
        router.push('/admin');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Authenticating...</h1>
      <p>Please wait while we log you in.</p>
    </main>
  );
}
