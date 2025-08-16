import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";

export default function Admin() {
  const [subs, setSubs] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("brand_submissions").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
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
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Admin moderation</h1>
      {subs.length === 0 ? (
        <p className="text-neutral-600">No submissions.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subs.map(s => (
            <li key={s.id} className="card">
              <h2 className="font-medium">{s.brand_name}</h2>
              <p className="text-sm text-neutral-700 mt-1 line-clamp-3">{s.bio}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn btn-primary" onClick={() => approve(s.id, s)}>Approve</button>
                <a className="btn" href={s.website} target="_blank">Website</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
