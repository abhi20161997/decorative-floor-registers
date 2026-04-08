import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("products")
    .select(
      "*, category:categories(id, name), style:styles(id, name), variants:product_variants(*, finish:finishes(*), size:sizes(*)), images:product_images(*)"
    )
    .eq("id", id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json();

  const { data, error: dbError } = await supabase
    .from("products")
    .update({
      name: body.name,
      slug: body.slug,
      category_id: body.category_id || null,
      style_id: body.style_id || null,
      description: body.description || null,
      base_price: body.base_price || null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      active: body.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();

  const { error: dbError } = await supabase
    .from("products")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
