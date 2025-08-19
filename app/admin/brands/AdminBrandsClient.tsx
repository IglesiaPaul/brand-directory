'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import AdminTable from '@/app/admin/table'; // re-use your existing table
import type { Brand, Status } from './page';

function StatusBadge({ status }: { status: Status }) {
  if (!status) return null;
  const cls =
    status === 'live' ? 'badge badge--live' :
    status === 'demo' ? 'badge badge--demo' :
    status === 'draft' ? 'badge badge--draft' :
    'badge badge--archived';
  return <span className={cls}>{status}</span>;
}

function MiniCerts({ b }: { b: Brand }) {
  // Tiny icon row, only show the ones that are true
  return (
    <div className="icon-row" style={{ marginTop: 6 }}>
      {b.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
      {b.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
      {b.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
      {b.oeko_tex && <span className="icon icon--info" title="OEKO‑TEX">✅</span>}
      {b.vegan && <span className="icon icon--warn" title="Vegan">🌱</span>}
      {b.climate_neutral && <span className="icon icon--info" title="Climate neutral">🌍</span>}
    </div>
  );
}

function CardsView({ rows }: { rows: Brand[] }) {
  return (
    <div className="grid">
      {rows.map((b) => (
        <article key={b.id} className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ marginBottom: 0 }}>{b.brand_name || 'Untitled brand'}</h3>
            <StatusBadge status={b.status ?? null} />
          </div>

          <div className="meta" style={{ marginTop: 6 }}>
            {b.industry && <span className="badge">{b.industry}</span>}
            {b.country && <span className="badge">{b.country}</span>}
            {b.is_test ? <span className="badge">test</span> : null}
          </div>

          {b.slogan && <p style={{ marginTop: 6 }}>{b.slogan}</p>}
          <MiniCerts b={b} />

          <div className="row" style={{ marginTop: 10 }}>
            <Link href={`/admin/brands/${b.id}`} className="btn btn--primary">Edit</Link>
            {b.website && (
              <a className="btn right" href={b.website} target="_blank" rel="noreferrer">
                Visit
              </a>
            )}
          </div>
        </article>
      ))}

      {rows.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No brands match your filters.</p>
      )}
    </div>
  );
}

export default function AdminBrandsClient({ initialRows }: { initialRows: Brand[] }) {
  const [rows, setRows] = useState<Brand[]>(initialRows);
  const [view, setView] = useState<'cards' | 'table'>('cards');

  // unified header controls
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | NonNullable<Brand['status']>>('all');
  const [showTests, setShowTests] = useState(true);

  const supabase = supabaseBrowser();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (!showTests && r.is_test) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (!query) return true;
      const hay = `${r.brand_name ?? ''} ${r.country ?? ''} ${r.industry ?? ''} ${r.website ?? ''} ${r.slug ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, filterStatus, showTests]);

  async function createNew() {
    const { data: inserted, error } = await supabase
      .from('brands')
      .insert([{ brand_name: 'New Brand', status: 'draft', is_test: true }])
      .select('*')
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    if (inserted) setRows((prev) => [inserted as Brand, ...prev]);
  }

  // A key so the table remounts when the filtered set changes (keeps AdminTable happy)
  const tableKey = useMemo(
    () => filtered.map((r) => r.id).join('_'),
    [filtered]
  );

  return (
    <div className="container">
      {/* Unified header bar */}
      <div
        className="row"
        style={{
          gap: 10,
          padding: 12,
          marginBottom: 14,
          border: '1px solid var(--border)',
          borderRadius: 12,
          background: 'var(--panel)'
        }}
      >
        {/* View toggle */}
        <div className="row" style={{ gap: 6 }}>
          <button
            className="btn"
            onClick={() => setView('cards')}
            aria-pressed={view === 'cards'}
            title="Card view"
          >
            🗂 Cards
          </button>
          <button
            className="btn"
            onClick={() => setView('table')}
            aria-pressed={view === 'table'}
            title="Table view"
          >
            📋 Table
          </button>
        </div>

        {/* New brand */}
        <button className="btn btn--primary" onClick={createNew}>
          + New Brand
        </button>

        {/* Search */}
        <input
          className="input"
          placeholder="Search brand, country, industry, slug…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 260 }}
        />

        {/* Status filter */}
        <label className="row" style={{ gap: 6 }}>
          <span>Status:</span>
          <select
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </label>

        {/* Show test rows */}
        <label className="row" style={{ gap: 8 }}>
          <input
            type="checkbox"
            checked={showTests}
            onChange={(e) => setShowTests(e.target.checked)}
          />
          <span>Show test rows</span>
        </label>
      </div>

      {/* Body */}
      {view === 'cards' ? (
        <CardsView rows={filtered} />
      ) : (
        // Reuse existing AdminTable (it owns its own edit/save logic)
        <AdminTable key={tableKey} initialRows={filtered} />
      )}
    </div>
  );
}
