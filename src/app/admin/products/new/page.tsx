"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import type { Category, Style } from "@/types";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    style_id: "",
    description: "",
    base_price: "",
    meta_title: "",
    meta_description: "",
    active: true,
  });

  const [showSeo, setShowSeo] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("display_order"),
      supabase
        .from("styles")
        .select("*")
        .eq("active", true)
        .order("display_order"),
    ]).then(([catRes, styleRes]) => {
      setCategories(catRes.data ?? []);
      setStyles(styleRes.data ?? []);
    });
  }, []);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && typeof value === "string") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("products")
      .insert({
        name: form.name,
        slug: form.slug,
        category_id: form.category_id || null,
        style_id: form.style_id || null,
        description: form.description || null,
        base_price: form.base_price ? parseFloat(form.base_price) : null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        active: form.active,
      })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/products/${data.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">New Product</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-umber hover:text-espresso"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Style
              </label>
              <select
                value={form.style_id}
                onChange={(e) => updateField("style_id", e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              >
                <option value="">None</option>
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              Base Price
            </label>
            <input
              type="number"
              step="0.01"
              value={form.base_price}
              onChange={(e) => updateField("base_price", e.target.value)}
              className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
              className="rounded border-linen"
            />
            <label htmlFor="active" className="text-sm text-espresso">
              Active
            </label>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="w-full px-6 py-4 text-left text-sm font-medium text-espresso flex items-center justify-between"
          >
            SEO Settings
            <span className={`transition-transform ${showSeo ? "rotate-90" : ""}`}>
              &#9654;
            </span>
          </button>
          {showSeo && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-espresso">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => updateField("meta_title", e.target.value)}
                  className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-espresso">
                  Meta Description
                </label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) =>
                    updateField("meta_description", e.target.value)
                  }
                  rows={2}
                  className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !form.name}
          className="px-6 py-2.5 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
