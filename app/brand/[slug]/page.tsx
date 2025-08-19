import { supabaseServer } from '@/lib/supabaseServer';

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();
  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', params.slug)   // ✅ slug, not id
    .single();

  if (error || !brand) {
    return (
      <main className="container">
        <h1>Brand not found</h1>
        <p>Go back to the <a className="btn" href="/directory">Directory</a>.</p>
      </main>
    );
  }

  const flag = brand.country ? countryToFlag(brand.country) : '';

  return (
    <main className="container">
      <a className="btn" href="/directory">← Back to Directory</a>
      <h1 style={{ marginTop: 12 }}>{brand.brand_name}</h1>

      <div className="row" style={{ margin: '8px 0 16px' }}>
        {brand.industry && <span className={industryBadgeClass(brand.industry)}>{brand.industry}</span>}
        {brand.country && <span className="badge">{flag ? `${flag} ${brand.country}` : brand.country}</span>}
        {brand.status && <span className={`badge badge--${capitalize(brand.status)}`}>{brand.status}</span>}
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
          <a className="mono" href={brand.website} target="_blank" rel="noreferrer">{brand.website}</a>
        </section>
      )}
    </main>
  );
}

/* --- Helpers (server file, pure functions) --- */
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
    const cps = iso.split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
    return String.fromCodePoint(...cps);
  }
  return country;
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

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
