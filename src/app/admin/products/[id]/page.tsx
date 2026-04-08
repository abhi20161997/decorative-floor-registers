"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, formatPrice } from "@/lib/utils";
import type { Category, Style, Finish, Size, ProductVariant } from "@/types";

type VariantRow = ProductVariant & {
  finish: Finish;
  size: Size;
};

type ProductData = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  style_id: string | null;
  description: string | null;
  base_price: number | null;
  meta_title: string | null;
  meta_description: string | null;
  active: boolean;
  variants: VariantRow[];
};

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [allFinishes, setAllFinishes] = useState<Finish[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSeo, setShowSeo] = useState(false);

  // Variant generation
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [genPrice, setGenPrice] = useState("");
  const [generating, setGenerating] = useState(false);

  // Bulk price
  const [showBulkPrice, setShowBulkPrice] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(
    new Set()
  );
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);

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

  const fetchProduct = useCallback(async () => {
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("products")
      .select(
        "*, variants:product_variants(*, finish:finishes(*), size:sizes(*))"
      )
      .eq("id", id)
      .single();

    if (dbError) {
      setError("Product not found");
      return;
    }

    const p = data as unknown as ProductData;
    setProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      category_id: p.category_id ?? "",
      style_id: p.style_id ?? "",
      description: p.description ?? "",
      base_price: p.base_price?.toString() ?? "",
      meta_title: p.meta_title ?? "",
      meta_description: p.meta_description ?? "",
      active: p.active,
    });
  }, [id]);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("categories").select("*").eq("active", true).order("display_order"),
      supabase.from("styles").select("*").eq("active", true).order("display_order"),
      supabase.from("finishes").select("*").eq("active", true).order("display_order"),
      supabase.from("sizes").select("*").eq("active", true).order("display_order"),
    ]).then(([catRes, styleRes, finishRes, sizeRes]) => {
      setCategories(catRes.data ?? []);
      setStyles(styleRes.data ?? []);
      setAllFinishes(finishRes.data ?? []);
      setAllSizes(sizeRes.data ?? []);
    });

    fetchProduct();
  }, [fetchProduct]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && typeof value === "string") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("products")
      .update({
        name: form.name,
        slug: form.slug,
        category_id: form.category_id || null,
        style_id: form.style_id || null,
        description: form.description || null,
        base_price: form.base_price ? parseFloat(form.base_price) : null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        active: form.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setSuccess("Product saved successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleGenerateVariants = async () => {
    if (!selectedFinishes.length || !selectedSizes.length) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: id,
          finish_ids: selectedFinishes,
          size_ids: selectedSizes,
          base_price: genPrice ? parseFloat(genPrice) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowGenerate(false);
      setSelectedFinishes([]);
      setSelectedSizes([]);
      setGenPrice("");
      fetchProduct();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate variants");
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkPrice = async () => {
    if (!selectedVariants.size || !bulkPrice) return;
    setBulkUpdating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/variants/bulk-price", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_ids: Array.from(selectedVariants),
          price: parseFloat(bulkPrice),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowBulkPrice(false);
      setSelectedVariants(new Set());
      setBulkPrice("");
      fetchProduct();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update prices");
    } finally {
      setBulkUpdating(false);
    }
  };

  const updateVariantInline = async (
    variantId: string,
    field: string,
    value: string | boolean
  ) => {
    const supabase = createClient();
    let updateValue: number | boolean | string;

    if (field === "price" || field === "stock_qty") {
      updateValue = parseFloat(value as string) || 0;
    } else {
      updateValue = value;
    }

    await supabase
      .from("product_variants")
      .update({
        [field]: updateValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", variantId);

    fetchProduct();
  };

  const toggleVariantSelection = (variantId: string) => {
    setSelectedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) next.delete(variantId);
      else next.add(variantId);
      return next;
    });
  };

  if (!product && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Edit Product
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/products")}
            className="text-sm text-umber hover:text-espresso"
          >
            Back to Products
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
          {success}
        </div>
      )}

      {/* Product Form */}
      <form
        id="product-form"
        onSubmit={handleSave}
        className="space-y-6 max-w-4xl"
      >
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <span
              className={`transition-transform ${showSeo ? "rotate-90" : ""}`}
            >
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
      </form>

      {/* Variant Management */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-linen flex items-center justify-between">
            <h2 className="font-display text-xl text-espresso">Variants</h2>
            <div className="flex gap-2">
              {selectedVariants.size > 0 && (
                <button
                  onClick={() => setShowBulkPrice(!showBulkPrice)}
                  className="px-3 py-1.5 text-xs rounded-md border border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-white transition-colors"
                >
                  Bulk Price ({selectedVariants.size})
                </button>
              )}
              <button
                onClick={() => setShowGenerate(!showGenerate)}
                className="px-3 py-1.5 text-xs rounded-md bg-espresso text-white hover:bg-espresso/90 transition-colors"
              >
                Generate Variants
              </button>
            </div>
          </div>

          {/* Bulk Price Panel */}
          {showBulkPrice && (
            <div className="px-6 py-4 bg-ivory border-b border-linen flex items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso">
                  New Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  className="rounded-md border border-linen bg-white px-3 py-1.5 text-sm text-espresso w-32 focus:border-antique-gold focus:outline-none"
                />
              </div>
              <button
                onClick={handleBulkPrice}
                disabled={bulkUpdating || !bulkPrice}
                className="px-3 py-1.5 text-xs rounded-md bg-antique-gold text-white hover:bg-antique-gold/90 disabled:opacity-50"
              >
                {bulkUpdating ? "Updating..." : "Apply"}
              </button>
              <button
                onClick={() => {
                  setShowBulkPrice(false);
                  setSelectedVariants(new Set());
                }}
                className="px-3 py-1.5 text-xs text-umber hover:text-espresso"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Generate Variants Panel */}
          {showGenerate && (
            <div className="px-6 py-4 bg-ivory border-b border-linen space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-espresso">
                    Finishes
                  </label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {allFinishes.map((f) => (
                      <label key={f.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedFinishes.includes(f.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFinishes((prev) => [...prev, f.id]);
                            } else {
                              setSelectedFinishes((prev) =>
                                prev.filter((fid) => fid !== f.id)
                              );
                            }
                          }}
                          className="rounded border-linen"
                        />
                        {f.hex_color && (
                          <span
                            className="w-3 h-3 rounded-full inline-block border border-linen"
                            style={{ backgroundColor: f.hex_color }}
                          />
                        )}
                        {f.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-espresso">
                    Sizes
                  </label>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {allSizes.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSizes((prev) => [...prev, s.id]);
                            } else {
                              setSelectedSizes((prev) =>
                                prev.filter((sid) => sid !== s.id)
                              );
                            }
                          }}
                          className="rounded border-linen"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-espresso">
                    Default Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={genPrice}
                    onChange={(e) => setGenPrice(e.target.value)}
                    placeholder={form.base_price || "0.00"}
                    className="rounded-md border border-linen bg-white px-3 py-1.5 text-sm text-espresso w-32 focus:border-antique-gold focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleGenerateVariants}
                  disabled={
                    generating ||
                    !selectedFinishes.length ||
                    !selectedSizes.length
                  }
                  className="px-3 py-1.5 text-xs rounded-md bg-espresso text-white hover:bg-espresso/90 disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate"}
                </button>
                <button
                  onClick={() => setShowGenerate(false)}
                  className="px-3 py-1.5 text-xs text-umber hover:text-espresso"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Variants Table */}
          {product?.variants && product.variants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-linen text-left">
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={
                          selectedVariants.size === product.variants.length &&
                          product.variants.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVariants(
                              new Set(product.variants.map((v) => v.id))
                            );
                          } else {
                            setSelectedVariants(new Set());
                          }
                        }}
                        className="rounded border-linen"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Finish
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Size
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      SKU
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Price
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Stock
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr
                      key={variant.id}
                      className="border-b border-linen/50 hover:bg-ivory/50"
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedVariants.has(variant.id)}
                          onChange={() => toggleVariantSelection(variant.id)}
                          className="rounded border-linen"
                        />
                      </td>
                      <td className="px-4 py-2 text-espresso flex items-center gap-1.5">
                        {variant.finish?.hex_color && (
                          <span
                            className="w-3 h-3 rounded-full inline-block border border-linen"
                            style={{
                              backgroundColor: variant.finish.hex_color,
                            }}
                          />
                        )}
                        {variant.finish?.name ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-umber">
                        {variant.size?.label ?? "—"}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-umber">
                        {variant.sku}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={variant.price}
                          onBlur={(e) =>
                            updateVariantInline(
                              variant.id,
                              "price",
                              e.target.value
                            )
                          }
                          className="w-24 rounded border border-linen bg-ivory px-2 py-1 text-sm text-espresso focus:border-antique-gold focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          defaultValue={variant.stock_qty ?? 0}
                          onBlur={(e) =>
                            updateVariantInline(
                              variant.id,
                              "stock_qty",
                              e.target.value
                            )
                          }
                          className="w-20 rounded border border-linen bg-ivory px-2 py-1 text-sm text-espresso focus:border-antique-gold focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() =>
                            updateVariantInline(
                              variant.id,
                              "active",
                              !variant.active
                            )
                          }
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                            variant.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {variant.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-umber">
              No variants yet. Use &quot;Generate Variants&quot; to create
              finish/size combinations.
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      {product && (
        <div className="mt-4 max-w-4xl text-xs text-umber">
          Product ID: {product.id} &middot;{" "}
          {product.variants?.length ?? 0} variants &middot;{" "}
          Min price:{" "}
          {product.variants?.length
            ? formatPrice(
                Math.min(...product.variants.map((v) => v.price))
              )
            : "—"}{" "}
          &middot; Max price:{" "}
          {product.variants?.length
            ? formatPrice(
                Math.max(...product.variants.map((v) => v.price))
              )
            : "—"}
        </div>
      )}
    </div>
  );
}
