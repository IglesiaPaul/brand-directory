import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  if (!brand) return <div>Loading...</div>;

  return (
    <div>
      <h1>{brand.brand_name}</h1>
      <p>{brand.bio}</p>
      <p><a href={brand.website}>{brand.website}</a></p>
    </div>
  );
}
