import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("content_blocks")
    .select("*")
    .order("page")
    .order("display_order", { ascending: true });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Group by page
  const grouped: Record<string, typeof data> = {};
  for (const block of data || []) {
    if (!grouped[block.page]) grouped[block.page] = [];
    grouped[block.page].push(block);
  }

  return NextResponse.json(grouped);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.title !== undefined) updates.title = body.title;
  if (body.body !== undefined) updates.body = body.body;
  if (body.image_url !== undefined) updates.image_url = body.image_url;
  if (body.meta_title !== undefined) updates.meta_title = body.meta_title;
  if (body.meta_description !== undefined)
    updates.meta_description = body.meta_description;

  const { data, error: dbError } = await supabase
    .from("content_blocks")
    .update(updates)
    .eq("id", body.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
