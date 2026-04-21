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

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  if (!body.page || !body.section_key) {
    return NextResponse.json(
      { error: "page and section_key are required" },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("content_blocks")
    .insert({
      page: body.page,
      section_key: body.section_key,
      title: body.title || null,
      body: body.body || null,
      image_url: body.image_url || null,
      display_order: body.display_order ?? 0,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error: dbError } = await supabase
    .from("content_blocks")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
