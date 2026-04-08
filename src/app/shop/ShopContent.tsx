"use client";

import { useMemo } from "react";
import { useFilters } from "@/hooks/useFilters";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import FilterMobile from "@/components/shop/FilterMobile";
import SearchBar from "@/components/shop/SearchBar";
import SortSelect from "@/components/shop/SortSelect";

type ShopProduct = {
  name: string;
  slug: string;
  styleName: string;
  basePrice: number;
  imageUrl?: string;
  finishes: { name: string; hex: string; gradient: string }[];
};

export default function ShopContent({
  products,
}: {
  products: ShopProduct[];
}) {
  const { filters } = useFilters();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by style
    if (filters.style) {
      result = result.filter(
        (p) => p.styleName.toLowerCase() === filters.style!.toLowerCase()
      );
    }

    // Filter by finish
    if (filters.finish) {
      result = result.filter((p) =>
        p.finishes.some(
          (f) => f.name.toLowerCase() === filters.finish!.toLowerCase()
        )
      );
    }

    // Filter by search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.styleName.toLowerCase().includes(query)
      );
    }

    // Sort
    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          result.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case "price-desc":
          result.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
          // Keep original order (already sorted by created_at desc)
          break;
      }
    }

    return result;
  }, [products, filters]);

  return (
    <>
      {/* Top bar: search + count + sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <FilterMobile />
          <div className="w-full sm:w-64">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-umber">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>
          <SortSelect />
        </div>
      </div>

      {/* Main content: sidebar + grid */}
      <div className="flex gap-8">
        <FilterSidebar />

        {filteredProducts.length > 0 ? (
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-20">
            <p className="text-lg text-umber">No products found.</p>
            <p className="mt-1 text-sm text-umber/70">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
