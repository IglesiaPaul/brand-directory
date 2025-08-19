'use client';

import { useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Brand = {
  id: string;
  brand_name: string | null;
  website: string | null;
  contact_email: string | null;
  country: string | null;
  industry: string | null;
  phone: string | null;
  slogan: string | null;
  description: string | null;
  is_test?: boolean | null;
  status?: 'live' | 'demo' | 'draft' | 'archived' | null;
  created_at?: string | null;

  // NEW: certifications
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default function AdminTable({ rows }: { rows: Brand[] }) {
  const [data, setData] = useState<Brand[]>(rows);
  const [filterStatus, setFilterStatus] = useState<'all' | NonNullable<Brand['status']>>('all');
  const [showTests, setShowTests] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const supabase = supabaseBrowser();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((r) => {
      if (!showTests && r.is_test) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (!query) return true;
      const hay = `${r.brand_name ?? ''} ${r.country ?? ''} ${r.industry ?? ''} ${r.website ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [data, filterStatus, showTests, q]);

  function update(id: string, field: keyof Brand, value: any) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function save(row: Brand) {
    setSavingId(row.id);
    setErrorMsg(null);
    const { id, ...cols } = row;

    const cleanCols: any = {};
    for (const [k, v] of Object.entries(cols)) {
      cleanCols[k] = typeof v === 'string' ? v.trim() : v;
    }

    const { error } = await supabase.from('brands').update(cleanCols).eq('id', id);
    setSavingId(null);
    if (error) setErrorMsg(error.message);
  }

  async function createNew() {
    setCreating(true);
    setErrorMsg(null);
    const { data: inserted, error } = await supabase
      .from('brands')
      .insert([{ brand_name: 'New Brand', status: 'draft', is_test: true }])
      .select('*')
      .single();

    setCreating(false);
    if (error) { setErrorMsg(error.message); return; }
    if (inserted) setData((prev) => [inserted as Brand, ...prev]);
  }

  async function remove(id: string) {
    if (!confirm('Delete this brand? This cannot be undone.')) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) { setErrorMsg(error.message); return; }
    setData((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="container">
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn" onClick={createNew} disabled={creating}>
          {creating ? 'Creating…' : 'New Brand'}
        </button>

        <label className="row">
          <span>Status:</span>
          <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="all">All</option>
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <label className="row">
          <input type="checkbox" checked={showTests} onChange={(e) => setShowTests(e.target.checked)} />
          <span>Show test rows</span>
        </label>

        <input
          className="input right"
          placeholder="Search name, country, industry…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ minWidth: 240 }}
        />
      </div>

      {errorMsg && <div style={{ color: 'var(--danger)', marginBottom: 10 }}>{errorMsg}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ minWidth: 240 }}>Website</th>
              <th style={{ minWidth: 220 }}>Email</th>
              <th>Country</th>
              <th>Industry</th>
              <th>Phone</th>
              <th>Certifications</th> {/* NEW */}
              <th>Status</th>
              <th>Test?</th>
              <th style={{ minWidth: 220 }}>Slogan</th>
              <th style={{ minWidth: 300 }}>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td><input className="input" value={r.brand_name ?? ''} onChange={(e) => update(r.id, 'brand_name', e.target.value)} /></td>
                <td><input className="input" value={r.website ?? ''} onChange={(e) => update(r.id, 'website', e.target.value)} /></td>
                <td><input className="input" value={r.contact_email ?? ''} onChange={(e) => update(r.id, 'contact_email', e.target.value)} /></td>
                <td><input className="input" value={r.country ?? ''} onChange={(e) => update(r.id, 'country', e.target.value)} /></td>
                <td><input className="input" value={r.industry ?? ''} onChange={(e) => update(r.id, 'industry', e.target.value)} /></td>
                <td><input className="input" value={r.phone ?? ''} onChange={(e) => update(r.id, 'phone', e.target.value)} /></td>

                {/* NEW: Certifications block */}
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <label className="row" title="GOTS">
                      <input type="checkbox" checked={!!r.gots} onChange={(e) => update(r.id, 'gots', e.target.checked)} />
                      <span>GOTS</span>
                    </label>
                    <label className="row" title="B‑Corp">
                      <input type="checkbox" checked={!!r.bcorp} onChange={(e) => update(r.id, 'bcorp', e.target.checked)} />
                      <span>B‑Corp</span>
                    </label>
                    <label className="row" title="Fair Trade">
                      <input type="checkbox" checked={!!r.fair_trade} onChange={(e) => update(r.id, 'fair_trade', e.target.checked)} />
                      <span>Fair</span>
                    </label>
                    <label className="row" title="OEKO‑TEX">
                      <input type="checkbox" checked={!!r.oeko_tex} onChange={(e) => update(r.id, 'oeko_tex', e.target.checked)} />
                      <span>OEKO‑TEX</span>
                    </label>
                    <label className="row" title="Vegan">
                      <input type="checkbox" checked={!!r.vegan} onChange={(e) => update(r.id, 'vegan', e.target.checked)} />
                      <span>Vegan</span>
                    </label>
                    <label className="row" title="Climate neutral">
                      <input type="checkbox" checked={!!r.climate_neutral} onChange={(e) => update(r.id, 'climate_neutral', e.target.checked)} />
                      <span>Climate</span>
                    </label>
                  </div>
                </td>

                <td>
                  <select className="select" value={r.status ?? 'draft'} onChange={(e) => update(r.id, 'status', e.target.value as any)}>
                    <option value="live">live</option>
                    <option value="demo">demo</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!r.is_test} onChange={(e) => update(r.id, 'is_test', e.target.checked)} />
                </td>
                <td><input className="input" value={r.slogan ?? ''} onChange={(e) => update(r.id, 'slogan', e.target.value)} /></td>
                <td><textarea className="textarea" rows={3} value={r.description ?? ''} onChange={(e) => update(r.id, 'description', e.target.value)} /></td>
                <td>
                  <div className="actions">
                    <button className="btn btn--primary" disabled={savingId === r.id} onClick={() => save(r)}>
                      {savingId === r.id ? 'Saving…' : 'Save'}
                    </button>
                    <button className="btn btn--danger" onClick={() => remove(r.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={12} style={{ padding: 16, color: 'var(--muted)' }}>No rows match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
