import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("sizes")
    .select("*")
    .order("display_order", { ascending: true });

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
    .from("sizes")
    .insert({
      label: body.label,
      width_inches: body.width_inches,
      height_inches: body.height_inches,
      display_order: body.display_order ?? 0,
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

  const { data, error: dbError } = await supabase
    .from("sizes")
    .update({
      label: body.label,
      width_inches: body.width_inches,
      height_inches: body.height_inches,
      display_order: body.display_order ?? 0,
      active: body.active,
      updated_at: new Date().toISOString(),
    })
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
  const body = await request.json();

  const { error: dbError } = await supabase
    .from("sizes")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", body.id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
