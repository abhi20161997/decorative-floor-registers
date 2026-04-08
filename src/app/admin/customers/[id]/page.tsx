"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, ShippingAddress } from "@/types";

type CustomerAddress = {
  id: string;
  customer_id: string;
  label: string | null;
  address: ShippingAddress;
  is_default: boolean;
  created_at: string;
};

type CustomerDetail = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  addresses: CustomerAddress[];
  orders: Order[];
};

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

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch customer");
      }

      const data: CustomerDetail = await res.json();
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading) {
    return <div className="p-8 text-center text-umber">Loading...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center text-umber">
        Customer not found.{" "}
        <Link
          href="/admin/customers"
          className="text-antique-gold hover:underline"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  const totalSpent = customer.orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/customers")}
          className="text-umber hover:text-espresso transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="font-display text-display-md text-espresso">
          {customer.name || customer.email}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg text-espresso mb-4">
              Customer Info
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                  Name
                </p>
                <p className="text-espresso font-medium">
                  {customer.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                  Email
                </p>
                <p className="text-espresso">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                    Phone
                  </p>
                  <p className="text-espresso">{customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                  Joined
                </p>
                <p className="text-espresso">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                  Total Spent
                </p>
                <p className="text-espresso font-medium">
                  {formatPrice(totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-xs text-umber uppercase tracking-wide mb-0.5">
                  Orders
                </p>
                <p className="text-espresso font-medium">
                  {customer.orders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg text-espresso mb-4">
              Addresses
            </h2>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-umber">No saved addresses.</p>
            ) : (
              <div className="space-y-4">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-linen rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {addr.label && (
                        <span className="text-xs font-medium text-espresso">
                          {addr.label}
                        </span>
                      )}
                      {addr.is_default && (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                    </div>
                    {formatAddress(addr.address).map((line, i) => (
                      <p key={i} className="text-sm text-umber">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-linen">
              <h2 className="font-display text-xl text-espresso">
                Order History
              </h2>
            </div>
            {customer.orders.length === 0 ? (
              <div className="px-6 py-12 text-center text-umber">
                No orders yet.
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
                    {customer.orders.map((order) => (
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
      </div>
    </div>
  );
}
