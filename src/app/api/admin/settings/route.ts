import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("site_settings")
    .select("*");

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Convert array to key-value object
  const settings: Record<string, unknown> = {};
  for (const row of data || []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const body = await request.json();

  if (!body.key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from("site_settings")
    .upsert({ key: body.key, value: body.value }, { onConflict: "key" })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
