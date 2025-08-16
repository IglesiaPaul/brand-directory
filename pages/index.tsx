import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brands").select("*").then(({ data, error }) => {
      if (error) console.error(error);
      else setBrands(data || []);
    });
  }, []);

  return (
    <div>
      <h1>Brand Directory</h1>
      <ul>
        {brands.map((b) => (
          <li key={b.id}>
            <Link href={`/brand/${b.slug}`}>{b.brand_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
