'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Brand = {
  id: string;
  brand_name: string | null;
  website: string | null;
  contact_email: string | null;
  country: string | null;
  industry: string | null;
  slogan: string | null;
  description: string | null;
  status?: 'live' | 'demo' | 'draft' | 'archived' | null;
  is_test?: boolean | null;
};

function flag(country?: string | null) {
  if (!country) return '';
  // very simple: just return country text; you can map to flags later
  return country;
}

export default function PublicDirectoryPage() {
  const [rows, setRows] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('All');
  const [industry, setIndustry] = useState('All');

  useEffect(() => {
    const fetchLive = async () => {
      const supabase = supabaseBrowser();
      // public directory: show only live & not test
      const { data, error } = await supabase
        .from('brands')
        .select('id,brand_name,website,contact_email,country,industry,slogan,description,status,is_test')
        .eq('status', 'live')
        .eq('is_test', false)
        .order('brand_name', { ascending: true });
      if (!error && data) setRows(data as Brand[]);
      setLoading(false);
    };
    fetchLive();
  }, []);

  const countries = useMemo(() => {
    const set = new Set(rows.map((r) => r.country).filter(Boolean) as string[]);
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const industries = useMemo(() => {
    const set = new Set(rows.map((r) => r.industry).filter(Boolean) as string[]);
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (country !== 'All' && r.country !== country) return false;
      if (industry !== 'All' && r.industry !== industry) return false;
      if (!query) return true;
      const hay = `${r.brand_name ?? ''} ${r.country ?? ''} ${r.industry ?? ''} ${r.slogan ?? ''} ${r.description ?? ''}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, country, industry]);

  return (
    <div className="container">
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Hemp’in Directory</h1>
      <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 16 }}>
        Discover hemp fashion & materials brands.
      </p>

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          className="input"
          style={{ minWidth: 280 }}
          placeholder="Search brands, slogans, descriptions…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          {industries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <div className="grid">
          {filtered.map((b) => (
            <article key={b.id} className="card">
              <h3>{b.brand_name}</h3>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                {b.industry && <span className="badge">{b.industry}</span>}
                {b.country && <span className="badge">{flag(b.country)}</span>}
              </div>
              {b.slogan && <p style={{ marginTop: 6 }}>{b.slogan}</p>}
              {b.description && <p>{b.description}</p>}
              {b.website && (
                <p style={{ marginTop: 8 }}>
                  <a href={b.website} target="_blank" rel="noreferrer" className="mono">
                    {b.website}
                  </a>
                </p>
              )}
            </article>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: 'var(--muted)' }}>No brands match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
