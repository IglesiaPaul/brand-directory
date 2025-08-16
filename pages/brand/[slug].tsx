import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CO2Icon, WaterIcon, RecycleIcon, CertIcon } from "../../components/Icons";

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
      <article className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold">{brand.brand_name}</h1>
          {brand.mission && (
            <p className="mt-2 text-neutral-700">{brand.mission}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {brand.website && (
              <a className="btn btn-primary" href={brand.website} target="_blank">Visit website</a>
            )}
          </div>
        </header>

        {/* Impact badges */}
        {/* Impact badges */}
<section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
  {brand.carbon_saving && (
    <div className="card flex flex-col items-center text-center p-4 bg-green-50 border border-green-200">
      <CO2Icon />
      <span className="mt-2 text-sm font-medium text-green-700">CO₂</span>
      <span className="text-xs text-green-600">{brand.carbon_saving}</span>
    </div>
  )}
  {brand.water_saving && (
    <div className="card flex flex-col items-center text-center p-4 bg-blue-50 border border-blue-200">
      <WaterIcon />
      <span className="mt-2 text-sm font-medium text-blue-700">Water</span>
      <span className="text-xs text-blue-600">{brand.water_saving}</span>
    </div>
  )}
  {brand.recyclability && (
    <div className="card flex flex-col items-center text-center p-4 bg-teal-50 border border-teal-200">
      <RecycleIcon />
      <span className="mt-2 text-sm font-medium text-teal-700">Recyclability</span>
      <span className="text-xs text-teal-600">{brand.recyclability}</span>
    </div>
  )}
  {brand.certifications && (
    <div className="card flex flex-col items-center text-center p-4 bg-yellow-50 border border-yellow-200">
      <CertIcon />
      <span className="mt-2 text-sm font-medium text-yellow-700">Certs</span>
      <span className="text-xs text-yellow-600">{brand.certifications}</span>
    </div>
  )}
</section>


        {/* Sustainability Impact */}
        <section className="card">
          <h2 className="text-lg font-medium mb-3">Sustainability Impact</h2>
          <ul className="space-y-1 text-sm text-neutral-700">
            {brand.carbon_saving && <li>🌍 <strong>Carbon saving:</strong> {brand.carbon_saving}</li>}
            {brand.water_saving && <li>💧 <strong>Water saving:</strong> {brand.water_saving}</li>}
            {brand.recyclability && <li>♻️ <strong>Recyclability:</strong> {brand.recyclability}</li>}
          </ul>
        </section>

        {/* Materials & Certifications */}
        <section className="card">
          <h2 className="text-lg font-medium mb-3">Materials & Certifications</h2>
          {brand.materials && <p className="text-sm mb-2"><strong>Materials:</strong> {brand.materials}</p>}
          {brand.certifications && <p className="text-sm"><strong>Certifications:</strong> {brand.certifications}</p>}
        </section>

        {/* Supply Chain Transparency */}
        {brand.supply_chain && (
          <section className="card">
            <h2 className="text-lg font-medium mb-3">Supply Chain</h2>
            <p className="text-sm text-neutral-700">{brand.supply_chain}</p>
          </section>
        )}

        {/* Social & Community */}
        {brand.community && (
          <section className="card">
            <h2 className="text-lg font-medium mb-3">Community & Social</h2>
            <p className="text-sm text-neutral-700">{brand.community}</p>
          </section>
        )}

        {/* Featured product */}
        {brand.featured_product && (
          <section className="card">
            <h2 className="text-lg font-medium mb-3">Featured Product</h2>
            <p className="text-sm text-neutral-700">{brand.featured_product}</p>
          </section>
        )}
      </article>
    </Layout>
  );
}

