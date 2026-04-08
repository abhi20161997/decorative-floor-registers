"use client";

import { useState, useEffect, useRef } from "react";
import { useFilters } from "@/hooks/useFilters";

export default function SearchBar() {
  const { filters, setFilter } = useFilters();
  const [value, setValue] = useState(filters.search || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external changes (e.g. clear filters)
  useEffect(() => {
    setValue(filters.search || "");
  }, [filters.search]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setFilter("search", newValue || null);
    }, 300);
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-umber"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search registers..."
        value={value}
        onChange={handleChange}
        className="w-full rounded-lg border border-linen bg-warm-white py-2 pl-10 pr-4 text-sm text-espresso placeholder:text-umber/50 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
      />
    </div>
  );
}
