import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Cancel icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <svg
            className="h-10 w-10 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-espresso">
          Checkout Cancelled
        </h1>

        <p className="mt-3 text-umber">
          No worries — your cart items are still saved. You can return to your
          cart and check out whenever you&rsquo;re ready.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/cart"
            className="light-sweep inline-block rounded-lg bg-espresso px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ivory transition-all duration-300 hover:shadow-lg"
          >
            Return to Cart
          </Link>
          <Link
            href="/shop"
            className="inline-block rounded-lg border border-linen px-6 py-3 text-sm font-semibold uppercase tracking-wider text-espresso transition-colors hover:border-antique-gold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
