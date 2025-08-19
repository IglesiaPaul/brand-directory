'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import Link from 'next/link';

type Status = 'live' | 'demo' | 'draft' | 'archived' | null;

type BrandLocal = {
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
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default function EditBrandForm({ initialBrand }: { initialBrand: BrandLocal }) {
  const [b, setB] = useState<BrandLocal>(initialBrand);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const supabase = supabaseBrowser();

  function patch(p: Partial<BrandLocal>) {
    setB(prev => ({ ...prev, ...p }));
  }

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/['"’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function save() {
    setSaving(true);
    setErr(null);

    const clean = {
      brand_name: b.brand_name?.trim() ?? null,
      slug: b.slug?.trim() ?? null,
      website: b.website?.trim() ?? null,
      contact_email: b.contact_email?.trim() ?? null,
      country: b.country?.trim() ?? null,
      industry: b.industry?.trim() ?? null,
      phone: b.phone?.trim() ?? null,
      slogan: b.slogan?.trim() ?? null,
      description: b.description?.trim() ?? null,
      is_test: b.is_test ?? null,
      status: b.status ?? null,
      gots: b.gots ?? null,
      bcorp: b.bcorp ?? null,
      fair_trade: b.fair_trade ?? null,
      oeko_tex: b.oeko_tex ?? null,
      vegan: b.vegan ?? null,
      climate_neutral: b.climate_neutral ?? null,
    };

    const { error } = await supabase.from('brands').update(clean).eq('id', b.id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
  }

  async function toggleVisibility() {
    setToggling(true);
    setErr(null);
    const next: Status = b.status === 'live' ? 'draft' : 'live';
    const { error } = await supabase.from('brands').update({ status: next }).eq('id', b.id);
    setToggling(false);
    if (error) { setErr(error.message); return; }
    patch({ status: next });
  }

  async function destroy() {
    const confirm = prompt('Type DELETE to permanently remove this brand.');
    if (confirm !== 'DELETE') return;
    setDeleting(true);
    const { error } = await supabase.from('brands').delete().eq('id', b.id);
    setDeleting(false);
    if (error) { setErr(error.message); return; }
    window.location.href = '/admin/brands?view=cards';
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      {err && <div style={{ color: 'var(--danger)', marginBottom: 10 }}>{err}</div>}

      {/* Top actions */}
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn" onClick={toggleVisibility} disabled={toggling}>
          {toggling ? 'Working…' : b.status === 'live' ? 'Hide (set draft)' : 'Show (set live)'}
        </button>
        <button className="btn btn--primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button className="btn btn--danger right" onClick={destroy} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* Basic fields */}
      <div className="row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px' }}>
          <label className="label">Brand name</label>
          <input
            className="input"
            value={b.brand_name ?? ''}
            onChange={(e) => patch({ brand_name: e.target.value })}
            placeholder="Brand name"
          />
        </div>

        <div style={{ flex: '1 1 240px' }}>
          <label className="label">Slug</label>
          <div className="row" style={{ gap: 6 }}>
            <input
              className="input"
              value={b.slug ?? ''}
              onChange={(e) => patch({ slug: e.target.value })}
              placeholder="brand-slug"
            />
            <button
              className="btn"
              type="button"
              onClick={() => patch({ slug: slugify(b.brand_name || '') })}
              title="Generate from brand name"
            >
              Generate
            </button>
          </div>
          <div className="mono" style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            Public URL: /brands/{b.slug || '…'}
          </div>
        </div>

        <div style={{ flex: '1 1 280px' }}>
          <label className="label">Website</label>
          <input
            className="input"
            value={b.website ?? ''}
            onChange={(e) => patch({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div style={{ flex: '1 1 280px' }}>
          <label className="label">Contact email</label>
          <input
            className="input"
            value={b.contact_email ?? ''}
            onChange={(e) => patch({ contact_email: e.target.value })}
            placeholder="you@company.com"
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label className="label">Country</label>
          <input
            className="input"
            value={b.country ?? ''}
            onChange={(e) => patch({ country: e.target.value })}
            placeholder="Country"
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label className="label">Industry</label>
          <input
            className="input"
            value={b.industry ?? ''}
            onChange={(e) => patch({ industry: e.target.value })}
            placeholder="Industry"
          />
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label className="label">Phone</label>
          <input
            className="input"
            value={b.phone ?? ''}
            onChange={(e) => patch({ phone: e.target.value })}
            placeholder="+33…"
          />
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <label className="label">Slogan</label>
          <input
            className="input"
            value={b.slogan ?? ''}
            onChange={(e) => patch({ slogan: e.target.value })}
            placeholder="Short tagline"
          />
        </div>

        <div style={{ flex: '1 1 100%' }}>
          <label className="label">Description</label>
          <textarea
            className="textarea"
            rows={5}
            value={b.description ?? ''}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="Longer description…"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Status + test */}
      <div className="row" style={{ marginTop: 12 }}>
        <label className="row" style={{ gap: 6 }}>
          <span className="label">Status</span>
          <select
            className="select"
            value={b.status ?? 'draft'}
            onChange={(e) => patch({ status: e.target.value as Status })}
          >
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <label className="row" style={{ gap: 8 }}>
          <input
            type="checkbox"
            checked={!!b.is_test}
            onChange={(e) => patch({ is_test: e.target.checked })}
          />
          <span className="label">Test row</span>
        </label>
      </div>

      {/* Certifications (2‑column compact grid) */}
      <div style={{ marginTop: 16 }}>
        <div className="label" style={{ marginBottom: 6 }}>Certifications</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.gots} onChange={(e) => patch({ gots: e.target.checked })} />
            <span>GOTS</span>
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.bcorp} onChange={(e) => patch({ bcorp: e.target.checked })} />
            <span>B‑Corp</span>
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.fair_trade} onChange={(e) => patch({ fair_trade: e.target.checked })} />
            <span>Fair Trade</span>
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.oeko_tex} onChange={(e) => patch({ oeko_tex: e.target.checked })} />
            <span>OEKO‑TEX</span>
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.vegan} onChange={(e) => patch({ vegan: e.target.checked })} />
            <span>Vegan</span>
          </label>
          <label className="row" style={{ gap: 6 }}>
            <input type="checkbox" checked={!!b.climate_neutral} onChange={(e) => patch({ climate_neutral: e.target.checked })} />
            <span>Climate neutral</span>
          </label>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="row" style={{ marginTop: 16 }}>
        <Link href="/admin/brands?view=cards" className="btn">Cancel</Link>
        <button className="btn btn--primary right" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
