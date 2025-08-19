// app/admin/brands/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import AdminBrandsShell from './AdminBrandsShell';
import type { Brand } from './types';

export default async function AdminBrandsPage() {
  // Auth + allowlist (mirror /admin)
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // Load brands
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <AdminBrandsShell initialRows={(brands ?? []) as Brand[]} />
  );
}
