"use client";

import Link from "next/link";
import { useCartContext } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartContext();

  return (
    <div className="flex flex-col gap-4 border-b border-linen py-5 sm:flex-row sm:items-center">
      {/* Product image placeholder */}
      <Link
        href={`/shop/${item.productSlug}`}
        className="flex-shrink-0 self-start"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div
            className="h-16 w-16 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, #c9a96e 0%, #e8d5a8 40%, #9a7b4f 70%, #d4b978 100%)",
            }}
          />
        )}
      </Link>

      {/* Product details */}
      <div className="flex flex-1 flex-col gap-1">
        <Link
          href={`/shop/${item.productSlug}`}
          className="font-display text-lg font-semibold text-espresso hover:text-antique-gold transition-colors"
        >
          {item.productName}
        </Link>
        <p className="text-sm text-umber">
          {item.finishName} &middot; {item.sizeName}
        </p>
        <p className="text-sm font-medium text-espresso">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-linen bg-warm-white text-espresso transition-colors hover:border-antique-gold"
          aria-label="Decrease quantity"
        >
          <svg
            width="12"
            height="2"
            viewBox="0 0 14 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <span className="flex h-9 w-10 items-center justify-center text-sm font-medium text-espresso">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
          disabled={item.quantity >= 10}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-linen bg-warm-white text-espresso transition-colors hover:border-antique-gold disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 7H14M7 0V14"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      {/* Line total & remove */}
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
        <span className="text-sm font-semibold text-espresso">
          {formatPrice(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.variantId)}
          className="text-xs text-umber transition-colors hover:text-espresso"
          aria-label={`Remove ${item.productName} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
