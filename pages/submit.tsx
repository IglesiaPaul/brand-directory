import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Submit() {
  const [form, setForm] = useState({
    brand_name: "",
    email: "",
    website: "",
    bio: "",
    primary_hex: "#000000",
    secondary_hex: "#ffffff"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("brand_submissions").insert([form]);
    if (error) {
      console.error(error);
      alert("Submission error (check console).");
    } else {
      alert("Submitted!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit your brand</h1>
      <input name="brand_name" placeholder="Brand name" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="website" placeholder="Website" onChange={handleChange} />
      <textarea name="bio" placeholder="Short bio" onChange={handleChange}></textarea>
      <input name="primary_hex" placeholder="Primary color hex" onChange={handleChange} />
      <input name="secondary_hex" placeholder="Secondary color hex" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
