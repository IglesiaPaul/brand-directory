import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function PrintCatalog() {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brands").select("*").then(({ data, error }) => {
      if (error) console.error(error);
      else setBrands(data || []);
    });
  }, []);

  return (
    <div>
      <h1>Printable Catalog</h1>
      {brands.map(b => (
        <div key={b.id}>
          <h2>{b.brand_name}</h2>
          <p>{b.bio}</p>
        </div>
      ))}
    </div>
  );
}
