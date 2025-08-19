'use client';

import { useState } from 'react';

/**
 * Lightweight client component so the page compiles.
 * It shows a few editable fields locally (no save yet).
 * We’ll wire up Supabase actions after this builds cleanly.
 */
export default function EditorClient({ brand }: { brand: any }) {
  const [form, setForm] = useState(() => ({
    brand_name: brand?.brand_name ?? '',
    slug: brand?.slug ?? '',
    country: brand?.country ?? '',
    industry: brand?.industry ?? '',
    status: brand?.status ?? 'draft',
    slogan: brand?.slogan ?? '',
    description: brand?.description ?? '',
    website: brand?.website ?? '',
    contact_email: brand?.contact_email ?? '',
  }));

  function set<K extends keyof typeof form>(key: K, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 12,
        background: 'var(--panel)',
        padding: 16,
        marginTop: 12,
      }}
    >
      <div className="row" style={{ gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', minWidth: 260 }}>
          <label className="label">Brand name</label>
          <input
            className="input"
            value={form.brand_name}
            onChange={(e) => set('brand_name', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 220 }}>
          <label className="label">Slug</label>
          <input
            className="input"
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 160px', minWidth: 160 }}>
          <label className="label">Status</label>
          <select
            className="select"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </div>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 220 }}>
          <label className="label">Country</label>
          <input
            className="input"
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 220 }}>
          <label className="label">Industry</label>
          <input
            className="input"
            value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="label">Slogan</label>
        <input
          className="input"
          value={form.slogan}
          onChange={(e) => set('slogan', e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="label">Description</label>
        <textarea
          className="textarea"
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="row" style={{ gap: 12, marginTop: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', minWidth: 260 }}>
          <label className="label">Website</label>
          <input
            className="input"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 260 }}>
          <label className="label">Contact email</label>
          <input
            className="input"
            value={form.contact_email}
            onChange={(e) => set('contact_email', e.target.value)}
          />
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn" disabled title="Coming soon">
          Save (coming soon)
        </button>
      </div>
    </div>
  );
}
