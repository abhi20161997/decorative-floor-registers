import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

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
    .from("discount_codes")
    .insert({
      code: body.code?.toUpperCase(),
      type: body.type,
      value: body.value,
      min_order_total: body.min_order_total || null,
      max_uses: body.max_uses || null,
      expires_at: body.expires_at || null,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.code !== undefined) updates.code = body.code.toUpperCase();
  if (body.type !== undefined) updates.type = body.type;
  if (body.value !== undefined) updates.value = body.value;
  if (body.min_order_total !== undefined)
    updates.min_order_total = body.min_order_total || null;
  if (body.max_uses !== undefined) updates.max_uses = body.max_uses || null;
  if (body.expires_at !== undefined)
    updates.expires_at = body.expires_at || null;
  if (body.active !== undefined) updates.active = body.active;

  const { data, error: dbError } = await supabase
    .from("discount_codes")
    .update(updates)
    .eq("id", body.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
