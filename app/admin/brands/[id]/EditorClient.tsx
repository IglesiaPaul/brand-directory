'use client';

import { useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

/* Keep a local Brand type to avoid path issues */
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

type EditPatch = Partial<
  Pick<
    Brand,
    | 'slug'
    | 'brand_name'
    | 'website'
    | 'contact_email'
    | 'country'
    | 'industry'
    | 'phone'
    | 'slogan'
    | 'description'
    | 'is_test'
    | 'status'
    | 'gots'
    | 'bcorp'
    | 'fair_trade'
    | 'oeko_tex'
    | 'vegan'
    | 'climate_neutral'
  >
>;

export default function EditorClient({ initial }: { initial: Brand }) {
  const [form, setForm] = useState<Brand>(initial);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = supabaseBrowser();

  function patch(p: EditPatch) {
    setForm((prev) => ({ ...prev, ...p }));
  }

  async function save() {
    setSaving(true);
    setErrorMsg(null);

    // sanitize
    const clean: EditPatch = {
      slug: form.slug?.trim() || null,
      brand_name: form.brand_name?.trim() || null,
      website: form.website?.trim() || null,
      contact_email: form.contact_email?.trim() || null,
      country: form.country?.trim() || null,
      industry: form.industry?.trim() || null,
      phone: form.phone?.trim() || null,
      slogan: form.slogan?.trim() || null,
      description: form.description?.trim() || null,
      is_test: form.is_test ?? null,
      status: form.status ?? null,
      gots: form.gots ?? null,
      bcorp: form.bcorp ?? null,
      fair_trade: form.fair_trade ?? null,
      oeko_tex: form.oeko_tex ?? null,
      vegan: form.vegan ?? null,
      climate_neutral: form.climate_neutral ?? null,
    };

    const { error } = await supabase.from('brands').update(clean).eq('id', form.id);
    setSaving(false);
    if (error) setErrorMsg(error.message);
  }

  async function toggleVisibility() {
    const next: Status = form.status === 'live' ? 'draft' : 'live';
    const { error } = await supabase.from('brands').update({ status: next }).eq('id', form.id);
    if (error) { setErrorMsg(error.message); return; }
    patch({ status: next });
  }

  // Layout: split editor (left) + preview (right)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}
    >
      {/* LEFT: FORM */}
      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--panel)',
          padding: 16,
        }}
      >
        <div className="row" style={{ marginBottom: 12 }}>
          <button className="btn" onClick={toggleVisibility}>
            {form.status === 'live' ? 'Hide (make draft)' : 'Show (make live)'}
          </button>
          <button
            className="btn btn--primary right"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {errorMsg && (
          <div style={{ color: 'var(--danger)', marginBottom: 10 }}>{errorMsg}</div>
        )}

        <div className="row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <label className="label">Brand name</label>
            <input
              className="input"
              value={form.brand_name ?? ''}
              onChange={(e) => patch({ brand_name: e.target.value })}
              placeholder="Hemp Co."
            />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label className="label">Slug</label>
            <input
              className="input"
              value={form.slug ?? ''}
              onChange={(e) => patch({ slug: e.target.value })}
              placeholder="hemp-co"
            />
          </div>

          <div style={{ flex: '1 1 240px' }}>
            <label className="label">Status</label>
            <select
              className="select"
              value={form.status ?? 'draft'}
              onChange={(e) => patch({ status: e.target.value as Status })}
            >
              <option value="live">live</option>
              <option value="demo">demo</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div style={{ flex: '1 1 140px' }}>
            <label className="label">Test row?</label>
            <div className="row">
              <input
                type="checkbox"
                checked={!!form.is_test}
                onChange={(e) => patch({ is_test: e.target.checked })}
              />
              <span>is_test</span>
            </div>
          </div>

          <div style={{ flex: '1 1 320px' }}>
            <label className="label">Website</label>
            <input
              className="input"
              value={form.website ?? ''}
              onChange={(e) => patch({ website: e.target.value })}
              placeholder="https://…"
            />
          </div>

          <div style={{ flex: '1 1 260px' }}>
            <label className="label">Email</label>
            <input
              className="input"
              value={form.contact_email ?? ''}
              onChange={(e) => patch({ contact_email: e.target.value })}
              placeholder="hello@example.com"
            />
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <label className="label">Country</label>
            <input
              className="input"
              value={form.country ?? ''}
              onChange={(e) => patch({ country: e.target.value })}
              placeholder="France"
            />
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <label className="label">Industry</label>
            <input
              className="input"
              value={form.industry ?? ''}
              onChange={(e) => patch({ industry: e.target.value })}
              placeholder="Fashion"
            />
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <label className="label">Phone</label>
            <input
              className="input"
              value={form.phone ?? ''}
              onChange={(e) => patch({ phone: e.target.value })}
              placeholder="+33 …"
            />
          </div>

          <div style={{ flex: '1 1 100%' }}>
            <label className="label">Slogan</label>
            <input
              className="input"
              value={form.slogan ?? ''}
              onChange={(e) => patch({ slogan: e.target.value })}
              placeholder="A short catchphrase…"
            />
          </div>

          <div style={{ flex: '1 1 100%' }}>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              rows={5}
              value={form.description ?? ''}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Tell us about the brand, materials, ethos…"
            />
          </div>
        </div>

        {/* Certifications */}
        <div style={{ marginTop: 14 }}>
          <div className="label" style={{ marginBottom: 6 }}>Certifications</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 10px',
              maxWidth: 520,
            }}
          >
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.gots}
                onChange={(e) => patch({ gots: e.target.checked })}
              />
              <span>GOTS</span>
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.bcorp}
                onChange={(e) => patch({ bcorp: e.target.checked })}
              />
              <span>B‑Corp</span>
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.fair_trade}
                onChange={(e) => patch({ fair_trade: e.target.checked })}
              />
              <span>Fair Trade</span>
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.oeko_tex}
                onChange={(e) => patch({ oeko_tex: e.target.checked })}
              />
              <span>OEKO‑TEX</span>
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.vegan}
                onChange={(e) => patch({ vegan: e.target.checked })}
              />
              <span>Vegan</span>
            </label>
            <label className="row" style={{ gap: 6 }}>
              <input
                type="checkbox"
                checked={!!form.climate_neutral}
                onChange={(e) => patch({ climate_neutral: e.target.checked })}
              />
              <span>Climate neutral</span>
            </label>
          </div>
        </div>
      </section>

      {/* RIGHT: LIVE PREVIEW */}
      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--panel)',
          padding: 16,
          minHeight: 200,
        }}
      >
        <div style={{ marginBottom: 8, color: 'var(--muted)', fontSize: 13 }}>
          Live preview (public card style)
        </div>
        <BrandPreview brand={form} />
      </section>
    </div>
  );
}

/* ----------------------- Preview UI ----------------------- */

function BrandPreview({ brand }: { brand: Brand }) {
  const flag = countryToFlag(brand.country);
  return (
    <article className="card" style={{ maxWidth: 620 }}>
      <h3 style={{ marginBottom: 4 }}>
        {/* Link target is informational only here */}
        <a
          href={brand.slug ? `/brands/${brand.slug}` : '#'}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onClick={(e) => e.preventDefault()}
        >
          {brand.brand_name || 'Untitled brand'}
        </a>
      </h3>

      <div className="meta">
        {brand.industry && <span className={industryBadgeClass(brand.industry)}>{brand.industry}</span>}
        {brand.country && <span className="badge">{flag ? `${flag} ${brand.country}` : brand.country}</span>}
        {brand.status && <span className={`badge badge--${capitalize(brand.status)}`}>{brand.status}</span>}
      </div>

      {brand.slogan && <p style={{ marginTop: 6 }}>{brand.slogan}</p>}

      <div className="details">
        {brand.description && <p>{brand.description}</p>}

        <div className="icon-row" style={{ marginTop: 6 }}>
          {brand.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
          {brand.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
          {brand.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
          {brand.oeko_tex && <span className="icon icon--info" title="OEKO‑TEX">✅</span>}
          {brand.vegan && <span className="icon icon--warn" title="Vegan">🌱</span>}
          {brand.climate_neutral && <span className="icon icon--info" title="Climate neutral">🌍</span>}
          {!brand.gots && !brand.bcorp && !brand.fair_trade && !brand.oeko_tex && !brand.vegan && !brand.climate_neutral && (
            <span style={{ color: 'var(--muted)' }}>— no certifications selected —</span>
          )}
        </div>

        {brand.website && (
          <div style={{ marginTop: 8 }}>
            <a
              href={brand.website}
              target="_blank"
              rel="noreferrer"
              className="mono"
              onClick={(e) => e.preventDefault()}
              title="Preview only"
            >
              {brand.website}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

/* --- Helpers --- */

// Map common country names to flag emoji
function countryToFlag(country?: string | null) {
  if (!country) return '';
  const map: Record<string, string> = {
    "United States of America": "US",
    "United States": "US",
    "USA": "US",
    "United Kingdom": "GB",
    "UK": "GB",
    "Great Britain": "GB",
    "South Korea": "KR",
    "Korea": "KR",
    "Czech Republic": "CZ",
    "Ivory Coast": "CI",
    "Côte d'Ivoire": "CI",
    "UAE": "AE",
    "United Arab Emirates": "AE"
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
  if (key.includes('fashion'))     return 'badge badge--Fashion';
  if (key.includes('material'))    return 'badge badge--Materials';
  if (key.includes('accessor'))    return 'badge badge--Accessories';
  if (key.includes('footwear')|| key.includes('shoes')) return 'badge badge--Footwear';
  if (key.includes('home'))        return 'badge badge--Home';
  return 'badge badge--Other';
}
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
