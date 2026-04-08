"use client";

import { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function CartSummary() {
  const { items, subtotal } = useCartContext();
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const handleApplyDiscount = () => {
    // Discount code is passed along at checkout time
    if (discountCode.trim()) {
      setError(null);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          discountCode: discountCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        // Stripe requires full page redirect
        window.location.href = data.url;
      }
    } catch {
      setError("Unable to connect to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-linen bg-warm-white p-6">
      <h2 className="font-display text-xl font-semibold text-espresso">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-umber">Subtotal</span>
          <span className="font-medium text-espresso">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-umber">Shipping</span>
          <span className="font-medium text-espresso">
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
          </span>
        </div>

        {shippingCost > 0 && (
          <p className="text-xs text-umber">
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-linen" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-espresso">
            Estimated Total
          </span>
          <span className="font-display text-lg font-semibold text-espresso">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Discount code */}
      <div className="mt-5">
        <label
          htmlFor="discount-code"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-umber"
        >
          Discount Code
        </label>
        <div className="flex gap-2">
          <input
            id="discount-code"
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 rounded-lg border border-linen bg-ivory px-3 py-2 text-sm text-espresso placeholder:text-umber/50 focus:border-antique-gold focus:outline-none"
          />
          <button
            onClick={handleApplyDiscount}
            className="rounded-lg border border-linen bg-ivory px-4 py-2 text-sm font-medium text-espresso transition-colors hover:border-antique-gold"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-3 text-center text-sm text-red-600">{error}</p>
      )}

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="light-sweep mt-5 w-full rounded-lg bg-espresso py-4 text-sm font-semibold uppercase tracking-wider text-ivory transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Proceed to Checkout"}
      </button>
    </div>
  );
}
