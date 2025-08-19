// app/admin/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function AdminPage() {
  // Auth check
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Allowlist
  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // Send to new brands area
  redirect('/admin/brands');
}
