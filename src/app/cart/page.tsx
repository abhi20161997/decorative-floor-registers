"use client";

import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, clearCart } = useCartContext();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="mb-4 h-16 w-16 text-umber/40"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h1 className="font-display text-display-md text-espresso">
          Your cart is empty
        </h1>
        <p className="mt-2 text-umber">
          Looks like you haven&apos;t added any registers yet.
        </p>
        <Link
          href="/shop"
          className="light-sweep mt-6 inline-block rounded-lg bg-espresso px-8 py-3 text-sm font-semibold uppercase tracking-wider text-ivory transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-display-md text-espresso">
          Your Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-umber transition-colors hover:text-espresso"
        >
          Clear cart
        </button>
      </div>

      {/* Cart content */}
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items list */}
        <div>
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}

          {/* Continue shopping link */}
          <div className="mt-6">
            <Link
              href="/shop"
              className="text-sm text-umber transition-colors hover:text-antique-gold"
            >
              &larr; Continue shopping
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
