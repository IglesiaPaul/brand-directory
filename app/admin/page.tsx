import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import AdminTable from './table';

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // no session → login
  if (!user) redirect('/login');

  // optional: enforce allowlist on UI as well (RLS already protects DB)
  const allowlist = ['you@yourdomain.com','teammate@yourdomain.com'];
  if (!allowlist.includes(user.email!)) redirect('/login');

  // load rows
  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) throw error;

  return <AdminTable rows={brands ?? []} />;
}
