import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brands").select("*").order("brand_name").then(({ data, error }) => {
      if (error) console.error(error);
      else setBrands(data || []);
    });
  }, []);

  return (
    <Layout>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Discover brands</h1>
          <p className="text-sm text-neutral-600">A clean, mobile-first directory.</p>
        </div>
        <Link href="/submit" className="btn btn-primary">Submit your brand</Link>
      </div>

      {brands.length === 0 ? (
        <p className="text-neutral-600">No brands yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <li key={b.id} className="card">
              <div className="flex items-start justify-between">
                <h2 className="font-medium">{b.brand_name}</h2>
                <span className="rounded-md px-2 py-0.5 text-xs" style={{ backgroundColor: b.secondary_hex || "#f3f4f6", color: "#111" }}>
                  {b.slug}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-700 line-clamp-3">{b.bio}</p>
              <div className="mt-3 flex gap-2">
                <Link href={`/brand/${b.slug}`} className="btn btn-primary">View</Link>
                {b.website && <a href={b.website} target="_blank" className="btn">Website</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
