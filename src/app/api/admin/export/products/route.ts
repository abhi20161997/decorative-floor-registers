import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("product_variants")
    .select(
      "sku, price, stock_qty, active, product:products(name, slug, active), finish:finishes(name), size:sizes(label)"
    )
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const rows = (data || []).map((v: any) => {
    const product = v.product as { name: string; slug: string; active: boolean } | null;
    const finish = v.finish as { name: string } | null;
    const size = v.size as { label: string } | null;
    return [
      product?.name ?? "",
      product?.slug ?? "",
      finish?.name ?? "",
      size?.label ?? "",
      v.sku,
      v.price,
      v.stock_qty ?? "",
      v.active ? "yes" : "no",
      product?.active ? "yes" : "no",
    ]
      .map(escapeCsv)
      .join(",");
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const headers = [
    "Product Name",
    "Product Slug",
    "Finish",
    "Size",
    "SKU",
    "Price",
    "Stock",
    "Variant Active",
    "Product Active",
  ];

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="products-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
