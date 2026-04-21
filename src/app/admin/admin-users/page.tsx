"use client";

import { useCallback, useEffect, useState } from "react";

type AdminUserRow = {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Reset password
  const [resetRowId, setResetRowId] = useState<string | null>(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetting, setResetting] = useState(false);

  const fetchRows = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/admin-users");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load admin users");
      setRows([]);
      return;
    }
    setRows(data as AdminUserRow[]);
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCreate = async () => {
    if (!newEmail || !newPassword) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");
      setShowAdd(false);
      setNewEmail("");
      setNewPassword("");
      flash("Admin created.");
      fetchRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  const handleReset = async (rowId: string) => {
    if (!resetPwd) return;
    setResetting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/admin-users/${rowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setResetRowId(null);
      setResetPwd("");
      flash("Password reset.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset");
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (row: AdminUserRow) => {
    const deleteAuth = confirm(
      `Remove admin role from ${row.email}?\n\nOK = remove admin role only (keep the user account)\nCancel = stop`
    );
    if (!deleteAuth) return;
    const fullyDelete = confirm(
      `Also delete the Supabase auth user entirely?\n\nOK = delete both admin role AND auth account (they cannot log in at all)\nCancel = remove only admin role (auth account remains, user can still log in but won't have admin access)`
    );
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/admin-users/${row.id}${fullyDelete ? "?deleteAuth=true" : ""}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove");
      flash(fullyDelete ? "Admin + auth user removed." : "Admin role removed.");
      fetchRows();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">
          Admin Users
        </h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90"
        >
          {showAdd ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
          {success}
        </div>
      )}

      {showAdd && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-w-2xl">
          <h2 className="font-display text-lg text-espresso mb-4">
            Create a new admin
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Email *
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">
                Password *
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-linen bg-ivory px-3 py-2 text-sm text-espresso focus:border-antique-gold focus:outline-none"
                placeholder="At least 8 chars recommended"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-umber">
            If the email already has a Supabase auth account, its password
            will be reset to what you enter here and it will be promoted to
            admin.
          </p>
          <div className="mt-4">
            <button
              onClick={handleCreate}
              disabled={creating || !newEmail || !newPassword}
              className="px-4 py-2 rounded-md bg-espresso text-white text-sm font-medium hover:bg-espresso/90 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl">
        {rows === null ? (
          <div className="p-8 text-center text-umber text-sm">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-umber text-sm">
            No admin users. (This shouldn&apos;t happen — you&apos;re logged in
            as one.)
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen text-left">
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Role
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Last Sign-in
                </th>
                <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                  Created
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-linen/50 hover:bg-ivory/50"
                >
                  <td className="px-4 py-3 text-espresso">{row.email}</td>
                  <td className="px-4 py-3 text-umber">{row.role}</td>
                  <td className="px-4 py-3 text-umber">
                    {row.last_sign_in_at
                      ? new Date(row.last_sign_in_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-umber">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {resetRowId === row.id ? (
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="text"
                          value={resetPwd}
                          onChange={(e) => setResetPwd(e.target.value)}
                          placeholder="New password"
                          className="w-40 rounded border border-linen px-2 py-1 text-xs focus:outline-none focus:border-antique-gold"
                        />
                        <button
                          onClick={() => handleReset(row.id)}
                          disabled={resetting || !resetPwd}
                          className="text-xs text-espresso hover:underline disabled:opacity-50"
                        >
                          {resetting ? "…" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setResetRowId(null);
                            setResetPwd("");
                          }}
                          className="text-xs text-umber hover:text-espresso"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex gap-3">
                        <button
                          onClick={() => {
                            setResetRowId(row.id);
                            setResetPwd("");
                          }}
                          className="text-xs text-antique-gold hover:underline"
                        >
                          Reset password
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 max-w-4xl text-xs text-umber">
        Tip: admins have full access to products, orders, customers, and
        settings. Only promote people you trust. You cannot remove yourself
        from this page — do that from a different admin account or via the
        Supabase dashboard.
      </p>
    </div>
  );
}
