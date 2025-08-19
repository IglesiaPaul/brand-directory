// app/admin/brands/page.tsx
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import AdminBrandsClient from './AdminBrandsClient';

export type Status = 'live' | 'demo' | 'draft' | 'archived' | null;

export type Brand = {
  id: string;
  slug?: string | null;
  brand_name: string | null;
  website: string | null;
  contact_email: string | null;
  country: string | null;
  industry: string | null;
  phone: string | null;
  slogan: string | null;
  description: string | null;
  is_test?: boolean | null;
  status?: Status;
  created_at?: string | null;

  // certifications
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default async function AdminBrandsPage() {
  // Auth + allowlist (same rules as before)
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) throw new Error(error.message);

  return <AdminBrandsClient initialRows={brands ?? []} />;
}
