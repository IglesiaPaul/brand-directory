'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

/* --- Brand type --- */
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
  status?: 'live' | 'demo' | 'draft' | 'archived' | null;
  is_test?: boolean | null;

  /* Optional certifications */
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

function industryBadgeClass(industry?: string | null) {
  const key = (industry || 'Other').toLowerCase();
  if (key.includes('fashion')) return 'badge badge--Fashion';
  if (key.includes('material')) return 'badge badge--Materials';
  if (key.includes('accessor')) return 'badge badge--Accessories';
  if (key.includes('footwear') || key.includes('shoes'))
    return 'badge badge--Footwear';
  if (key.includes('home')) return 'badge badge--Home';
  return 'badge badge--Other';
}

/* --- Page --- */
export default function BrandPage() {
  const { slug } = useParams() as { slug: string };
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBrand = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('brands')
        .select(
          'id,slug,brand_name,website,contact_email,country,industry,slogan,description,status,is_test,gots,bcorp,fair_trade,oeko_tex,vegan,climate_neutral'
        )
        .eq('slug', slug)
        .single();

      if (!error && data) {
        // Normalize nullables
        setBrand({
          ...data,
          is_test: data.is_test ?? null,
          gots: data.gots ?? null,
          bcorp: data.bcorp ?? null,
          fair_trade: data.fair_trade ?? null,
          oeko_tex: data.oeko_tex ?? null,
          vegan: data.vegan ?? null,
          climate_neutral: data.climate_neutral ?? null,
        } as Brand);
      }
      setLoading(false);
    };

    fetchBrand();
  }, [slug]);

  if (loading) {
    return (
      <main className="container">
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      </main>
    );
  }

  if (!brand) {
    return (
      <main className="container">
        <h1>Brand not found</h1>
        <p>
          Go back to the <a className="btn" href="/directory">Directory</a>.
        </p>
      </main>
    );
  }

  const flag = brand.country ? countryToFlag(brand.country) : '';

  return (
    <main className="container">
      <a className="btn" href="/directory">← Back to Directory</a>
      <h1 style={{ marginTop: 12 }}>{brand.brand_name}</h1>

      <div className="row" style={{ margin: '8px 0 16px' }}>
        {brand.industry && (
          <span className={industryBadgeClass(brand.industry)}>
            {brand.industry}
          </span>
        )}
        {brand.country && (
          <span className="badge">
            {flag ? `${flag} ${brand.country}` : brand.country}
          </span>
        )}
        {brand.status && (
          <span className={`badge badge--${brand.status}`}>
            {brand.status}
          </span>
        )}
      </div>

      {brand.slogan && <p style={{ fontSize: 18 }}>{brand.slogan}</p>}
      {brand.description && <p style={{ marginTop: 8 }}>{brand.description}</p>}

      <section style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Certifications</h3>
        <div className="icon-row">
          {brand.gots && <span className="icon icon--ok" title="GOTS">🧵</span>}
          {brand.bcorp && <span className="icon icon--info" title="B Corp">🅱️</span>}
          {brand.fair_trade && <span className="icon icon--ok" title="Fair Trade">🤝</span>}
          {brand.oeko_tex && <span className="icon icon--info" title="OEKO-TEX">✅</span>}
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
          <a
            className="mono"
            href={brand.website}
            target="_blank"
            rel="noreferrer"
          >
            {brand.website}
          </a>
        </section>
      )}
    </main>
  );
}
