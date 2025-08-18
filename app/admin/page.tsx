// app/admin/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import AdminTable from './table';

export default async function AdminPage() {
  // 1) Check auth (server-side)
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in → go to /login
    redirect('/login');
  }

  // 2) Optional: allowlist the editors by email (RLS still protects DB)
  const ALLOWLIST = [
    'me@pauliglesia.com',
    // 'teammate@yourdomain.com'
  ];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // 3) Fetch data for the table
  //    Show only live non-test brands by default, tweak as you like
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) {
    // You can render a nicer error UI here if preferred
    throw new Error(error.message);
  }

  return <AdminTable rows={brands ?? []} />;
}
