'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Brand = {
  id: string;
  slug: string;
  brand_name: string | null;
  website: string | null;
  contact_email: string | null;
  country: string | null;
  industry: string | null;
  slogan: string | null;
  description: string | null;
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

/* --- Helpers --- */
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
  if (/^[A-Z]{2}$/.test(iso)) {
    const codePoints = iso.split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...codePoints);
  }
  return country;
}

export default function BrandPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) setBrand(data as Brand);
      setLoading(false);
    };
    if (slug) fetchBrand();
  }, [slug]);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (!brand) return <p className="text-muted">Brand not found.</p>;

  const flag = countryToFlag(brand.country);

  return (
    <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>
        {brand.brand_name}
      </h1>
      {brand.slogan && <h2 style={{ fontSize: 20, color: 'var(--muted)', marginBottom: 16 }}>{brand.slogan}</h2>}

      <div className="meta" style={{ marginBottom: 12 }}>
        {brand.industry && <span className="badge">{brand.industry}</span>}
        {brand.country && <span className="badge">{flag ? `${flag} ${brand.country}` : brand.country}</span>}
      </div>

      {brand.description && <p style={{ marginBottom: 16 }}>{brand.description}</p>}

      {/* Certifications */}
      <div className="icon-row" style={{ marginBottom: 16 }}>
        {brand.gots && <span className="icon" title="GOTS">🧵</span>}
        {brand.bcorp && <span className="icon" title="B Corp">🅱️</span>}
        {brand.fair_trade && <span className="icon" title="Fair Trade">🤝</span>}
        {brand.oeko_tex && <span className="icon" title="OEKO-TEX">✅</span>}
        {brand.vegan && <span className="icon" title="Vegan">🌱</span>}
        {brand.climate_neutral && <span className="icon" title="Climate neutral">🌍</span>}
      </div>

      {/* Links */}
      <div style={{ marginTop: 8 }}>
        {brand.website && (
          <a href={brand.website} target="_blank" rel="noreferrer" className="mono">
            🌐 {brand.website}
          </a>
        )}
        {brand.contact_email && (
          <p style={{ marginTop: 8 }}>
            📧 <a href={`mailto:${brand.contact_email}`} className="mono">{brand.contact_email}</a>
          </p>
        )}
      </div>
    </div>
  );
}
