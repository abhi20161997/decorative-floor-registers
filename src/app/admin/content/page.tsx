"use client";

import { useEffect, useState, useCallback } from "react";
import type { ContentBlock } from "@/types";

const PAGE_TABS = [
  { label: "Homepage", value: "homepage" },
  { label: "About", value: "about" },
  { label: "FAQ", value: "faq" },
  { label: "Sizing Guide", value: "sizing-guide" },
  { label: "Shipping", value: "shipping" },
];

type BlockForm = {
  title: string;
  body: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
};

export default function AdminContentPage() {
  const [contentByPage, setContentByPage] = useState<Record<
    string,
    ContentBlock[]
  > | null>(null);
  const [activeTab, setActiveTab] = useState("homepage");
  const [editingForms, setEditingForms] = useState<
    Record<string, BlockForm>
  >({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data: Record<string, ContentBlock[]> = await res.json();
      setContentByPage(data);

      // Initialize forms
      const forms: Record<string, BlockForm> = {};
      for (const blocks of Object.values(data)) {
        for (const block of blocks) {
          forms[block.id] = {
            title: block.title ?? "",
            body: block.body ?? "",
            image_url: block.image_url ?? "",
            meta_title: block.meta_title ?? "",
            meta_description: block.meta_description ?? "",
          };
        }
      }
      setEditingForms(forms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateBlockField = (
    blockId: string,
    field: keyof BlockForm,
    value: string
  ) => {
    setEditingForms((prev) => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (blockId: string) => {
    setSavingIds((prev) => new Set(prev).add(blockId));
    setError(null);
    setSuccessId(null);

    try {
      const form = editingForms[blockId];
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: blockId,
          title: form.title || null,
          body: form.body || null,
          image_url: form.image_url || null,
          meta_title: form.meta_title || null,
          meta_description: form.meta_description || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccessId(blockId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(blockId);
        return next;
      });
    }
  };

  const currentBlocks = contentByPage?.[activeTab] ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Content Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm w-fit">
        {PAGE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-espresso text-white"
                : "text-umber hover:bg-linen"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {contentByPage === null ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-umber">
          Loading...
        </div>
      ) : currentBlocks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-umber">
          No content blocks for this page yet.
        </div>
      ) : (
        <div className="space-y-6">
          {currentBlocks.map((block) => {
            const form = editingForms[block.id];
            if (!form) return null;
            const isSaving = savingIds.has(block.id);
            const isSuccess = successId === block.id;

            return (
              <div
                key={block.id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-espresso">
                    {block.section_key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </h2>
                  <span className="text-xs text-umber font-mono">
                    {block.section_key}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-espresso">
                      Title
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        updateBlockField(block.id, "title", e.target.value)
                      }
                      className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-espresso">
                      Body
                    </label>
                    <textarea
                      value={form.body}
                      onChange={(e) =>
                        updateBlockField(block.id, "body", e.target.value)
                      }
                      rows={5}
                      className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-espresso">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) =>
                        updateBlockField(block.id, "image_url", e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-espresso">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={form.meta_title}
                        onChange={(e) =>
                          updateBlockField(
                            block.id,
                            "meta_title",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-espresso">
                        Meta Description
                      </label>
                      <input
                        type="text"
                        value={form.meta_description}
                        onChange={(e) =>
                          updateBlockField(
                            block.id,
                            "meta_description",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSave(block.id)}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    {isSuccess && (
                      <span className="text-sm text-green-600 font-medium">
                        Saved successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
