import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: tsx scripts/create-admin.ts <email> <password>");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  // 1. Check if the Auth user already exists
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === email);

  let userId: string;

  if (found) {
    console.log(`Auth user already exists: ${email} (id=${found.id})`);
    // Rotate password to the one provided so the user can log in
    const { error: updateErr } = await supabase.auth.admin.updateUserById(
      found.id,
      { password }
    );
    if (updateErr) {
      console.error("Failed to update password:", updateErr.message);
      process.exit(1);
    }
    console.log("Password updated.");
    userId = found.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      console.error("Failed to create auth user:", error.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Created auth user: ${email} (id=${userId})`);
  }

  // 2. Ensure admin_users row
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminRow) {
    console.log("admin_users row already present.");
  } else {
    const { error: insertErr } = await supabase
      .from("admin_users")
      .insert({ user_id: userId, email, role: "admin" });
    if (insertErr) {
      console.error("Failed to insert admin_users row:", insertErr.message);
      process.exit(1);
    }
    console.log("admin_users row inserted.");
  }

  console.log("\nDone. You can now log in at /admin/login.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
