// app/admin/brands/[id]/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';
import EditBrandForm from './EditBrandForm';
import type { Brand } from '../types'; // keep if you already have this file

export default async function AdminBrandEditPage({
  params,
}: {
  params: { id: string };
}) {
  // 1) Auth + allowlist (same as other admin pages)
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const ALLOWLIST = ['me@pauliglesia.com'];
  if (!ALLOWLIST.includes(user.email ?? '')) {
    redirect('/login?error=not_allowed');
  }

  // 2) Load this brand
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

  // 3) Render the client edit form
  return (
    <main className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <Link href="/admin/brands" className="btn">← Back</Link>
        <h1 style={{ margin: 0, marginLeft: 8, fontSize: 20, fontWeight: 700 }}>
          Edit: {brand.brand_name || 'Untitled brand'}
        </h1>
      </div>

      <EditBrandForm initialBrand={brand} />
    </main>
  );
}
