import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function BrandPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from("brands").select("*").eq("slug", slug).single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setBrand(data);
      });
  }, [slug]);

  if (!brand) return <Layout><div>Loading…</div></Layout>;

  return (
    <Layout>
      <article className="max-w-2xl mx-auto">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold">{brand.brand_name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block text-xs rounded-md px-2 py-0.5 border" style={{ borderColor: brand.primary_hex || "#111", color: brand.primary_hex || "#111" }}>
              {brand.slug}
            </span>
            {brand.website && <a className="btn" href={brand.website} target="_blank">Visit website</a>}
          </div>
        </header>
        <section className="card">
          <p className="text-neutral-800">{brand.bio}</p>
          <div className="mt-4 h-2 rounded" style={{ background: brand.secondary_hex || "#f3f4f6" }} />
        </section>
      </article>
    </Layout>
  );
}
