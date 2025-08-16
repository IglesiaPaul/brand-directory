import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function PrintCatalog() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brands").select("*").order("brand_name").then(({ data, error }) => {
      if (error) console.error(error);
      else setBrands(data || []);
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Printable catalog</h1>
        <div className="space-y-4">
          {brands.map(b => (
            <section key={b.id} className="card">
              <h2 className="text-lg font-medium">{b.brand_name}</h2>
              <p className="mt-1 text-sm text-neutral-700">{b.bio}</p>
              {b.website && <a className="btn mt-3" href={b.website} target="_blank">Website</a>}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
