'use client';
import { useState } from 'react';
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
  status?: 'live'|'demo'|'draft'|'archived'|null;
};

export default function AdminTable({ rows }: { rows: Brand[] }) {
  const [data, setData] = useState<Brand[]>(rows);
  const supabase = supabaseBrowser();

  async function save(row: Brand) {
    const { id, ...cols } = row;
    const { error } = await supabase.from('brands').update(cols).eq('id', id);
    if (error) alert(error.message);
    else alert('Saved!');
  }

  function update(id: string, field: keyof Brand, value: any) {
    setData(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  return (
    <main className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Hemp’in Directory — Admin</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Website</th>
              <th className="p-2">Email</th>
              <th className="p-2">Country</th>
              <th className="p-2">Industry</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Status</th>
              <th className="p-2">Test?</th>
              <th className="p-2">Slogan</th>
              <th className="p-2">Description</th>
              <th className="p-2">Save</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">
                  <input className="border p-1 w-48"
                    value={r.brand_name ?? ''}
                    onChange={e => update(r.id, 'brand_name', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-64"
                    value={r.website ?? ''}
                    onChange={e => update(r.id, 'website', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-56"
                    value={r.contact_email ?? ''}
                    onChange={e => update(r.id, 'contact_email', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-32"
                    value={r.country ?? ''}
                    onChange={e => update(r.id, 'country', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-32"
                    value={r.industry ?? ''}
                    onChange={e => update(r.id, 'industry', e.target.value)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-40"
                    value={r.phone ?? ''}
                    onChange={e => update(r.id, 'phone', e.target.value)} />
                </td>
                <td className="p-2">
                  <select className="border p-1"
                    value={r.status ?? 'live'}
                    onChange={e => update(r.id, 'status', e.target.value as any)}>
                    <option value="live">live</option>
                    <option value="demo">demo</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td className="p-2">
                  <input type="checkbox"
                    checked={!!r.is_test}
                    onChange={e => update(r.id, 'is_test', e.target.checked)} />
                </td>
                <td className="p-2">
                  <input className="border p-1 w-56"
                    value={r.slogan ?? ''}
                    onChange={e => update(r.id, 'slogan', e.target.value)} />
                </td>
                <td className="p-2">
                  <textarea className="border p-1 w-72 h-16"
                    value={r.description ?? ''}
                    onChange={e => update(r.id, 'description', e.target.value)} />
                </td>
                <td className="p-2">
                  <button className="px-2 py-1 border rounded"
                    onClick={() => save(r)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
