"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type CustomerRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
};

type CustomersResponse = {
  customers: CustomerRow[];
  total: number;
  page: number;
  per_page: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch customers");
      }

      const data: CustomersResponse = await res.json();
      setCustomers(data.customers);
      setTotalPages(Math.ceil(data.total / data.per_page) || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    }
  }, [search, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Customers
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md rounded-md border border-linen bg-white px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {customers === null ? (
          <div className="p-8 text-center text-umber">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-umber">No customers found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-linen text-left">
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Name
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Email
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Orders
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Total Spent
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Joined
                    </th>
                    <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-linen/50 hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="text-espresso font-medium hover:text-antique-gold"
                        >
                          {customer.name || "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {customer.email}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {customer.order_count}
                      </td>
                      <td className="px-4 py-3 text-espresso font-medium">
                        {formatPrice(customer.total_spent)}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/customers/${customer.id}`}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-linen">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md text-sm border border-linen text-umber hover:bg-linen disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-umber">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md text-sm border border-linen text-umber hover:bg-linen disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
