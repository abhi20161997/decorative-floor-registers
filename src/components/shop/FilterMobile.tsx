"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilters } from "@/hooks/useFilters";

const STYLES = ["Art Deco", "Contemporary", "Geometrical"];

const FINISHES = [
  {
    name: "Antique Brass",
    gradient: "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
  },
  {
    name: "Black",
    gradient: "linear-gradient(135deg, #3a3632, #2c2420, #1a1714, #3a3632)",
  },
  {
    name: "Bronze",
    gradient: "linear-gradient(135deg, #8b6f3a, #6b5533, #9a7b4f, #8b6f3a)",
  },
];

const SIZES = [
  "2x10",
  "2x12",
  "2x14",
  "4x10",
  "4x12",
  "4x14",
  "6x10",
  "6x12",
  "6x14",
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-linen pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-espresso"
      >
        {title}
        <svg
          className={`h-4 w-4 text-umber transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
}

export default function FilterMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilter, clearFilters } = useFilters();

  const hasActiveFilters = filters.style || filters.finish || filters.size;
  const activeCount = [filters.style, filters.finish, filters.size].filter(
    Boolean
  ).length;

  return (
    <div className="lg:hidden">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-linen bg-warm-white px-4 py-2 text-sm font-medium text-espresso transition-colors hover:bg-linen"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brass text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-espresso/40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-ivory p-6"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-espresso">
                  Filters
                </h2>
                <div className="flex items-center gap-4">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-antique-gold hover:text-brass"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-umber hover:text-espresso"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {/* Style */}
                <FilterSection title="Style">
                  {STYLES.map((style) => {
                    const active = filters.style === style;
                    return (
                      <button
                        key={style}
                        onClick={() =>
                          setFilter("style", active ? null : style)
                        }
                        className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                          active
                            ? "border-l-2 border-brass bg-linen font-medium text-espresso"
                            : "text-umber hover:bg-linen/50 hover:text-espresso"
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </FilterSection>

                {/* Finish */}
                <FilterSection title="Finish">
                  {FINISHES.map((finish) => {
                    const active = filters.finish === finish.name;
                    return (
                      <button
                        key={finish.name}
                        onClick={() =>
                          setFilter("finish", active ? null : finish.name)
                        }
                        className={`flex w-full items-center gap-2.5 rounded px-3 py-1.5 text-left text-sm transition-colors ${
                          active
                            ? "border-l-2 border-brass bg-linen font-medium text-espresso"
                            : "text-umber hover:bg-linen/50 hover:text-espresso"
                        }`}
                      >
                        <div
                          className="h-4 w-4 shrink-0 rounded-full border border-linen shadow-sm"
                          style={{ background: finish.gradient }}
                        />
                        {finish.name}
                      </button>
                    );
                  })}
                </FilterSection>

                {/* Size */}
                <FilterSection title="Size">
                  {SIZES.map((size) => {
                    const active = filters.size === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setFilter("size", active ? null : size)}
                        className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                          active
                            ? "border-l-2 border-brass bg-linen font-medium text-espresso"
                            : "text-umber hover:bg-linen/50 hover:text-espresso"
                        }`}
                      >
                        {size}&quot;
                      </button>
                    );
                  })}
                </FilterSection>
              </div>

              {/* Apply button */}
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full rounded-lg bg-espresso py-3 text-sm font-medium text-ivory transition-colors hover:bg-umber"
              >
                View results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
