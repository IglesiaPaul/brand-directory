import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brand_submissions").select("*").then(({ data, error }) => {
      if (error) console.error(error);
      else setSubs(data || []);
    });
  }, []);

  const approve = async (id: string, data: any) => {
    await supabase.from("brands").insert([{ 
      brand_name: data.brand_name,
      website: data.website,
      bio: data.bio,
      primary_hex: data.primary_hex,
      secondary_hex: data.secondary_hex,
      slug: data.slug
    }]);
    await supabase.from("brand_submissions").delete().eq("id", id);
    setSubs((prev) => prev.filter(s => s.id !== id));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {subs.map(s => (
        <div key={s.id}>
          <p>{s.brand_name}</p>
          <button onClick={() => approve(s.id, s)}>Approve</button>
        </div>
      ))}
    </div>
  );
}
