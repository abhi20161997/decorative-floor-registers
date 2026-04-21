import { DEFAULT_BULK_TIERS } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

type BulkPricingTableProps = {
  unitPrice: number;
};

export default function BulkPricingTable({ unitPrice }: BulkPricingTableProps) {
  const tiers = DEFAULT_BULK_TIERS;

  return (
    <div className="rounded-lg border border-linen bg-warm-white p-4">
      <h3 className="text-label-sm mb-2 uppercase tracking-wider text-antique-gold">
        Buy More, Save More
      </h3>
      <p className="mb-3 text-xs text-umber">
        Discounts apply per SKU (same design, finish &amp; size).
      </p>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-ivory px-3 py-2 text-center">
          <p className="text-xs text-umber">1&ndash;4 pcs</p>
          <p className="font-display text-base font-medium text-espresso">
            {formatPrice(unitPrice)}
          </p>
          <p className="text-[10px] text-umber/70">each</p>
        </div>
        {tiers.map((tier) => {
          const discounted = unitPrice * (1 - tier.discountPct / 100);
          return (
            <div
              key={tier.minQty}
              className="rounded-md bg-ivory px-3 py-2 text-center ring-1 ring-antique-gold/30"
            >
              <p className="text-xs text-umber">
                {tier.minQty}+ pcs &middot; &minus;{tier.discountPct}%
              </p>
              <p className="font-display text-base font-medium text-antique-gold">
                {formatPrice(discounted)}
              </p>
              <p className="text-[10px] text-umber/70">each</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
