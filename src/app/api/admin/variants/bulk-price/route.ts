import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  const { variant_ids, price } = body as {
    variant_ids: string[];
    price: number;
  };

  if (!variant_ids?.length || price == null) {
    return NextResponse.json(
      { error: "variant_ids and price are required" },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("product_variants")
    .update({ price, updated_at: new Date().toISOString() })
    .in("id", variant_ids)
    .select();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ updated: data.length });
}
