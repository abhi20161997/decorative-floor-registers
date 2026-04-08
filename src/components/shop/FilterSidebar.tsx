"use client";

import { useState } from "react";
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

function AccordionSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

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

export default function FilterSidebar() {
  const { filters, setFilter, clearFilters } = useFilters();

  const hasActiveFilters = filters.style || filters.finish || filters.size;

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-espresso">
            Filters
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-antique-gold hover:text-brass"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-2">
          {/* Style filter */}
          <AccordionSection title="Style">
            {STYLES.map((style) => {
              const active = filters.style === style;
              return (
                <button
                  key={style}
                  onClick={() => setFilter("style", active ? null : style)}
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
          </AccordionSection>

          {/* Finish filter */}
          <AccordionSection title="Finish">
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
          </AccordionSection>

          {/* Size filter */}
          <AccordionSection title="Size">
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
          </AccordionSection>
        </div>
      </div>
    </aside>
  );
}
