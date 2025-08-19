// app/admin/brands/CardView.tsx
'use client';

import Link from 'next/link';
import type { Brand } from './types';

export default function CardView({ rows }: { rows: Brand[] }) {
  if (!rows || rows.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>No brands yet.</p>;
  }

  return (
    <div style={{
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
    }}>
      {rows.map((b) => (
        <div
          key={b.id}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'var(--panel)',
            padding: 14
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>{b.brand_name || 'Untitled brand'}</h3>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
            {b.country || '—'} • {b.industry || '—'}
          </div>

          {b.slogan && (
            <p style={{ marginTop: 8, color: 'var(--muted)' }}>{b.slogan}</p>
          )}

          {/* Actions (dummy for now; Edit goes to future page) */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Link href={`/admin/brands/${b.id}`}>
              <button className="btn btn--primary">Edit</button>
            </Link>
            <button className="btn" disabled title="Use Table view for now">
              Hide/Show
            </button>
            <button className="btn btn--danger" disabled title="Use Table view for now">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
