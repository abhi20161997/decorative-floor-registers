import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  const dateFrom = url.searchParams.get("date_from") || "";
  const dateTo = url.searchParams.get("date_to") || "";

  let query = supabase
    .from("orders")
    .select("*, order_items(id)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59.999Z");

  const { data, error: dbError } = await query;

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const headers = [
    "Order ID",
    "Date",
    "Customer Name",
    "Email",
    "Items Count",
    "Subtotal",
    "Discount",
    "Shipping",
    "Total",
    "Status",
    "Tracking Number",
  ];

  const rows = (data || []).map((order) =>
    [
      order.id,
      new Date(order.created_at).toLocaleDateString("en-US"),
      order.customer_name,
      order.customer_email,
      order.order_items?.length ?? 0,
      order.subtotal,
      order.discount_amount,
      order.shipping_cost,
      order.total,
      order.status,
      order.tracking_number,
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
