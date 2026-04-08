import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!adminUser) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
}
