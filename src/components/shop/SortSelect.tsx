"use client";

import { useFilters } from "@/hooks/useFilters";

const SORT_OPTIONS = [
  { value: "", label: "Sort by" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function SortSelect() {
  const { filters, setFilter } = useFilters();

  return (
    <select
      value={filters.sort || ""}
      onChange={(e) => setFilter("sort", e.target.value || null)}
      className="rounded-lg border border-linen bg-warm-white px-3 py-2 text-sm text-espresso focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
