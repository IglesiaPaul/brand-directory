// app/admin/brands/[id]/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';
import EditorClient from './EditorClient';

type Status = 'live' | 'demo' | 'draft' | 'archived' | null;

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

  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default async function AdminBrandEditPage({
  params,
}: { params: { id: string } }) {
  // Auth + allowlist
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // Load brand
  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', params.id)
    .single<Brand>();

  if (error || !brand) {
    return (
      <div className="container">
        <h1>Brand not found</h1>
        <p style={{ marginTop: 8 }}>
          <Link href="/admin/brands" className="btn">← Back to brands</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <p style={{ marginBottom: 12 }}>
        <Link href="/admin/brands" className="btn">← Back</Link>
      </p>
      <h1 style={{ marginTop: 0, marginBottom: 12 }}>
        Edit: {brand.brand_name || 'Untitled brand'}
      </h1>
      {/* Client editor with split view */}
      <EditorClient initial={brand} />
    </div>
  );
}
