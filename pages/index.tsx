import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Tooltip from "../components/Tooltip";
import { LeafIcon, HandHeartIcon, TreeIcon, SparkIcon } from "../components/Icons";
import { CO2Icon, WaterIcon, RecycleIcon, CertIcon } from "../components/Icons";

export default function Home() {
  const [brands, setBrands] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const categories = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [brands]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands.filter((b) => {
      const matchesCategory = category === "All" || (b.category || "") === category;
      const hay = `${b.brand_name ?? ""} ${b.bio ?? ""} ${b.slug ?? ""}`.toLowerCase();
      const matchesSearch = q === "" || hay.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [brands, search, category]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <Layout>
      <div className="mb-6 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Discover brands</h1>
            <p className="text-sm text-neutral-600">Search, filter, and peek eco impact.</p>
          </div>
          <Link href="/submit" className="btn btn-primary">
            Submit
          </Link>
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
            <button className="btn" onClick={() => setSearch("")}>
              Clear
            </button>
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
          {filtered.map((b) => {
            const isOpen = openId === b.id;
            const ariaId = `panel-${b.id}`;
            return (
              <li key={b.id} className="card">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{b.brand_name}</h2>
                    {b.category && (
                      <span className="mt-1 inline-block rounded-md px-2 py-0.5 text-xs border border-neutral-300">
                        {b.category}
                      </span>
                    )}
                  </div>

                  {/* Chevron toggle (mobile/desktop) */}
                  <button
                    onClick={() => toggle(b.id)}
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-300"
                    aria-expanded={isOpen}
                    aria-controls={ariaId}
                    aria-label={isOpen ? "Collapse details" : "Expand details"}
                    title={isOpen ? "Collapse details" : "Expand details"}
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.06 1.06l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Bio */}
                {b.bio && <p className="mt-2 text-sm text-neutral-700 line-clamp-3">{b.bio}</p>}

                {/* Certifications row with tooltips (desktop) */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Organic */}
                  <Tooltip
                    label={b.cert_organic ? "Organic inputs verified" : "Not certified"}
                    disabled={!b.cert_organic}
                  >
                    <button
                      className={`inline-flex items-center gap-1 text-xs ${
                        b.cert_organic ? "text-green-700" : "text-neutral-300"
                      }`}
                      aria-label={b.cert_organic ? "Organic certified" : "Organic not certified"}
                      type="button"
                    >
                      <span
                        className={`p-1 rounded-full border ${
                          b.cert_organic ? "border-green-300 bg-green-50" : "border-neutral-200 bg-neutral-50"
                        }`}
                      >
                        <LeafIcon />
                      </span>
                      Organic
                    </button>
                  </Tooltip>

                  {/* Fair Trade */}
                  <Tooltip
                    label={b.cert_fairtrade ? "Fair Trade practices" : "Not certified"}
                    disabled={!b.cert_fairtrade}
                  >
                    <button
                      className={`inline-flex items-center gap-1 text-xs ${
                        b.cert_fairtrade ? "text-amber-800" : "text-neutral-300"
                      }`}
                      aria-label={b.cert_fairtrade ? "Fair Trade certified" : "Fair Trade not certified"}
                      type="button"
                    >
                      <span
                        className={`p-1 rounded-full border ${
                          b.cert_fairtrade ? "border-amber-300 bg-amber-50" : "border-neutral-200 bg-neutral-50"
                        }`}
                      >
                        <HandHeartIcon />
                      </span>
                      Fair&nbsp;Trade
                    </button>
                  </Tooltip>

                  {/* FSC */}
                  <Tooltip label={b.cert_fsc ? "FSC chain-of-custody" : "Not certified"} disabled={!b.cert_fsc}>
                    <button
                      className={`inline-flex items-center gap-1 text-xs ${
                        b.cert_fsc ? "text-teal-800" : "text-neutral-300"
                      }`}
                      aria-label={b.cert_fsc ? "FSC certified" : "FSC not certified"}
                      type="button"
                    >
                      <span
                        className={`p-1 rounded-full border ${
                          b.cert_fsc ? "border-teal-300 bg-teal-50" : "border-neutral-200 bg-neutral-50"
                        }`}
                      >
                        <TreeIcon />
                      </span>
                      FSC
                    </button>
                  </Tooltip>

                  {/* Climate Neutral */}
                  <Tooltip
                    label={b.cert_climateneutral ? "Certified climate neutral" : "Not certified"}
                    disabled={!b.cert_climateneutral}
                  >
                    <button
                      className={`inline-flex items-center gap-1 text-xs ${
                        b.cert_climateneutral ? "text-blue-800" : "text-neutral-300"
                      }`}
                      aria-label={b.cert_climateneutral ? "Climate Neutral certified" : "Climate Neutral not certified"}
                      type="button"
                    >
                      <span
                        className={`p-1 rounded-full border ${
                          b.cert_climateneutral ? "border-blue-300 bg-blue-50" : "border-neutral-200 bg-neutral-50"
                        }`}
                      >
                        <SparkIcon />
                      </span>
                      Climate
                    </button>
                  </Tooltip>
                </div>

                {/* Expanded "quick sheet" */}
                <div
                  id={ariaId}
                  role="region"
                  aria-label="Quick impact details"
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[520px] mt-4" : "max-h-0"
                  }`}
                >
                  {isOpen && (
                    <div className="pt-4 border-t border-neutral-200 space-y-4">
                      {/* Impact badges */}
                      <div className="grid grid-cols-2 gap-3">
                        {b.carbon_saving && (
                          <div className="card p-4 bg-green-50 border border-green-200 flex flex-col items-center text-center">
                            <CO2Icon />
                            <span className="mt-2 text-sm font-medium text-green-700">CO₂</span>
                            <span className="text-xs text-green-600">{b.carbon_saving}</span>
                          </div>
                        )}
                        {b.water_saving && (
                          <div className="card p-4 bg-blue-50 border border-blue-200 flex flex-col items-center text-center">
                            <WaterIcon />
                            <span className="mt-2 text-sm font-medium text-blue-700">Water</span>
                            <span className="text-xs text-blue-600">{b.water_saving}</span>
                          </div>
                        )}
                        {b.recyclability && (
                          <div className="card p-4 bg-teal-50 border border-teal-200 flex flex-col items-center text-center">
                            <RecycleIcon />
                            <span className="mt-2 text-sm font-medium text-teal-700">Recyclability</span>
                            <span className="text-xs text-teal-600">{b.recyclability}</span>
                          </div>
                        )}
                        {b.certifications && (
                          <div className="card p-4 bg-yellow-50 border border-yellow-200 flex flex-col items-center text-center">
                            <CertIcon />
                            <span className="mt-2 text-sm font-medium text-yellow-700">Certs</span>
                            <span className="text-xs text-yellow-600">{b.certifications}</span>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      <ul className="text-sm text-neutral-800 list-disc pl-5 space-y-1">
                        {b.carbon_saving && <li>{b.carbon_saving}</li>}
                        {b.water_saving && <li>{b.water_saving}</li>}
                        {b.recyclability && <li>{b.recyclability}</li>}
                        {b.supply_chain && <li>{b.supply_chain}</li>}
                      </ul>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/brand/${b.slug}`} className="btn btn-primary">
                          View profile
                        </Link>
                        {b.website && (
                          <a href={b.website} target="_blank" className="btn">
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTAs (always visible) */}
                <div className="mt-3 flex gap-2">
                  <Link href={`/brand/${b.slug}`} className="btn btn-primary">
                    View
                  </Link>
                  {b.website && (
                    <a href={b.website} target="_blank" className="btn">
                      Website
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Layout>
  );
}
