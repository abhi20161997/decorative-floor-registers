import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  const { product_id, finish_ids, size_ids, base_price } = body as {
    product_id: string;
    finish_ids: string[];
    size_ids: string[];
    base_price: number;
  };

  if (!product_id || !finish_ids?.length || !size_ids?.length) {
    return NextResponse.json(
      { error: "product_id, finish_ids, and size_ids are required" },
      { status: 400 }
    );
  }

  // Fetch existing variants to avoid duplicates
  const { data: existing } = await supabase
    .from("product_variants")
    .select("finish_id, size_id")
    .eq("product_id", product_id);

  const existingSet = new Set(
    (existing ?? []).map((v) => `${v.finish_id}::${v.size_id}`)
  );

  // Fetch finish and size names for SKU generation
  const [{ data: finishes }, { data: sizes }, { data: product }] =
    await Promise.all([
      supabase.from("finishes").select("id, name").in("id", finish_ids),
      supabase.from("sizes").select("id, label").in("id", size_ids),
      supabase
        .from("products")
        .select("name, style:styles(name)")
        .eq("id", product_id)
        .single(),
    ]);

  const finishMap = new Map(
    (finishes ?? []).map((f) => [f.id, f.name])
  );
  const sizeMap = new Map(
    (sizes ?? []).map((s) => [s.id, s.label])
  );
  const styleRaw = product?.style as unknown;
  const styleName =
    (styleRaw && typeof styleRaw === "object" && "name" in styleRaw
      ? (styleRaw as { name: string }).name
      : null) ?? "XX";

  const variants: {
    product_id: string;
    finish_id: string;
    size_id: string;
    sku: string;
    price: number;
    stock_qty: number;
    active: boolean;
  }[] = [];

  for (const finishId of finish_ids) {
    for (const sizeId of size_ids) {
      const key = `${finishId}::${sizeId}`;
      if (existingSet.has(key)) continue;

      const finishName = finishMap.get(finishId) ?? "XX";
      const sizeLabel = sizeMap.get(sizeId) ?? "XX";
      const styleCode = styleName.substring(0, 3).toUpperCase();
      const finishCode = finishName.substring(0, 3).toUpperCase();
      const sizeCode = sizeLabel.replace(/\s+/g, "").toUpperCase();
      const sku = `${styleCode}-${finishCode}-${sizeCode}`;

      variants.push({
        product_id,
        finish_id: finishId,
        size_id: sizeId,
        sku,
        price: base_price || 0,
        stock_qty: 0,
        active: true,
      });
    }
  }

  if (variants.length === 0) {
    return NextResponse.json({
      message: "All combinations already exist",
      created: 0,
    });
  }

  const { data, error: dbError } = await supabase
    .from("product_variants")
    .insert(variants)
    .select();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ created: data.length, variants: data }, { status: 201 });
}
