"use client";

import { useState, useCallback } from "react";
import { useCartContext } from "@/context/CartContext";

type CartVariant = {
  id: string;
  productName: string;
  productSlug: string;
  finishName: string;
  sizeName: string;
  price: number;
  imageUrl: string;
};

type AddToCartProps = {
  variant: CartVariant | null;
};

export default function AddToCart({ variant }: AddToCartProps) {
  const { addItem } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleDecrement = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const handleIncrement = useCallback(() => {
    setQuantity((q) => Math.min(10, q + 1));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!variant) return;

    addItem({
      variantId: variant.id,
      productSlug: variant.productSlug,
      productName: variant.productName,
      finishName: variant.finishName,
      sizeName: variant.sizeName,
      price: variant.price,
      quantity,
      imageUrl: variant.imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [variant, quantity, addItem]);

  const isDisabled = !variant;

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-1">
        <span className="mr-3 text-sm font-medium text-espresso">Qty</span>
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-linen bg-warm-white text-espresso transition-colors hover:border-antique-gold disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <svg
            width="14"
            height="2"
            viewBox="0 0 14 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-espresso">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= 10}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-linen bg-warm-white text-espresso transition-colors hover:border-antique-gold disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 7H14M7 0V14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`light-sweep w-full rounded-lg py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
          added
            ? "bg-green-700 text-ivory shadow-lg"
            : isDisabled
              ? "cursor-not-allowed bg-espresso/40 text-ivory/60"
              : "bg-espresso text-ivory hover:shadow-lg active:scale-[0.98]"
        }`}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.75 9.75L7.5 13.5L14.25 5.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Added!
          </span>
        ) : isDisabled ? (
          "Select a size"
        ) : (
          "Add to Cart"
        )}
      </button>
    </div>
  );
}
