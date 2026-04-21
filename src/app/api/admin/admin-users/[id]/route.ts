import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

// PATCH: reset password for an admin user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAdmin();
  if (error) return error;

  const { id } = await params; // admin_users.id
  const body = (await request.json()) as { password?: string };
  if (!body.password) {
    return NextResponse.json(
      { error: "password is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: row, error: rowErr } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("id", id)
    .single();

  if (rowErr || !row) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const { error: updateErr } = await supabase.auth.admin.updateUserById(
    row.user_id,
    { password: body.password }
  );

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    reset_by: user?.email ?? null,
  });
}

// DELETE: revoke admin role (and optionally delete the auth user)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: row, error: rowErr } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .eq("id", id)
    .single();

  if (rowErr || !row) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  // Prevent self-removal (avoid locking everyone out accidentally)
  if (user?.id === row.user_id) {
    return NextResponse.json(
      { error: "You cannot remove your own admin role from here." },
      { status: 400 }
    );
  }

  // Parse query — ?deleteAuth=true also removes the Supabase auth user
  const url = new URL(request.url);
  const deleteAuth = url.searchParams.get("deleteAuth") === "true";

  const { error: delErr } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  if (deleteAuth) {
    await supabase.auth.admin.deleteUser(row.user_id);
  }

  return NextResponse.json({ success: true, deletedAuth: deleteAuth });
}
