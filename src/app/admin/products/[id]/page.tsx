"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, formatPrice } from "@/lib/utils";
import type { Category, Style, Finish, Size, ProductVariant, ProductImage } from "@/types";

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
  cad_url: string | null;
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
  const [images, setImages] = useState<ProductImage[]>([]);
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

  // Image upload
  const [uploadingFinishId, setUploadingFinishId] = useState<string | null>(null);
  const [uploadSizeByFinish, setUploadSizeByFinish] = useState<
    Record<string, string>
  >({}); // "" = All sizes (size_id NULL)
  const [uploadingCad, setUploadingCad] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    style_id: "",
    description: "",
    base_price: "",
    meta_title: "",
    meta_description: "",
    cad_url: "",
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
      cad_url: p.cad_url ?? "",
      active: p.active,
    });
  }, [id]);

  const fetchImages = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("display_order", { ascending: true });
    setImages((data ?? []) as ProductImage[]);
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
    fetchImages();
  }, [fetchProduct, fetchImages]);

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
        cad_url: form.cad_url || null,
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

  const deleteVariant = async (variantId: string) => {
    if (!confirm("Delete this variant? This cannot be undone.")) return;
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", variantId);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setSelectedVariants((prev) => {
      const next = new Set(prev);
      next.delete(variantId);
      return next;
    });
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

  // --- Image upload/manage helpers ---

  // Bust ISR cache for this product's PDP so admin image edits show instantly.
  const revalidateStorefront = useCallback(async () => {
    if (!product?.slug) return;
    try {
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paths: [`/shop/${product.slug}`, "/shop"],
        }),
      });
    } catch {
      // Non-fatal — cache will still refresh via ISR interval.
    }
  }, [product?.slug]);

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  const handleImageUpload = async (
    files: FileList | null,
    finishId: string
  ) => {
    if (!files || files.length === 0) return;
    setUploadingFinishId(finishId);
    setError(null);
    const supabase = createClient();

    try {
      // Find current max display_order for this (product, finish)
      const currentMax = Math.max(
        0,
        ...images
          .filter((i) => i.finish_id === finishId)
          .map((i) => i.display_order)
      );

      const targetSizeId = uploadSizeByFinish[finishId] || null;

      const rows: {
        product_id: string;
        finish_id: string;
        size_id: string | null;
        image_url: string;
        alt_text: string;
        display_order: number;
        is_primary: boolean;
      }[] = [];
      let order = currentMax + 1;

      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        rows.push({
          product_id: id,
          finish_id: finishId,
          size_id: targetSizeId,
          image_url: url,
          alt_text: product?.name ?? file.name,
          display_order: order,
          is_primary: false,
        });
        order += 1;
      }

      const { error: dbError } = await supabase
        .from("product_images")
        .insert(rows);
      if (dbError) throw new Error(dbError.message);
      fetchImages();
      revalidateStorefront();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingFinishId(null);
    }
  };

  const handleCadUpload = async (file: File) => {
    setUploadingCad(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      updateField("cad_url", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "CAD upload failed");
    } finally {
      setUploadingCad(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    fetchImages();
    revalidateStorefront();
  };

  const setPrimaryImage = async (
    imageId: string,
    finishId: string | null,
    sizeId: string | null
  ) => {
    const supabase = createClient();
    // One primary per (finish, size) scope — otherwise size-specific primaries
    // would fight with finish-general primaries.
    let query = supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", id);
    query = finishId ? query.eq("finish_id", finishId) : query.is("finish_id", null);
    query = sizeId ? query.eq("size_id", sizeId) : query.is("size_id", null);
    await query;
    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId);
    fetchImages();
    revalidateStorefront();
  };

  const updateImageSize = async (imageId: string, sizeId: string) => {
    const supabase = createClient();
    await supabase
      .from("product_images")
      .update({ size_id: sizeId || null })
      .eq("id", imageId);
    fetchImages();
    revalidateStorefront();
  };

  const moveImage = async (imageId: string, direction: -1 | 1) => {
    const current = images.find((i) => i.id === imageId);
    if (!current) return;
    const siblings = images
      .filter((i) => i.finish_id === current.finish_id)
      .sort((a, b) => a.display_order - b.display_order);
    const index = siblings.findIndex((i) => i.id === imageId);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    const other = siblings[swapIndex];

    const supabase = createClient();
    await Promise.all([
      supabase
        .from("product_images")
        .update({ display_order: other.display_order })
        .eq("id", current.id),
      supabase
        .from("product_images")
        .update({ display_order: current.display_order })
        .eq("id", other.id),
    ]);
    fetchImages();
    revalidateStorefront();
  };

  const updateImageAlt = async (imageId: string, alt: string) => {
    const supabase = createClient();
    await supabase
      .from("product_images")
      .update({ alt_text: alt })
      .eq("id", imageId);
    fetchImages();
    revalidateStorefront();
  };

  if (!product && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-espresso border-t-transparent" />
      </div>
    );
  }

  // Group images by finish for rendering (include "unassigned" = null)
  const finishesUsedOnVariants = new Set(
    product?.variants?.map((v) => v.finish_id).filter(Boolean) ?? []
  );
  const imageFinishIds = Array.from(
    new Set([
      ...Array.from(finishesUsedOnVariants),
      ...images.map((i) => i.finish_id).filter((x): x is string => !!x),
    ])
  );
  const finishById = new Map(allFinishes.map((f) => [f.id, f]));

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

          {/* CAD URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              CAD Drawing PDF URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.cad_url}
                onChange={(e) => updateField("cad_url", e.target.value)}
                placeholder="Paste URL or upload a PDF"
                className="flex-1 rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
              <label className="cursor-pointer rounded-md border border-espresso bg-white px-3 py-2 text-sm text-espresso hover:bg-espresso hover:text-white transition-colors">
                {uploadingCad ? "Uploading..." : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploadingCad}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCadUpload(f);
                  }}
                />
              </label>
              {form.cad_url && (
                <a
                  href={form.cad_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-linen px-3 py-2 text-sm text-umber hover:text-espresso"
                >
                  View
                </a>
              )}
            </div>
            <p className="mt-1 text-xs text-umber">
              Leave empty to hide the &quot;Download CAD Drawing&quot; button on
              the PDP. Remember to click Save after uploading.
            </p>
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

      {/* Product Images */}
      <div className="mt-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-linen">
            <h2 className="font-display text-xl text-espresso">
              Product Images
            </h2>
            <p className="text-xs text-umber mt-1">
              Upload images per finish. To show a different photo when a
              specific size is selected, set the size on each image (or pick a
              size before uploading). Leave size as <em>All sizes</em> for the
              default/finish-wide image.
            </p>
          </div>

          {imageFinishIds.length === 0 ? (
            <div className="px-6 py-12 text-center text-umber text-sm">
              Generate variants first so you can upload images per finish.
            </div>
          ) : (
            <div className="divide-y divide-linen">
              {imageFinishIds.map((finishId) => {
                const finish = finishById.get(finishId);
                const finishImages = images
                  .filter((i) => i.finish_id === finishId)
                  .sort((a, b) => a.display_order - b.display_order);
                return (
                  <div key={finishId} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {finish?.hex_color && (
                          <span
                            className="w-4 h-4 rounded-full inline-block border border-linen"
                            style={{ backgroundColor: finish.hex_color }}
                          />
                        )}
                        <span className="font-medium text-espresso">
                          {finish?.name ?? "Unknown finish"}
                        </span>
                        <span className="text-xs text-umber">
                          ({finishImages.length}{" "}
                          {finishImages.length === 1 ? "image" : "images"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={uploadSizeByFinish[finishId] ?? ""}
                          onChange={(e) =>
                            setUploadSizeByFinish((prev) => ({
                              ...prev,
                              [finishId]: e.target.value,
                            }))
                          }
                          className="rounded-md border border-linen bg-ivory px-2 py-1.5 text-xs text-espresso focus:border-antique-gold focus:outline-none"
                          title="Size the uploaded images will be tagged with"
                        >
                          <option value="">All sizes</option>
                          {allSizes.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <label className="cursor-pointer rounded-md border border-espresso bg-white px-3 py-1.5 text-xs text-espresso hover:bg-espresso hover:text-white transition-colors">
                          {uploadingFinishId === finishId
                            ? "Uploading..."
                            : "Upload Images"}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={uploadingFinishId === finishId}
                            onChange={(e) =>
                              handleImageUpload(e.target.files, finishId)
                            }
                          />
                        </label>
                      </div>
                    </div>
                    {finishImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {finishImages.map((img, idx) => (
                          <div
                            key={img.id}
                            className="relative group rounded-lg border border-linen overflow-hidden bg-ivory"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.image_url}
                              alt={img.alt_text ?? ""}
                              className="aspect-square w-full object-cover"
                            />
                            {img.is_primary && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] uppercase font-medium rounded bg-antique-gold text-white">
                                Primary
                              </span>
                            )}
                            <span
                              className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-medium rounded ${
                                img.size_id
                                  ? "bg-espresso text-white"
                                  : "bg-linen text-espresso"
                              }`}
                            >
                              {img.size_id
                                ? allSizes.find((s) => s.id === img.size_id)
                                    ?.label ?? "?"
                                : "All sizes"}
                            </span>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex flex-col items-center justify-center gap-1 p-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveImage(img.id, -1)}
                                  disabled={idx === 0}
                                  className="px-2 py-0.5 rounded bg-white/20 text-white text-xs hover:bg-white/40 disabled:opacity-30"
                                  title="Move up"
                                >
                                  ←
                                </button>
                                <button
                                  onClick={() => moveImage(img.id, 1)}
                                  disabled={idx === finishImages.length - 1}
                                  className="px-2 py-0.5 rounded bg-white/20 text-white text-xs hover:bg-white/40 disabled:opacity-30"
                                  title="Move down"
                                >
                                  →
                                </button>
                              </div>
                              {!img.is_primary && (
                                <button
                                  onClick={() =>
                                    setPrimaryImage(
                                      img.id,
                                      img.finish_id,
                                      img.size_id
                                    )
                                  }
                                  className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] uppercase hover:bg-white/40"
                                >
                                  Make Primary
                                </button>
                              )}
                              <button
                                onClick={() => deleteImage(img.id)}
                                className="px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] uppercase hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                            <select
                              value={img.size_id ?? ""}
                              onChange={(e) =>
                                updateImageSize(img.id, e.target.value)
                              }
                              className="w-full text-[10px] px-2 py-1 border-t border-linen bg-white text-espresso focus:outline-none focus:border-antique-gold"
                              title="Which size this image represents"
                            >
                              <option value="">All sizes (default)</option>
                              {allSizes.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              defaultValue={img.alt_text ?? ""}
                              placeholder="Alt text"
                              onBlur={(e) =>
                                updateImageAlt(img.id, e.target.value)
                              }
                              className="w-full text-[10px] px-2 py-1 border-t border-linen bg-white text-espresso focus:outline-none focus:border-antique-gold"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
                    <th className="px-4 py-3 w-12"></th>
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
                      <td className="px-4 py-2 text-espresso">
                        <span className="inline-flex items-center gap-1.5">
                          {variant.finish?.hex_color && (
                            <span
                              className="w-3 h-3 rounded-full inline-block border border-linen"
                              style={{
                                backgroundColor: variant.finish.hex_color,
                              }}
                            />
                          )}
                          {variant.finish?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-umber">
                        {variant.size?.label ?? "—"}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          defaultValue={variant.sku}
                          onBlur={(e) =>
                            updateVariantInline(variant.id, "sku", e.target.value)
                          }
                          className="w-32 rounded border border-linen bg-ivory px-2 py-1 text-xs font-mono text-espresso focus:border-antique-gold focus:outline-none"
                        />
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
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => deleteVariant(variant.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                          title="Delete variant"
                        >
                          Delete
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
          {images.length} images &middot;{" "}
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
