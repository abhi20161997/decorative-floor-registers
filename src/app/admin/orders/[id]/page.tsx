"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus, ShippingAddress } from "@/types";

type OrderDetail = Order & { order_items: OrderItem[] };

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatAddress(addr: ShippingAddress) {
  const parts = [addr.line1];
  if (addr.line2) parts.push(addr.line2);
  parts.push(`${addr.city}, ${addr.state} ${addr.zip}`);
  if (addr.country && addr.country !== "US") parts.push(addr.country);
  return parts;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  const fetchOrder = useCallback(async () => {
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    const orderData = data as unknown as OrderDetail;
    setOrder(orderData);
    setNewStatus(orderData.status);
    setTrackingNumber(orderData.tracking_number || "");
    setNotes(orderData.notes || "");
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          tracking_number: trackingNumber || null,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      await fetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-umber">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-umber">
        Order not found.{" "}
        <Link href="/admin/orders" className="text-antique-gold hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-umber hover:text-espresso transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="font-display text-display-md text-espresso">
          Order {order.id.slice(0, 8)}...
        </h1>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
            STATUS_COLORS[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Shipping */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg text-espresso mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-1">
                  Name
                </p>
                <p className="text-espresso font-medium">
                  {order.customer_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-espresso">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-1">
                  Shipping Address
                </p>
                {order.shipping_address ? (
                  formatAddress(order.shipping_address).map((line, i) => (
                    <p key={i} className="text-espresso">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-umber">No address</p>
                )}
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-1">
                  Order Date
                </p>
                <p className="text-espresso">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-linen">
              <h2 className="font-display text-lg text-espresso">
                Order Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-linen text-left">
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Product
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Variant
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs text-right">
                      Qty
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs text-right">
                      Price
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs text-right">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-linen/50"
                    >
                      <td className="px-4 py-3 text-espresso font-medium">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {item.variant_desc}
                      </td>
                      <td className="px-4 py-3 text-umber text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-umber text-right">
                        {formatPrice(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-espresso text-right font-medium">
                        {formatPrice(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div className="p-6 border-t border-linen bg-ivory/30">
              <div className="max-w-xs ml-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-umber">Subtotal</span>
                  <span className="text-espresso">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-umber">
                      Discount{" "}
                      {order.discount_code && (
                        <span className="text-xs">({order.discount_code})</span>
                      )}
                    </span>
                    <span className="text-green-600">
                      -{formatPrice(order.discount_amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-umber">Shipping</span>
                  <span className="text-espresso">
                    {order.shipping_cost === 0
                      ? "Free"
                      : formatPrice(order.shipping_cost)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-umber">Tax</span>
                    <span className="text-espresso">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium border-t border-linen pt-2 mt-2">
                  <span className="text-espresso">Total</span>
                  <span className="text-espresso">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Status update */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg text-espresso mb-4">
              Update Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-umber uppercase tracking-wide mb-1">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full rounded-md border border-linen bg-white px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-umber uppercase tracking-wide mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="w-full rounded-md border border-linen bg-white px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-umber uppercase tracking-wide mb-1">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes..."
                  className="w-full rounded-md border border-linen bg-white px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold resize-none"
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Order"}
              </button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg text-espresso mb-4">
              Payment
            </h2>
            <div className="space-y-3 text-sm">
              {order.stripe_payment_intent_id && (
                <div>
                  <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                    Stripe Payment Intent
                  </p>
                  <p className="text-espresso font-mono text-xs break-all">
                    {order.stripe_payment_intent_id}
                  </p>
                </div>
              )}
              {order.stripe_session_id && (
                <div>
                  <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                    Stripe Session
                  </p>
                  <p className="text-espresso font-mono text-xs break-all">
                    {order.stripe_session_id}
                  </p>
                </div>
              )}
              {!order.stripe_payment_intent_id &&
                !order.stripe_session_id && (
                  <p className="text-umber">No payment info available.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
