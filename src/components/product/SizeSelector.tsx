"use client";

type SizeOption = {
  id: string;
  label: string;
  price: number;
  inStock: boolean;
};

type SizeSelectorProps = {
  sizes: SizeOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SizeSelector({
  sizes,
  selectedId,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2">
      {sizes.map((size) => {
        const isActive = size.id === selectedId;
        const isDisabled = !size.inStock;

        return (
          <button
            key={size.id}
            onClick={() => !isDisabled && onSelect(size.id)}
            disabled={isDisabled}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-3 text-sm transition-all duration-200 ${
              isActive
                ? "bg-espresso text-ivory shadow-md"
                : isDisabled
                  ? "cursor-not-allowed border border-linen bg-warm-white text-espresso opacity-50"
                  : "border border-linen bg-warm-white text-espresso hover:border-antique-gold hover:shadow-sm"
            }`}
            aria-label={`Size ${size.label} - $${size.price.toFixed(2)}${isDisabled ? " - Out of stock" : ""}`}
            aria-pressed={isActive}
          >
            <span className="font-medium">{size.label}</span>
            <span
              className={`text-xs ${isDisabled ? "line-through" : ""} ${
                isActive ? "text-ivory/80" : "text-umber"
              }`}
            >
              ${size.price.toFixed(2)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
