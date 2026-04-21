import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data: rows, error: dbError } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Enrich with last_sign_in_at from auth.users
  const { data: authList } = await supabase.auth.admin.listUsers();
  const authMap = new Map(
    (authList?.users ?? []).map((u) => [u.id, u.last_sign_in_at])
  );

  const enriched = (rows ?? []).map((r) => ({
    ...r,
    last_sign_in_at: authMap.get(r.user_id) ?? null,
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json()) as { email: string; password: string };
  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Check if auth user already exists
  const { data: authList } = await supabase.auth.admin.listUsers();
  const existing = authList?.users?.find((u) => u.email === body.email);

  let userId: string;
  if (existing) {
    userId = existing.id;
    const { error: updateErr } = await supabase.auth.admin.updateUserById(
      userId,
      { password: body.password }
    );
    if (updateErr) {
      return NextResponse.json(
        { error: `Failed to update password: ${updateErr.message}` },
        { status: 500 }
      );
    }
  } else {
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });
    if (createErr || !created.user) {
      return NextResponse.json(
        { error: `Failed to create user: ${createErr?.message}` },
        { status: 500 }
      );
    }
    userId = created.user.id;
  }

  // Ensure admin_users row
  const { data: existingAdmin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingAdmin) {
    const { error: insertErr } = await supabase
      .from("admin_users")
      .insert({ user_id: userId, email: body.email, role: "admin" });
    if (insertErr) {
      return NextResponse.json(
        { error: `Failed to insert admin row: ${insertErr.message}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, user_id: userId }, { status: 201 });
}
