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

  /* Optional certifications (can be missing/null) */
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

/* --- Helpers --- */

// Map common country names to flag emoji.
// If your country column already stores ISO codes, adapt accordingly.
function countryToFlag(country?: string | null) {
  if (!country) return '';
  const map: Record<string, string> = {
    "United States of America": "US",
    "United States": "US",
    "USA": "US",
    "United Kingdom": "GB",
    "UK": "GB",
    "Great Britain": "GB",
    "South Korea": "KR",
    "Korea": "KR",
    "Czech Republic": "CZ",
    "Ivory Coast": "CI",
    "Côte d'Ivoire": "CI",
    "UAE": "AE",
    "United Arab Emirates": "AE"
  };
  const name = country.trim();
  const iso = (map[name] || name).toUpperCase();

  // If we have a 2-letter A–Z code, render emoji flag. Else return raw text.
  if (/^[A-Z]{2}$/.test(iso)) {
    const codePoints = iso.split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...codePoints);
  }
  return country; // fallback
}

function industryBadgeClass(industry?: string | null) {
  const key = (industry || 'Other').toLowerCase();
  if (key.includes('fashion'))     return 'badge badge--Fashion';
  if (key.includes('material'))    return 'badge badge--Materials';
  if (key.includes('accessor'))    return 'badge badge--Accessories';
  if (key.includes('footwear')|| key.includes('shoes')) return 'badge badge--Footwear';
  if (key.includes('home'))        return 'badge badge--Home';
  return 'badge badge--Other';
}

export default function PublicDirectoryPage() {
  const [rows, setRows] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('All');
  const [industry, setIndustry] = useState('All');
  const [open, setOpen] = useState<Record<string, boolean>>({}); // expand per-card

  useEffect(() => {
    const fetchLive = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('brands')
        .select('id,brand_name,website,contact_email,country,industry,slogan,description,status,is_test,gots,bcorp,fair_trade,oeko_tex,vegan,climate_neutral')
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
          {filtered.map((b) => {
            const isOpen = !!open[b.id];
            const flag = countryToFlag(b.country);
            return (
              <article key={b.id} className="card">
                <h3 style={{ marginBottom: 4 }}>
                  <a href={`/brand/${b.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {b.brand_name}
                  </a>
                </h3>

                <div className="meta">
                  {b.industry && <span className={industryBadgeClass(b.industry)}>{b.industry}</span>}
                  {b.country && <span className="badge">{flag ? `${flag} ${b.country}` : b.country}</span>}
                </div>

                {b.slogan && <p style={{ marginTop: 6 }}>{b.slogan}</p>}

                {/* Toggle */}
                <div className="toggle" onClick={() => setOpen(prev => ({ ...prev, [b.id]: !isOpen }))}>
                  {isOpen ? 'Hide details ▲' : 'Show details ▼'}
                </div>

                {isOpen && (
                  <div className="details">
                    {b.description && <p>{b.description}</p>}

                    {/* Certifications row (shows only those that are true) */}
                    <div className="icon-row" style={{ marginTop: 6 }}>
                      {b.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
                      {b.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
                      {b.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
                      {b.oeko_tex && <span className="icon icon--info" title="OEKO‑TEX">✅</span>}
                      {b.vegan && <span className="icon icon--warn" title="Vegan">🌱</span>}
                      {b.climate_neutral && <span className="icon icon--info" title="Climate neutral">🌍</span>}
                    </div>

                    {/* Links */}
                    <div style={{ marginTop: 8 }}>
                      {b.website && (
                        <a href={b.website} target="_blank" rel="noreferrer" className="mono">
                          {b.website}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {filtered.length === 0 && (
            <p style={{ color: 'var(--muted)' }}>No brands match your filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
