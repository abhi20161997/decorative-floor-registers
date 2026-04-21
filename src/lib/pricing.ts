export type PriceTier = {
  minQty: number;
  discountPct: number;
};

export const DEFAULT_BULK_TIERS: PriceTier[] = [
  { minQty: 5, discountPct: 10 },
  { minQty: 10, discountPct: 15 },
];

export function getActiveTier(
  quantity: number,
  tiers: PriceTier[] = DEFAULT_BULK_TIERS
): PriceTier | null {
  let active: PriceTier | null = null;
  for (const tier of tiers) {
    if (quantity >= tier.minQty) {
      if (!active || tier.minQty > active.minQty) active = tier;
    }
  }
  return active;
}

export function computeUnitPrice(
  basePrice: number,
  quantity: number,
  tiers: PriceTier[] = DEFAULT_BULK_TIERS
): number {
  const tier = getActiveTier(quantity, tiers);
  if (!tier) return basePrice;
  return basePrice * (1 - tier.discountPct / 100);
}

export function computeLineTotal(
  basePrice: number,
  quantity: number,
  tiers: PriceTier[] = DEFAULT_BULK_TIERS
): number {
  return computeUnitPrice(basePrice, quantity, tiers) * quantity;
}
