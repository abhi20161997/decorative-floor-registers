import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";
  const dateFrom = url.searchParams.get("date_from") || "";
  const dateTo = url.searchParams.get("date_to") || "";

  let query = supabase
    .from("orders")
    .select("*, order_items(id)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
    );
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo + "T23:59:59.999Z");
  }

  const { data, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Map to include item_count
  const orders = (data || []).map((order) => ({
    ...order,
    item_count: order.order_items?.length ?? 0,
    order_items: undefined,
  }));

  return NextResponse.json(orders);
}
