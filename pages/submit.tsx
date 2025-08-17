import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";

const CATEGORIES = ["Apparel", "Materials", "Wellness", "Food", "Home", "Construction", "Packaging", "Other"];

export default function Submit() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    brand_name: "",
    email: "",
    website: "",
    category: "",
    primary_hex: "#111111",
    secondary_hex: "#f3f4f6",
    logo_url: "",
    bio: "",
    contact_name: "",
    contact_phone: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    line: "",
    whatsapp: "",
    tiktok: "",
    xiaohongshu: "",
    other_social: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
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
        <form onSubmit={step === 1 ? handleStep1 : handleSubmit} className="space-y-4 card">
          {step === 1 ? (
            <>
              <div>
                <label className="label">Brand name</label>
                <input className="input" name="brand_name" placeholder="Hemp’in" onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Contact email</label>
                <input className="input" name="email" type="email" placeholder="hello@brand.com" onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" name="website" placeholder="https://…" onChange={handleChange} />
              </div>
              <div>
                <label className="label">Category</label>
                <select name="category" className="input" onChange={handleChange} defaultValue="" required>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" type="submit">Next</button>
                <a className="btn" href="/">Cancel</a>
              </div>
            </>
          ) : (
            <>
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
              <div>
                <label className="label">Logo URL</label>
                <input className="input" name="logo_url" type="url" placeholder="https://logo.png" onChange={handleChange} />
              </div>
              <div>
                <label className="label">Short bio</label>
                <textarea className="textarea" name="bio" rows={4} placeholder="What you do…" onChange={handleChange}></textarea>
              </div>
              <div>
                <label className="label">Contact name</label>
                <input className="input" name="contact_name" placeholder="Jane Doe" onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Contact phone</label>
                <input className="input" name="contact_phone" placeholder="+1 555 555 5555" onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input className="input" name="instagram" placeholder="https://instagram.com/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">YouTube</label>
                <input className="input" name="youtube" placeholder="https://youtube.com/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">LinkedIn</label>
                <input className="input" name="linkedin" placeholder="https://linkedin.com/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">LINE</label>
                <input className="input" name="line" placeholder="https://line.me/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">WhatsApp</label>
                <input className="input" name="whatsapp" placeholder="https://wa.me/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">TikTok</label>
                <input className="input" name="tiktok" placeholder="https://tiktok.com/@" onChange={handleChange} />
              </div>
              <div>
                <label className="label">Little Red Book</label>
                <input className="input" name="xiaohongshu" placeholder="https://www.xiaohongshu.com/" onChange={handleChange} />
              </div>
              <div>
                <label className="label">Other social</label>
                <input className="input" name="other_social" placeholder="Link to other profile" onChange={handleChange} />
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" type="submit">Submit</button>
                <button className="btn" type="button" onClick={() => setStep(1)}>Back</button>
              </div>
            </>
          )}
        </form>
      </div>
    </Layout>
  );
}
