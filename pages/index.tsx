import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";

export default function Home() {
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    supabase
      .from("brands")
      .select("*")
      .order("brand_name")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setBrands(data || []);
      });
  }, []);

  // Build unique category list from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    brands.forEach(b => { if (b.category) set.add(b.category); });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [brands]);

  // Filter by category + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands.filter(b => {
      const matchesCategory = category === "All" || (b.category || "") === category;
      const hay = `${b.brand_name ?? ""} ${b.bio ?? ""} ${b.slug ?? ""}`.toLowerCase();
      const matchesSearch = q === "" || hay.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [brands, search, category]);

  return (
    <Layout>
      <div className="mb-6 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Discover brands</h1>
            <p className="text-sm text-neutral-600">Search and filter by category.</p>
          </div>
          <Link href="/submit" className="btn btn-primary">Submit</Link>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn" onClick={() => setSearch("")}>Clear</button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  active ? "bg-black text-white border-black" : "border-neutral-300 hover:bg-neutral-100"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="text-sm text-neutral-600">
          Showing <strong>{filtered.length}</strong> of {brands.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-600">No matching brands.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <li key={b.id} className="card">
              <div className="flex items-start justify-between">
                <h2 className="font-medium">{b.brand_name}</h2>
                {b.category && (
                  <span className="rounded-md px-2 py-0.5 text-xs border border-neutral-300">
                    {b.category}
                  </span>
                )}
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
