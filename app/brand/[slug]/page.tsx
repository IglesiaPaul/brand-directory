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
  status: 'live' | 'demo' | 'draft' | 'archived' | null;
  gots: boolean | null;
  bcorp: boolean | null;
  fair_trade: boolean | null;
  oeko_tex: boolean | null;
  vegan: boolean | null;
  climate_neutral: boolean | null;
};

function countryToFlag(country?: string | null) {
  if (!country) return '';
  const map: Record<string, string> = {
    'United States of America': 'US',
    'United States': 'US',
    'USA': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Great Britain': 'GB',
    'South Korea': 'KR',
    'Korea': 'KR',
    'Czech Republic': 'CZ',
    'Ivory Coast': 'CI',
    "Côte d'Ivoire": 'CI',
    'UAE': 'AE',
    'United Arab Emirates': 'AE',
  };
  const name = country.trim();
  const iso = (map[name] || name).toUpperCase();
  if (/^[A-Z]{2}$/.test(iso)) {
    const cps = iso.split('').map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...cps);
  }
  return country;
}

export default function BrandPage() {
  // Type assertion so TS knows slug exists
  const params = useParams() as { slug: string };
  const slug = params.slug;

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

      if (error) {
        console.error(error.message);
        setBrand(null);
      } else {
        // Normalize booleans to null/true
        const b = data as Partial<Brand>;
        const normalized: Brand = {
          id: String(b.id),
          slug: String(b.slug),
          brand_name: (b.brand_name ?? null) as string | null,
          website: (b.website ?? null) as string | null,
          contact_email: (b.contact_email ?? null) as string | null,
          country: (b.country ?? null) as string | null,
          industry: (b.industry ?? null) as string | null,
          slogan: (b.slogan ?? null) as string | null,
          description: (b.description ?? null) as string | null,
          status: (b.status ?? null) as Brand['status'],
          gots: (b.gots ?? null) as boolean | null,
          bcorp: (b.bcorp ?? null) as boolean | null,
          fair_trade: (b.fair_trade ?? null) as boolean | null,
          oeko_tex: (b.oeko_tex ?? null) as boolean | null,
          vegan: (b.vegan ?? null) as boolean | null,
          climate_neutral: (b.climate_neutral ?? null) as boolean | null,
        };
        setBrand(normalized);
      }
      setLoading(false);
    };
    if (slug) fetchBrand();
  }, [slug]);

  if (loading) return <main className="container">Loading…</main>;
  if (!brand) {
    return (
      <main className="container">
        <a href="/directory" className="btn">← Back to Directory</a>
        <h1 style={{ marginTop: 12 }}>Brand not found</h1>
      </main>
    );
  }

  const flag = countryToFlag(brand.country);

  return (
    <main className="container">
      <a href="/directory" className="btn">← Back to Directory</a>
      <h1 style={{ marginTop: 12 }}>{brand.brand_name}</h1>

      <div className="row" style={{ margin: '8px 0 16px' }}>
        {brand.industry && <span className="badge">{brand.industry}</span>}
        {brand.country && <span className="badge">{flag ? `${flag} ${brand.country}` : brand.country}</span>}
        {brand.status && <span className={`badge badge--${brand.status}`}>{brand.status}</span>}
      </div>

      {brand.slogan && <p style={{ fontSize: 18 }}>{brand.slogan}</p>}
      {brand.description && <p style={{ marginTop: 8 }}>{brand.description}</p>}

      <section style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Certifications</h3>
        <div className="icon-row">
          {brand.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
          {brand.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
          {brand.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
          {brand.oeko_tex && <span className="icon icon--info" title="OEKO‑TEX">✅</span>}
          {brand.vegan && <span className="icon icon--warn" title="Vegan">🌱</span>}
          {brand.climate_neutral && <span className="icon icon--info" title="Climate neutral">🌍</span>}
          {!brand.gots && !brand.bcorp && !brand.fair_trade && !brand.oeko_tex && !brand.vegan && !brand.climate_neutral && (
            <span style={{ color: 'var(--muted)' }}>— no certifications listed yet —</span>
          )}
        </div>
      </section>

      {brand.website && (
        <section style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Website</h3>
          <a className="mono" href={brand.website} target="_blank" rel="noreferrer">
            {brand.website}
          </a>
        </section>
      )}
    </main>
  );
}
