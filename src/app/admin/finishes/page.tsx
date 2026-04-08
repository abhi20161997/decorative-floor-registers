"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import type { Finish } from "@/types";

const emptyForm = {
  name: "",
  slug: "",
  hex_color: "#000000",
  gradient_css: "",
  display_order: 0,
  active: true,
};

export default function AdminFinishesPage() {
  const [items, setItems] = useState<Finish[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("finishes")
      .select("*")
      .order("display_order", { ascending: true });
    setItems(data ?? []);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && typeof value === "string") {
        next.slug = generateSlug(value);
      }
      return next;
    });
  };

  const handleAdd = async () => {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("finishes").insert({
      name: form.name,
      slug: form.slug,
      hex_color: form.hex_color || null,
      gradient_css: form.gradient_css || null,
      display_order: form.display_order,
      active: form.active,
    });
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setForm(emptyForm);
    setShowAdd(false);
    fetchItems();
  };

  const startEdit = (item: Finish) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      hex_color: item.hex_color ?? "#000000",
      gradient_css: item.gradient_css ?? "",
      display_order: item.display_order,
      active: item.active,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("finishes")
      .update({
        name: form.name,
        slug: form.slug,
        hex_color: form.hex_color || null,
        gradient_css: form.gradient_css || null,
        display_order: form.display_order,
        active: form.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingId);
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    fetchItems();
  };

  const handleDeactivate = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from("finishes")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetchItems();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyForm);
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">Finishes</h1>
        <button
          onClick={() => {
            setShowAdd(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors"
        >
          Add Finish
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {(showAdd || editingId) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
          <h2 className="font-display text-lg text-espresso">
            {editingId ? "Edit Finish" : "New Finish"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Hex Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.hex_color}
                  onChange={(e) => updateField("hex_color", e.target.value)}
                  className="h-9 w-12 rounded border border-linen cursor-pointer"
                />
                <input
                  type="text"
                  value={form.hex_color}
                  onChange={(e) => updateField("hex_color", e.target.value)}
                  className="flex-1 rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Display Order
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  updateField("display_order", parseInt(e.target.value) || 0)
                }
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">
              Gradient CSS
            </label>
            <textarea
              value={form.gradient_css}
              onChange={(e) => updateField("gradient_css", e.target.value)}
              rows={2}
              placeholder="e.g. linear-gradient(135deg, #c9a96e 0%, #e8d5a8 50%, #9a7b4f 100%)"
              className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/40 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
            {form.gradient_css && (
              <div
                className="mt-2 h-8 rounded-md border border-linen"
                style={{ background: form.gradient_css }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="finish-active"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
              className="rounded border-linen"
            />
            <label htmlFor="finish-active" className="text-sm text-espresso">
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={saving || !form.name}
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {items === null ? (
          <div className="p-8 text-center text-umber">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-umber">No finishes yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen text-left">
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Color
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Slug
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Order
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
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-linen/50 hover:bg-ivory/50"
                >
                  <td className="px-4 py-3">
                    <span
                      className="inline-block w-6 h-6 rounded-full border border-linen"
                      style={{
                        background: item.gradient_css || item.hex_color || "#ccc",
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-espresso font-medium">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-umber font-mono text-xs">
                    {item.slug}
                  </td>
                  <td className="px-4 py-3 text-umber">{item.display_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs text-antique-gold hover:underline"
                    >
                      Edit
                    </button>
                    {item.active && (
                      <button
                        onClick={() => handleDeactivate(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
