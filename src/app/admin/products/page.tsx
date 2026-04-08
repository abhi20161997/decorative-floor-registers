"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type ProductRow = Product & {
  category: { id: string; name: string } | null;
  style: { id: string; name: string } | null;
  variants: { id: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(
        "*, category:categories(id, name), style:styles(id, name), variants:product_variants(id)"
      )
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setProducts(data as unknown as ProductRow[]);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleActive = async (product: ProductRow) => {
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ active: !product.active, updated_at: new Date().toISOString() })
      .eq("id", product.id);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-display-md text-espresso">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-espresso text-white font-medium hover:bg-espresso/90 transition-colors"
        >
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
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
        {products === null ? (
          <div className="p-8 text-center text-umber">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-umber">
            No products found.{" "}
            <Link href="/admin/products/new" className="text-antique-gold hover:underline">
              Create your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-linen text-left">
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Name
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Style
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Variants
                  </th>
                  <th className="px-4 py-3 font-medium text-umber uppercase tracking-wide text-xs">
                    Base Price
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-linen/50 hover:bg-ivory/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-espresso font-medium hover:text-antique-gold"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {product.style?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-umber">
                      {product.variants?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-espresso">
                      {product.base_price ? formatPrice(product.base_price) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          product.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-antique-gold hover:underline text-xs"
                      >
                        Edit
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
