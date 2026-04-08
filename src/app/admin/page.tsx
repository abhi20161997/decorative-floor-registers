"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

type DashboardStats = {
  ordersToday: number;
  revenueToday: number;
  ordersThisWeek: number;
  revenueThisMonth: number;
};

type RecentOrder = Pick<
  Order,
  "id" | "created_at" | "customer_name" | "total" | "status"
> & {
  item_count: number;
};

type LowStockVariant = {
  id: string;
  sku: string;
  stock_qty: number;
  product_name: string;
  finish_name: string;
  size_label: string;
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-800",
};

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-linen rounded mb-4" />
      <div className="h-8 w-32 bg-linen rounded" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-20 bg-linen rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(null);
  const [lowStock, setLowStock] = useState<LowStockVariant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDashboardData() {
      try {
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();
        const weekAgo = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();
        const monthAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        // Fetch all stats in parallel
        const [
          todayOrdersRes,
          weekOrdersRes,
          recentOrdersRes,
          lowStockRes,
        ] = await Promise.all([
          // Orders today (also used for revenue today)
          supabase
            .from("orders")
            .select("id, total, status")
            .gte("created_at", todayStart),

          // Orders this week
          supabase
            .from("orders")
            .select("id")
            .gte("created_at", weekAgo),

          // Recent 10 orders
          supabase
            .from("orders")
            .select("id, created_at, customer_name, total, status")
            .order("created_at", { ascending: false })
            .limit(10),

          // Low stock variants
          supabase
            .from("product_variants")
            .select(
              "id, sku, stock_qty, product:products(name), finish:finishes(name), size:sizes(label)"
            )
            .not("stock_qty", "is", null)
            .lt("stock_qty", 5)
            .eq("active", true),
        ]);

        // Calculate stats from today's orders
        const todayOrders = todayOrdersRes.data ?? [];
        const ordersToday = todayOrders.length;
        const revenueToday = todayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.total ?? 0), 0);

        // Orders this week
        const ordersThisWeek = weekOrdersRes.data?.length ?? 0;

        // Revenue this month - fetch separately since we need a different date range
        const monthOrdersRes = await supabase
          .from("orders")
          .select("total, status")
          .gte("created_at", monthAgo);

        const monthOrders = monthOrdersRes.data ?? [];
        const revenueThisMonth = monthOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.total ?? 0), 0);

        setStats({
          ordersToday,
          revenueToday,
          ordersThisWeek,
          revenueThisMonth,
        });

        // Process recent orders - fetch item counts
        const orders = recentOrdersRes.data ?? [];
        if (orders.length > 0) {
          const orderIds = orders.map((o) => o.id);
          const { data: itemCounts } = await supabase
            .from("order_items")
            .select("order_id, quantity")
            .in("order_id", orderIds);

          const countMap: Record<string, number> = {};
          (itemCounts ?? []).forEach((item) => {
            countMap[item.order_id] =
              (countMap[item.order_id] ?? 0) + item.quantity;
          });

          setRecentOrders(
            orders.map((o) => ({
              ...o,
              item_count: countMap[o.id] ?? 0,
            }))
          );
        } else {
          setRecentOrders([]);
        }

        // Process low stock variants
        const variants = lowStockRes.data ?? [];
        setLowStock(
          variants.map((v: Record<string, unknown>) => {
            const product = v.product as { name: string } | null;
            const finish = v.finish as { name: string } | null;
            const size = v.size as { label: string } | null;
            return {
              id: v.id as string,
              sku: v.sku as string,
              stock_qty: v.stock_qty as number,
              product_name: product?.name ?? "Unknown",
              finish_name: finish?.name ?? "Unknown",
              size_label: size?.label ?? "Unknown",
            };
          })
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      }
    }

    fetchDashboardData();
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-display-md text-espresso mb-4">
          Dashboard
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-display-md text-espresso mb-8">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats === null ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-umber uppercase tracking-wide mb-1">
                Orders Today
              </p>
              <p className="text-3xl font-display text-espresso">
                {stats.ordersToday}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-umber uppercase tracking-wide mb-1">
                Revenue Today
              </p>
              <p className="text-3xl font-display text-espresso">
                {formatPrice(stats.revenueToday)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-umber uppercase tracking-wide mb-1">
                Orders This Week
              </p>
              <p className="text-3xl font-display text-espresso">
                {stats.ordersThisWeek}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-umber uppercase tracking-wide mb-1">
                Revenue This Month
              </p>
              <p className="text-3xl font-display text-espresso">
                {formatPrice(stats.revenueThisMonth)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden">
        <div className="px-6 py-4 border-b border-linen">
          <h2 className="font-display text-xl text-espresso">Recent Orders</h2>
        </div>
        {recentOrders === null ? (
          <table className="w-full">
            <tbody>
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-umber">
            No orders yet. They will appear here once customers start placing
            orders.
          </div>
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-linen/50 hover:bg-ivory/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-antique-gold hover:underline"
                      >
                        {order.id.substring(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-espresso">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {order.item_count > 0 ? order.item_count : "\u2014"}
                    </td>
                    <td className="px-4 py-3 font-medium text-espresso">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alerts & Quick Actions side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-linen">
            <h2 className="font-display text-xl text-espresso">
              Low Stock Alerts
            </h2>
          </div>
          {lowStock === null ? (
            <div className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-full bg-linen rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : lowStock.length === 0 ? (
            <div className="px-6 py-12 text-center text-umber">
              No low stock items. All variants have adequate inventory.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-linen text-left">
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Variant
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      SKU
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((variant) => (
                    <tr
                      key={variant.id}
                      className="border-b border-linen/50"
                    >
                      <td className="px-4 py-3 text-espresso">
                        {variant.product_name} / {variant.finish_name} /{" "}
                        {variant.size_label}
                      </td>
                      <td className="px-4 py-3 font-mono text-umber text-xs">
                        {variant.sku}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            variant.stock_qty === 0
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {variant.stock_qty} left
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display text-xl text-espresso mb-5">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products"
              className="block w-full text-center px-4 py-3 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors"
            >
              Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="block w-full text-center px-4 py-3 rounded-lg border border-espresso text-espresso font-medium hover:bg-espresso hover:text-white transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/admin/content"
              className="block w-full text-center px-4 py-3 rounded-lg border border-umber text-umber font-medium hover:bg-umber hover:text-white transition-colors"
            >
              Edit Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
