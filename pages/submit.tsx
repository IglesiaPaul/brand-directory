import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";

export default function Submit() {
  const [form, setForm] = useState({
    brand_name: "",
    email: "",
    website: "",
    bio: "",
    primary_hex: "#111111",
    secondary_hex: "#f3f4f6"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("brand_submissions").insert([form]);
    if (error) {
      console.error(error);
      alert("Submission error. Check console.");
    } else {
      alert("Submitted! We’ll review and publish.");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Submit your brand</h1>
        <form onSubmit={handleSubmit} className="space-y-4 card">
          <div>
            <label className="label">Brand name</label>
            <input className="input" name="brand_name" placeholder="Hemp’in" onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" name="email" type="email" placeholder="hello@brand.com" onChange={handleChange} />
          </div>
          <div>
            <label className="label">Website</label>
            <input className="input" name="website" placeholder="https://…" onChange={handleChange} />
          </div>
          <div>
            <label className="label">Short bio</label>
            <textarea className="textarea" name="bio" rows={4} placeholder="What you do…" onChange={handleChange}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Primary hex</label>
              <input className="input" name="primary_hex" placeholder="#111111" onChange={handleChange} />
            </div>
            <div>
              <label className="label">Secondary hex</label>
              <input className="input" name="secondary_hex" placeholder="#f3f4f6" onChange={handleChange} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">Submit</button>
            <a className="btn" href="/">Cancel</a>
          </div>
        </form>
      </div>
    </Layout>
  );
}
