// app/admin/brands/page.tsx
'use client';

import Link from 'next/link';

const dummyBrands = [
  { id: '1', name: 'HempCo', status: 'live' },
  { id: '2', name: 'EcoThreads', status: 'draft' },
  { id: '3', name: 'GreenFiber', status: 'archived' },
];

export default function AdminBrandsPage() {
  return (
    <div className="container">
      <h1>Brands Overview</h1>

      {/* Filters placeholder */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search…"
          className="input"
          style={{ width: 240, marginRight: 12 }}
        />
        <select className="select">
          <option>All statuses</option>
          <option>Live</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>

      {/* Cards list */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr 1fr' }}>
        {dummyBrands.map((b) => (
          <div
            key={b.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              background: 'var(--panel)',
            }}
          >
            <h3>{b.name}</h3>
            <p>Status: {b.status}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Link href={`/admin/brands/${b.id}`}>
                <button className="btn btn--primary">Edit</button>
              </Link>
              <button className="btn">Hide/Show</button>
              <button className="btn btn--danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
