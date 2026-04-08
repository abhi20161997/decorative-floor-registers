import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";

  let query = supabase
    .from("products")
    .select(
      "*, category:categories(id, name), style:styles(id, name), variants:product_variants(id)"
    )
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  const { data, error: dbError } = await supabase
    .from("products")
    .insert({
      name: body.name,
      slug: body.slug,
      category_id: body.category_id || null,
      style_id: body.style_id || null,
      description: body.description || null,
      base_price: body.base_price || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
