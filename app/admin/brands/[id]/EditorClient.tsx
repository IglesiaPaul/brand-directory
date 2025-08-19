'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import type { Brand } from './page';

type Status = NonNullable<Brand['status']>;

export default function EditorClient({ initial }: { initial: Brand }) {
  // working copy
  const [b, setB] = useState<Brand>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const supabase = supabaseBrowser();

  function patch(p: Partial<Brand>) {
    setB((prev) => ({ ...prev, ...p }));
  }

  async function save() {
    setSaving(true); setMsg(null);
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
    setMsg(error ? `Error: ${error.message}` : 'Saved ✓');
    if (!error) {
      // update initial too (if user navigates away/back, things feel synced)
      // not strictly necessary, but nice
    }
  }

  async function toggleVisibility() {
    const next: Status = b.status === 'live' ? 'draft' : 'live';
    const { error } = await supabase.from('brands').update({ status: next }).eq('id', b.id);
    if (error) { setMsg(`Error: ${error.message}`); return; }
    patch({ status: next });
    setMsg(next === 'live' ? 'Brand is now public' : 'Brand hidden from public');
  }

  const statusBadge = useMemo(() => {
    const s = b.status ?? 'draft';
    const cls =
      s === 'live' ? 'badge badge--live' :
      s === 'demo' ? 'badge badge--demo' :
      s === 'draft' ? 'badge badge--draft' : 'badge badge--archived';
    return <span className={cls} style={{ verticalAlign: 'middle' }}>{s}</span>;
  }, [b.status]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 540px) 1fr',
        gap: 16,
        alignItems: 'start',
      }}
    >
      {/* LEFT: Editor form */}
      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--panel)',
          padding: 16,
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="row" style={{ gap: 8 }}>
            {statusBadge}
            {b.is_test ? <span className="badge">test</span> : null}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={toggleVisibility}>
              {b.status === 'live' ? 'Hide' : 'Show'}
            </button>
            <button className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {msg && (
          <div style={{ marginBottom: 10, color: msg.startsWith('Error') ? 'var(--danger)' : 'var(--accent-2)' }}>
            {msg}
          </div>
        )}

        <div className="row" style={{ gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Name</label>
            <input className="input" value={b.brand_name ?? ''} onChange={(e) => patch({ brand_name: e.target.value })} />
          </div>
          <div style={{ width: 220 }}>
            <label className="label">Slug</label>
            <input className="input" value={b.slug ?? ''} onChange={(e) => patch({ slug: e.target.value })} />
          </div>
        </div>

        <div className="row" style={{ gap: 12, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Website</label>
            <input className="input" value={b.website ?? ''} onChange={(e) => patch({ website: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Email</label>
            <input className="input" value={b.contact_email ?? ''} onChange={(e) => patch({ contact_email: e.target.value })} />
          </div>
        </div>

        <div className="row" style={{ gap: 12, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Country</label>
            <input className="input" value={b.country ?? ''} onChange={(e) => patch({ country: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Industry</label>
            <input className="input" value={b.industry ?? ''} onChange={(e) => patch({ industry: e.target.value })} />
          </div>
          <div style={{ width: 160 }}>
            <label className="label">Phone</label>
            <input className="input" value={b.phone ?? ''} onChange={(e) => patch({ phone: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="label">Slogan</label>
          <input className="input" value={b.slogan ?? ''} onChange={(e) => patch({ slogan: e.target.value })} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="label">Description</label>
          <textarea
            className="textarea"
            rows={6}
            value={b.description ?? ''}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </div>

        {/* Certifications */}
        <div style={{ marginTop: 12 }}>
          <label className="label">Certifications</label>
          <div className="cert-grid" style={{ marginTop: 6 }}>
            <label><input type="checkbox" checked={!!b.gots} onChange={(e) => patch({ gots: e.target.checked })}/> GOTS</label>
            <label><input type="checkbox" checked={!!b.bcorp} onChange={(e) => patch({ bcorp: e.target.checked })}/> B‑Corp</label>
            <label><input type="checkbox" checked={!!b.fair_trade} onChange={(e) => patch({ fair_trade: e.target.checked })}/> Fair Trade</label>
            <label><input type="checkbox" checked={!!b.oeko_tex} onChange={(e) => patch({ oeko_tex: e.target.checked })}/> OEKO‑TEX</label>
            <label><input type="checkbox" checked={!!b.vegan} onChange={(e) => patch({ vegan: e.target.checked })}/> Vegan</label>
            <label><input type="checkbox" checked={!!b.climate_neutral} onChange={(e) => patch({ climate_neutral: e.target.checked })}/> Climate neutral</label>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <label className="row" style={{ gap: 8 }}>
            <input
              type="checkbox"
              checked={!!b.is_test}
              onChange={(e) => patch({ is_test: e.target.checked })}
            />
            <span>Mark as test row</span>
          </label>

          <select
            className="select right"
            value={b.status ?? 'draft'}
            onChange={(e) => patch({ status: e.target.value as Status })}
          >
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </div>
      </section>

      {/* RIGHT: Live preview */}
      <PreviewPanel b={b} />
    </div>
  );
}

/* ----------------------- Preview Panel ----------------------- */

function countryToFlag(country?: string | null) {
  if (!country) return '';
  const map: Record<string, string> = {
    "United States of America": "US", "United States": "US", "USA": "US",
    "United Kingdom": "GB", "UK": "GB", "Great Britain": "GB",
    "South Korea": "KR", "Korea": "KR",
    "Czech Republic": "CZ",
    "Ivory Coast": "CI", "Côte d'Ivoire": "CI",
    "UAE": "AE", "United Arab Emirates": "AE"
  };
  const name = country.trim();
  const iso = (map[name] || name).toUpperCase();
  if (/^[A-Z]{2}$/.test(iso)) {
    const cps = iso.split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...cps);
  }
  return country;
}

function industryBadgeClass(industry?: string | null) {
  const key = (industry || 'Other').toLowerCase();
  if (key.includes('fashion')) return 'badge badge--Fashion';
  if (key.includes('material')) return 'badge badge--Materials';
  if (key.includes('accessor')) return 'badge badge--Accessories';
  if (key.includes('footwear') || key.includes('shoes')) return 'badge badge--Footwear';
  if (key.includes('home')) return 'badge badge--Home';
  return 'badge badge--Other';
}

function PreviewPanel({ b }: { b: Brand }) {
  const flag = countryToFlag(b.country);
  return (
    <section
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--panel)',
        padding: 16,
        minHeight: 400,
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{b.brand_name || 'Brand name'}</h2>
        {b.status ? (
          <span className={
            b.status === 'live' ? 'badge badge--live' :
            b.status === 'demo' ? 'badge badge--demo' :
            b.status === 'draft' ? 'badge badge--draft' : 'badge badge--archived'
          }>
            {b.status}
          </span>
        ) : null}
      </div>

      <div className="row" style={{ margin: '8px 0 12px' }}>
        {b.industry && <span className={industryBadgeClass(b.industry)}>{b.industry}</span>}
        {b.country && <span className="badge">{flag ? `${flag} ${b.country}` : b.country}</span>}
        {b.is_test ? <span className="badge">test</span> : null}
      </div>

      {b.slogan && <p style={{ fontSize: 16, marginTop: 0 }}>{b.slogan}</p>}
      {b.description && <p style={{ marginTop: 8 }}>{b.description}</p>}

      <section style={{ marginTop: 12 }}>
        <h3 style={{ marginBottom: 6 }}>Certifications</h3>
        <div className="icon-row">
          {b.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
          {b.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
          {b.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
          {b.oeko_tex && <span className="icon icon--info" title="OEKO‑TEX">✅</span>}
          {b.vegan && <span className="icon icon--warn" title="Vegan">🌱</span>}
          {b.climate_neutral && <span className="icon icon--info" title="Climate neutral">🌍</span>}
          {!b.gots && !b.bcorp && !b.fair_trade && !b.oeko_tex && !b.vegan && !b.climate_neutral && (
            <span style={{ color: 'var(--muted)' }}>— none yet —</span>
          )}
        </div>
      </section>

      {b.website && (
        <section style={{ marginTop: 12 }}>
          <h3 style={{ marginBottom: 6 }}>Website</h3>
          <a className="mono" href={b.website} target="_blank" rel="noreferrer">
            {b.website}
          </a>
        </section>
      )}

      <div style={{ marginTop: 14, opacity: .7, fontSize: 12 }}>
        Preview mimics the public brand page. We’ll refine styles to match /brands/[slug].
      </div>
    </section>
  );
}
