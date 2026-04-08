"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

type OrderRow = Order & { item_count: number };

const STATUS_TABS: { label: string; value: OrderStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const supabase = createClient();

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

    const { data, error: dbError } = await query;

    if (dbError) {
      setError(dbError.message);
      return;
    }

    const mapped = (data || []).map((order) => ({
      ...order,
      item_count: order.order_items?.length ?? 0,
      order_items: undefined,
    })) as OrderRow[];

    setOrders(mapped);
  }, [status, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">Orders</h1>
        <a
          href={`/api/admin/export/orders${status ? `?status=${status}` : ""}`}
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-espresso text-white"
                : "text-umber hover:bg-linen"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-linen bg-white px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {orders === null ? (
          <div className="p-8 text-center text-umber">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-umber">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-linen text-left">
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Order #
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Items
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Total
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-linen/50 hover:bg-ivory/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-espresso">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-espresso font-medium">
                        {order.customer_name}
                      </div>
                      <div className="text-umber text-xs">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-umber">{order.item_count}</td>
                    <td className="px-4 py-3 text-espresso font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-antique-gold hover:underline text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
