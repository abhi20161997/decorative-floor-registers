"use client";

import { useEffect, useState, useCallback } from "react";
import type { DiscountCode } from "@/types";

const emptyForm = {
  code: "",
  type: "percentage" as "percentage" | "fixed",
  value: 0,
  min_order_total: "",
  max_uses: "",
  expires_at: "",
  active: true,
};

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/discounts");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data: DiscountCode[] = await res.json();
      setDiscounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discounts");
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const updateField = (
    field: string,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: form.value,
          min_order_total: form.min_order_total
            ? parseFloat(form.min_order_total)
            : null,
          max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
          expires_at: form.expires_at || null,
          active: form.active,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }
      setForm(emptyForm);
      setShowAdd(false);
      fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: DiscountCode) => {
    setEditingId(item.id);
    setShowAdd(false);
    setForm({
      code: item.code,
      type: item.type,
      value: item.value,
      min_order_total: item.min_order_total?.toString() ?? "",
      max_uses: item.max_uses?.toString() ?? "",
      expires_at: item.expires_at
        ? item.expires_at.substring(0, 10)
        : "",
      active: item.active,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          code: form.code,
          type: form.type,
          value: form.value,
          min_order_total: form.min_order_total
            ? parseFloat(form.min_order_total)
            : null,
          max_uses: form.max_uses ? parseInt(form.max_uses, 10) : null,
          expires_at: form.expires_at || null,
          active: form.active,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }
      setEditingId(null);
      setForm(emptyForm);
      fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
    setError(null);
  };

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Discount Codes
        </h1>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors"
        >
          Add Discount
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {(showAdd || editingId) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
          <h2 className="font-display text-lg text-espresso">
            {editingId ? "Edit Discount" : "New Discount"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Code *
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  updateField("code", e.target.value.toUpperCase())
                }
                placeholder="e.g. SAVE20"
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Type *
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  updateField("type", e.target.value)
                }
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Value *
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) =>
                  updateField("value", parseFloat(e.target.value) || 0)
                }
                min={0}
                step={form.type === "percentage" ? 1 : 0.01}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Min Order Total
              </label>
              <input
                type="number"
                value={form.min_order_total}
                onChange={(e) => updateField("min_order_total", e.target.value)}
                placeholder="No minimum"
                min={0}
                step={0.01}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Max Uses
              </label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => updateField("max_uses", e.target.value)}
                placeholder="Unlimited"
                min={0}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Expires At
              </label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => updateField("expires_at", e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disc-active"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
              className="rounded border-linen"
            />
            <label htmlFor="disc-active" className="text-sm text-espresso">
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={saving || !form.code || !form.value}
              className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg border border-linen text-umber hover:text-espresso transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {discounts === null ? (
          <div className="p-8 text-center text-umber">Loading...</div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-umber">
            No discount codes yet. Add one above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-linen text-left">
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Code
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Type
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Value
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Usage
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Expires
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
                {discounts.map((item) => {
                  const expired = isExpired(item.expires_at);
                  const maxedOut =
                    item.max_uses !== null &&
                    item.times_used >= item.max_uses;
                  const effectiveStatus =
                    !item.active
                      ? "inactive"
                      : expired
                        ? "expired"
                        : maxedOut
                          ? "maxed"
                          : "active";

                  const statusStyles: Record<string, string> = {
                    active: "bg-green-100 text-green-800",
                    inactive: "bg-gray-100 text-gray-600",
                    expired: "bg-red-100 text-red-800",
                    maxed: "bg-yellow-100 text-yellow-800",
                  };

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-linen/50 hover:bg-ivory/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-espresso font-mono font-medium">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 text-umber capitalize">
                        {item.type}
                      </td>
                      <td className="px-4 py-3 text-espresso">
                        {item.type === "percentage"
                          ? `${item.value}%`
                          : `$${item.value.toFixed(2)}`}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {item.times_used}
                        {item.max_uses !== null ? ` / ${item.max_uses}` : ""}
                      </td>
                      <td className="px-4 py-3 text-umber">
                        {item.expires_at
                          ? new Date(item.expires_at).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[effectiveStatus]}`}
                        >
                          {effectiveStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-xs text-antique-gold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
