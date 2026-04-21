import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const { data: customers, error: dbError } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Aggregate order totals per customer
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_id, total, status");

  const totalsByCustomer = new Map<string, { orders: number; spent: number }>();
  for (const o of orders ?? []) {
    if (!o.customer_id) continue;
    const current = totalsByCustomer.get(o.customer_id) ?? {
      orders: 0,
      spent: 0,
    };
    current.orders += 1;
    if (o.status !== "cancelled") current.spent += o.total ?? 0;
    totalsByCustomer.set(o.customer_id, current);
  }

  const headers = [
    "Customer ID",
    "Name",
    "Email",
    "Phone",
    "Joined",
    "Orders",
    "Total Spent",
  ];

  const rows = (customers || []).map((c) => {
    const agg = totalsByCustomer.get(c.id) ?? { orders: 0, spent: 0 };
    return [
      c.id,
      c.name ?? "",
      c.email,
      c.phone ?? "",
      new Date(c.created_at).toLocaleDateString("en-US"),
      agg.orders,
      agg.spent.toFixed(2),
    ]
      .map(escapeCsv)
      .join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="customers-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
