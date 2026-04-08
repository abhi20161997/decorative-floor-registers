"use client";

import { useEffect, useState, useCallback } from "react";

type SettingsForm = {
  shipping_flat_rate: string;
  free_shipping_threshold: string;
  contact_phone: string;
  contact_email: string;
};

const SETTING_KEYS: { key: keyof SettingsForm; label: string; type: string; placeholder: string }[] = [
  {
    key: "shipping_flat_rate",
    label: "Shipping Flat Rate ($)",
    type: "number",
    placeholder: "e.g. 9.99",
  },
  {
    key: "free_shipping_threshold",
    label: "Free Shipping Threshold ($)",
    type: "number",
    placeholder: "e.g. 99.00",
  },
  {
    key: "contact_phone",
    label: "Contact Phone",
    type: "text",
    placeholder: "e.g. (555) 123-4567",
  },
  {
    key: "contact_email",
    label: "Contact Email",
    type: "email",
    placeholder: "e.g. support@example.com",
  },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    shipping_flat_rate: "",
    free_shipping_threshold: "",
    contact_phone: "",
    contact_email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data: Record<string, unknown> = await res.json();
      setForm({
        shipping_flat_rate: data.shipping_flat_rate?.toString() ?? "",
        free_shipping_threshold: data.free_shipping_threshold?.toString() ?? "",
        contact_phone: (data.contact_phone as string) ?? "",
        contact_email: (data.contact_email as string) ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (key: keyof SettingsForm) => {
    setSaving(key);
    setError(null);
    setSuccessKey(null);

    try {
      let value: unknown = form[key];
      // Convert numeric fields
      if (key === "shipping_flat_rate" || key === "free_shipping_threshold") {
        value = form[key] ? parseFloat(form[key]) : null;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccessKey(key);
      setTimeout(() => setSuccessKey(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    for (const setting of SETTING_KEYS) {
      await handleSave(setting.key);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-display-md text-espresso mb-8">
          Settings
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-umber">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Settings
        </h1>
        <button
          onClick={handleSaveAll}
          disabled={saving !== null}
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50"
        >
          Save All
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <h2 className="font-display text-lg text-espresso mb-6">
          Site Configuration
        </h2>

        <div className="space-y-6">
          {SETTING_KEYS.map((setting) => (
            <div key={setting.key}>
              <label className="mb-1 block text-sm font-medium text-espresso">
                {setting.label}
              </label>
              <div className="flex gap-3">
                <input
                  type={setting.type}
                  value={form[setting.key]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [setting.key]: e.target.value,
                    }))
                  }
                  placeholder={setting.placeholder}
                  step={setting.type === "number" ? "0.01" : undefined}
                  min={setting.type === "number" ? "0" : undefined}
                  className="flex-1 rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
                />
                <button
                  onClick={() => handleSave(setting.key)}
                  disabled={saving === setting.key}
                  className="px-4 py-2 rounded-lg border border-espresso text-espresso font-medium hover:bg-espresso hover:text-white transition-colors disabled:opacity-50"
                >
                  {saving === setting.key ? "Saving..." : "Save"}
                </button>
              </div>
              {successKey === setting.key && (
                <p className="mt-1 text-sm text-green-600 font-medium">
                  Saved successfully
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
