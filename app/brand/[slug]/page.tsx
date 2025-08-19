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
  status?: 'live' | 'demo' | 'draft' | 'archived' | null;
  gots?: boolean | null;
  bcorp?: boolean | null;
  fair_trade?: boolean | null;
  oeko_tex?: boolean | null;
  vegan?: boolean | null;
  climate_neutral?: boolean | null;
};

export default function BrandPage() {
  const params = useParams() as { slug: string };   // ✅ fix type
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

      if (!error) setBrand(data as Brand);
      setLoading(false);
    };
    if (slug) fetchBrand();
  }, [slug]);

  if (loading) return <main className="container">Loading…</main>;
  if (!brand) return <main className="container">Brand not found</main>;

  return (
    <main className="container">
      <a href="/directory" className="btn">← Back to Directory</a>
      <h1 style={{ marginTop: 12 }}>{brand.brand_name}</h1>
      {brand.slogan && <p style={{ fontSize: 18 }}>{brand.slogan}</p>}
      {brand.description && <p style={{ marginTop: 8 }}>{brand.description}</p>}

      {brand.website && (
        <section style={{ marginTop: 16 }}>
          <h3>Website</h3>
          <a href={brand.website} target="_blank" rel="noreferrer">{brand.website}</a>
        </section>
      )}
    </main>
  );
}
