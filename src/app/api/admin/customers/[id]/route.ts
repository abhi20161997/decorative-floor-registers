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

  const { data: customer, error: custError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (custError) {
    return NextResponse.json({ error: custError.message }, { status: 500 });
  }

  const { data: addresses } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("customer_id", id)
    .order("is_default", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    ...customer,
    addresses: addresses || [],
    orders: orders || [],
  });
}
