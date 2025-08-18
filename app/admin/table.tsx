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
  bio?: string | null;
  is_test?: boolean | null;
  status?: 'live' | 'demo' | 'draft' | 'archived' | null;
  created_at?: string | null;
};

export default function AdminTable({ rows }: { rows: Brand[] }) {
  const [data, setData] = useState<Brand[]>(rows);
  const [filterStatus, setFilterStatus] = useState<'all' | NonNullable<Brand['status']>>('all');
  const [showTests, setShowTests] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = supabaseBrowser();

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (!showTests && r.is_test) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    });
  }, [data, filterStatus, showTests]);

  function update(id: string, field: keyof Brand, value: any) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function save(row: Brand) {
    setSavingId(row.id);
    setErrorMsg(null);
    const { id, ...cols } = row;

    // basic normalization: trim strings
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
      .insert([
        {
          brand_name: 'New Brand',
          status: 'draft',
          is_test: true,
        },
      ])
      .select('*')
      .single();

    setCreating(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    if (inserted) {
      setData((prev) => [inserted as Brand, ...prev]);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this brand? This cannot be undone.')) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setData((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <main className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={createNew}
          disabled={creating}
          className="px-3 py-2 border rounded"
          title="Create a new draft brand"
        >
          {creating ? 'Creating…' : 'New Brand'}
        </button>

        <label className="inline-flex items-center gap-2">
          <span>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="all">All</option>
            <option value="live">live</option>
            <option value="demo">demo</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={showTests}
            onChange={(e) => setShowTests(e.target.checked)}
          />
          <span>Show test rows</span>
        </label>

        {errorMsg && <span className="text-red-600 ml-auto">{errorMsg}</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <Th>Name</Th>
              <Th>Website</Th>
              <Th>Email</Th>
              <Th>Country</Th>
              <Th>Industry</Th>
              <Th>Phone</Th>
              <Th>Status</Th>
              <Th>Test?</Th>
              <Th>Slogan</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t align-top">
                <Td>
                  <Input value={r.brand_name ?? ''} onChange={(v) => update(r.id, 'brand_name', v)} width="14rem" />
                </Td>
                <Td>
                  <Input value={r.website ?? ''} onChange={(v) => update(r.id, 'website', v)} width="16rem" />
                </Td>
                <Td>
                  <Input value={r.contact_email ?? ''} onChange={(v) => update(r.id, 'contact_email', v)} width="14rem" />
                </Td>
                <Td>
                  <Input value={r.country ?? ''} onChange={(v) => update(r.id, 'country', v)} width="8rem" />
                </Td>
                <Td>
                  <Input value={r.industry ?? ''} onChange={(v) => update(r.id, 'industry', v)} width="10rem" />
                </Td>
                <Td>
                  <Input value={r.phone ?? ''} onChange={(v) => update(r.id, 'phone', v)} width="10rem" />
                </Td>
                <Td>
                  <select
                    className="border p-1 rounded"
                    value={r.status ?? 'draft'}
                    onChange={(e) => update(r.id, 'status', e.target.value as any)}
                  >
                    <option value="live">live</option>
                    <option value="demo">demo</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </Td>
                <Td className="text-center">
                  <input
                    type="checkbox"
                    checked={!!r.is_test}
                    onChange={(e) => update(r.id, 'is_test', e.target.checked)}
                  />
                </Td>
                <Td>
                  <Input value={r.slogan ?? ''} onChange={(v) => update(r.id, 'slogan', v)} width="16rem" />
                </Td>
                <Td>
                  <Textarea value={r.description ?? ''} onChange={(v) => update(r.id, 'description', v)} width="20rem" rows={3} />
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      disabled={savingId === r.id}
                      onClick={() => save(r)}
                    >
                      {savingId === r.id ? 'Saving…' : 'Save'}
                    </button>
                    <button className="px-2 py-1 border rounded" onClick={() => remove(r.id)}>
                      Delete
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="p-4 opacity-70">
                  No rows match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-2 font-semibold">{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`p-2 ${className ?? ''}`}>{children}</td>;
}
function Input({
  value,
  onChange,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  width?: string;
}) {
  return (
    <input
      className="border p-1 rounded"
      style={{ width }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
function Textarea({
  value,
  onChange,
  width,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  width?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="border p-1 rounded"
      style={{ width }}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
