import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data: customers, error: dbError, count } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Fetch order stats for each customer
  const customerIds = (customers || []).map((c) => c.id);
  let orderStats: Record<string, { order_count: number; total_spent: number }> =
    {};

  if (customerIds.length > 0) {
    const { data: orders } = await supabase
      .from("orders")
      .select("customer_id, total")
      .in("customer_id", customerIds);

    if (orders) {
      for (const order of orders) {
        if (!order.customer_id) continue;
        if (!orderStats[order.customer_id]) {
          orderStats[order.customer_id] = { order_count: 0, total_spent: 0 };
        }
        orderStats[order.customer_id].order_count++;
        orderStats[order.customer_id].total_spent += order.total || 0;
      }
    }
  }

  const result = (customers || []).map((c) => ({
    ...c,
    order_count: orderStats[c.id]?.order_count ?? 0,
    total_spent: orderStats[c.id]?.total_spent ?? 0,
  }));

  return NextResponse.json({
    customers: result,
    total: count ?? 0,
    page,
    per_page: perPage,
  });
}
