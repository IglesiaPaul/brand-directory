// app/admin/brands/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';

export default function AdminBrandEditPage() {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Edit Brand #{id}</h1>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left column: main info */}
        <div style={{ flex: 2 }}>
          <label className="label">Brand Name</label>
          <input className="input" placeholder="Name" />

          <label className="label">Website</label>
          <input className="input" placeholder="https://…" />

          <label className="label">Email</label>
          <input className="input" placeholder="email@example.com" />

          <label className="label">Slogan</label>
          <input className="input" placeholder="Short tagline…" />

          <label className="label">Description</label>
          <textarea className="textarea" rows={6} placeholder="Full description…" />
        </div>

        {/* Right column: status, certifications */}
        <div style={{ flex: 1 }}>
          <label className="label">Status</label>
          <select className="select">
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <label className="label" style={{ marginTop: 16 }}>
            Test Row?
          </label>
          <input type="checkbox" />

          <h3 style={{ marginTop: 20 }}>Certifications</h3>
          <label><input type="checkbox" /> GOTS</label><br />
          <label><input type="checkbox" /> B-Corp</label><br />
          <label><input type="checkbox" /> Fair Trade</label><br />
          <label><input type="checkbox" /> OEKO-TEX</label><br />
          <label><input type="checkbox" /> Vegan</label><br />
          <label><input type="checkbox" /> Climate Neutral</label>
        </div>
      </div>

      {/* Save/Cancel bar */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}
      >
        <button className="btn">Cancel</button>
        <button className="btn btn--primary">Save</button>
      </div>
    </div>
  );
}
