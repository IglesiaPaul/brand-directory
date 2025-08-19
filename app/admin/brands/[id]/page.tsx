// app/admin/brands/[id]/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';
import type { Brand } from '../types';

export default async function AdminBrandEditPage({
  params,
}: {
  params: { id: string };
}) {
  // 1) Auth + allowlist (same checks as /admin and /admin/brands)
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const ALLOWLIST = ['me@pauliglesia.com'];
  if (ALLOWLIST.length && !ALLOWLIST.includes(user.email ?? '')) {
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

  // 3) Dummy UI for now (we’ll build the real editor next)
  return (
    <div className="container">
      <p style={{ marginBottom: 12 }}>
        <Link href="/admin/brands" className="btn">← Back</Link>
      </p>

      <h1 style={{ marginTop: 0 }}>
        Edit: {brand.brand_name || 'Untitled brand'}
      </h1>

      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--panel)',
        padding: 16,
        marginTop: 12
      }}>
        <p style={{ color: 'var(--muted)' }}>
          This is a placeholder. We’ll add the full editable form (name, slug,
          country, industry, certifications, visibility, etc.) in this page next.
        </p>
        <div style={{ fontSize: 13, marginTop: 6 }}>
          <div><b>ID:</b> <code className="mono">{brand.id}</code></div>
          {brand.slug ? <div><b>Slug:</b> <code className="mono">{brand.slug}</code></div> : null}
          {brand.status ? <div><b>Status:</b> {brand.status}</div> : null}
        </div>
      </div>
    </div>
  );
}
