"use client";

type FinishOption = {
  id: string;
  name: string;
  slug: string;
  hex: string;
  gradient: string;
};

type FinishSelectorProps = {
  finishes: FinishOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function FinishSelector({
  finishes,
  selectedId,
  onSelect,
}: FinishSelectorProps) {
  const selectedFinish = finishes.find((f) => f.id === selectedId);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {finishes.map((finish) => {
          const isActive = finish.id === selectedId;
          return (
            <button
              key={finish.id}
              onClick={() => onSelect(finish.id)}
              title={finish.name}
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                isActive
                  ? "scale-115 border-2 border-brass ring-2 ring-brass/30"
                  : "border-2 border-transparent hover:scale-110"
              }`}
              style={{ background: finish.gradient }}
              aria-label={`Select ${finish.name} finish`}
              aria-pressed={isActive}
            />
          );
        })}
      </div>
      {selectedFinish && (
        <p className="text-sm text-umber">{selectedFinish.name}</p>
      )}
    </div>
  );
}
