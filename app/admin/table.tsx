'use client';

import { useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

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

  // certifications
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

export default function AdminTable({ initialRows }: { initialRows: Brand[] }) {
  // initialize from initialRows (component owns its state afterwards)
  const [data, setData] = useState<Brand[]>(initialRows);
  const [filterStatus, setFilterStatus] =
    useState<'all' | NonNullable<Brand['status']>>('all');
  const [showTests, setShowTests] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState('');

  // delete modal
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const supabase = supabaseBrowser();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((r) => {
      if (!showTests && r.is_test) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (!query) return true;
      const hay = `${r.brand_name ?? ''} ${r.country ?? ''} ${r.industry ?? ''} ${
        r.website ?? ''
      } ${r.slug ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [data, filterStatus, showTests, q]);

  function updateLocal(id: string, patch: EditPatch) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function saveRow(row: Brand) {
    setSavingId(row.id);
    setErrorMsg(null);

    // ✅ Explicit, type‑safe clean object (no dynamic index assignment)
    const clean: EditPatch = {
      brand_name: row.brand_name?.trim() ?? null,
      website: row.website?.trim() ?? null,
      contact_email: row.contact_email?.trim() ?? null,
      country: row.country?.trim() ?? null,
      industry: row.industry?.trim() ?? null,
      phone: row.phone?.trim() ?? null,
      slogan: row.slogan?.trim() ?? null,
      description: row.description?.trim() ?? null,
      is_test: row.is_test ?? null,
      status: row.status ?? null,
      gots: row.gots ?? null,
      bcorp: row.bcorp ?? null,
      fair_trade: row.fair_trade ?? null,
      oeko_tex: row.oeko_tex ?? null,
      vegan: row.vegan ?? null,
      climate_neutral: row.climate_neutral ?? null,
    };

    const { error } = await supabase.from('brands').update(clean).eq('id', row.id);
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
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    if (inserted) setData((prev) => [inserted as Brand, ...prev]);
  }

  // Hide/Show (toggle status live <-> draft)
  async function toggleVisibility(row: Brand) {
    const next: Status = row.status === 'live' ? 'draft' : 'live';
    const { error } = await supabase
      .from('brands')
      .update({ status: next })
      .eq('id', row.id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    updateLocal(row.id, { status: next });
  }

  // Delete with type-to-confirm
  function requestDelete(id: string) {
    setConfirmId(id);
    setConfirmText('');
  }
  async function confirmDelete() {
    if (!confirmId) return;
    if (confirmText !== 'DELETE') {
      alert('Please type DELETE to confirm.');
      return;
    }
    const { error } = await supabase.from('brands').delete().eq('id', confirmId);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setData((prev) => prev.filter((r) => r.id !== confirmId));
    setConfirmId(null);
    setConfirmText('');
  }
  function cancelDelete() {
    setConfirmId(null);
    setConfirmText('');
  }

  return (
    <div className="container" style={{ padding: 0 }}>
      {/* Top controls */}
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn" onClick={createNew} disabled={creating}>
          {creating ? 'Creating…' : 'New Brand'}
        </button>

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

        <label className="row" style={{ gap: 8 }}>
          <input
            type="checkbox"
            checked={showTests}
            onChange={(e) => setShowTests(e.target.checked)}
          />
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

      {errorMsg && (
        <div style={{ color: 'var(--danger)', marginBottom: 10 }}>{errorMsg}</div>
      )}

      {/* Responsive, full-width table */}
      <div className="table-wrap" style={{ width: '100%' }}>
        <table className="table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 190 }}>Name</th>
              <th style={{ width: 230 }}>Website</th>
              <th style={{ width: 220 }}>Email</th>
              <th style={{ width: 130 }}>Country</th>
              <th style={{ width: 140 }}>Industry</th>
              <th style={{ width: 140 }}>Phone</th>
              <th style={{ width: 240 }}>Certifications</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 80 }}>Test?</th>
              <th style={{ width: 220 }}>Slogan</th>
              <th /* Description flexes */>Description</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                {/* Name */}
                <td>
                  <input
                    className="input"
                    value={r.brand_name ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { brand_name: e.target.value })
                    }
                  />
                  {r.slug ? (
                    <div className="mono" style={{ fontSize: 11, opacity: 0.7 }}>
                      {r.slug}
                    </div>
                  ) : null}
                </td>

                {/* Website */}
                <td style={{ overflow: 'hidden' }}>
                  <input
                    className="input"
                    value={r.website ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { website: e.target.value })
                    }
                    style={{ width: '100%' }}
                  />
                </td>

                {/* Email */}
                <td style={{ overflow: 'hidden' }}>
                  <input
                    className="input"
                    value={r.contact_email ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { contact_email: e.target.value })
                    }
                    style={{ width: '100%' }}
                  />
                </td>

                {/* Country */}
                <td>
                  <input
                    className="input"
                    value={r.country ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { country: e.target.value })
                    }
                  />
                </td>

                {/* Industry */}
                <td>
                  <input
                    className="input"
                    value={r.industry ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { industry: e.target.value })
                    }
                  />
                </td>

                {/* Phone */}
                <td>
                  <input
                    className="input"
                    value={r.phone ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { phone: e.target.value })
                    }
                  />
                </td>

                {/* Certifications — compact 2‑column grid */}
                <td style={{ verticalAlign: 'top' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px 10px',
                    }}
                  >
                    <label className="row" title="GOTS" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.gots}
                        onChange={(e) =>
                          updateLocal(r.id, { gots: e.target.checked })
                        }
                      />
                      <span>GOTS</span>
                    </label>
                    <label className="row" title="B‑Corp" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.bcorp}
                        onChange={(e) =>
                          updateLocal(r.id, { bcorp: e.target.checked })
                        }
                      />
                      <span>B‑Corp</span>
                    </label>
                    <label className="row" title="Fair Trade" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.fair_trade}
                        onChange={(e) =>
                          updateLocal(r.id, { fair_trade: e.target.checked })
                        }
                      />
                      <span>Fair</span>
                    </label>
                    <label className="row" title="OEKO‑TEX" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.oeko_tex}
                        onChange={(e) =>
                          updateLocal(r.id, { oeko_tex: e.target.checked })
                        }
                      />
                      <span>OEKO‑TEX</span>
                    </label>
                    <label className="row" title="Vegan" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.vegan}
                        onChange={(e) =>
                          updateLocal(r.id, { vegan: e.target.checked })
                        }
                      />
                      <span>Vegan</span>
                    </label>
                    <label className="row" title="Climate neutral" style={{ gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={!!r.climate_neutral}
                        onChange={(e) =>
                          updateLocal(r.id, { climate_neutral: e.target.checked })
                        }
                      />
                      <span>Climate</span>
                    </label>
                  </div>
                </td>

                {/* Status */}
                <td>
                  <select
                    className="select"
                    value={r.status ?? 'draft'}
                    onChange={(e) =>
                      updateLocal(r.id, { status: e.target.value as Status })
                    }
                  >
                    <option value="live">live</option>
                    <option value="demo">demo</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>

                {/* Test? */}
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!r.is_test}
                    onChange={(e) =>
                      updateLocal(r.id, { is_test: e.target.checked })
                    }
                  />
                </td>

                {/* Slogan */}
                <td>
                  <input
                    className="input"
                    value={r.slogan ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { slogan: e.target.value })
                    }
                  />
                </td>

                {/* Description (auto-wraps; no x-scroll) */}
                <td style={{ whiteSpace: 'normal' }}>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={r.description ?? ''}
                    onChange={(e) =>
                      updateLocal(r.id, { description: e.target.value })
                    }
                    style={{ width: '100%' }}
                  />
                </td>

                {/* Actions */}
                <td>
                  <div className="actions" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className="btn"
                      onClick={() => toggleVisibility(r)}
                      title={r.status === 'live' ? 'Hide from public' : 'Show on public'}
                    >
                      {r.status === 'live' ? 'Hide' : 'Show'}
                    </button>

                    <button
                      className="btn btn--primary"
                      disabled={savingId === r.id}
                      onClick={() => saveRow(r)}
                    >
                      {savingId === r.id ? 'Saving…' : 'Save'}
                    </button>

                    <button
                      className="btn btn--danger"
                      onClick={() => requestDelete(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} style={{ padding: 16, color: 'var(--muted)' }}>
                  No rows match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal (type DELETE) */}
      {confirmId && (
        <div
          className="modal-overlay"
          onClick={cancelDelete}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirm deletion</h3>
            <p>
              This action is permanent. To confirm, type <b>DELETE</b> below.
            </p>
            <input
              className="input"
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
            />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className="btn btn--danger right"
                onClick={confirmDelete}
                disabled={confirmText !== 'DELETE'}
                title={confirmText !== 'DELETE' ? 'Type DELETE exactly' : ''}
              >
                Permanently delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
