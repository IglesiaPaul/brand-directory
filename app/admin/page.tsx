// app/admin/page.tsx
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import AdminTable from './table';

type Status = 'live' | 'demo' | 'draft' | 'archived' | null;

type Brand = {
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

  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default async function AdminPage() {
  // 1) Auth check (server-side)
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2) Allowlist (YOUR email)
  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // 3) Load data (SSR)
  const { data, error } = await supabase
    .from('brands')
    .select(
      'id,slug,brand_name,website,contact_email,country,industry,phone,slogan,description,status,is_test,created_at,gots,bcorp,fair_trade,oeko_tex,vegan,climate_neutral'
    )
    .order('brand_name', { ascending: true });

  if (error) throw new Error(error.message);

  // Normalize nullable booleans to keep client code simple
  const initialRows: Brand[] = (data ?? []).map((b) => ({
    ...b,
    is_test: b.is_test ?? null,
    gots: b.gots ?? null,
    bcorp: b.bcorp ?? null,
    fair_trade: b.fair_trade ?? null,
    oeko_tex: b.oeko_tex ?? null,
    vegan: b.vegan ?? null,
    climate_neutral: b.climate_neutral ?? null,
  }));

  return (
    <main className="container" style={{ paddingTop: 16, paddingBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Admin — Brands
      </h1>
      <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>
        Edit brand details, toggle public visibility, and manage certifications.
      </p>
      {/* ✅ pass initialRows (not rows) */}
      <AdminTable initialRows={initialRows} />
    </main>
  );
}
