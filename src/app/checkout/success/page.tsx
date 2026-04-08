"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartContext } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartContext();
  const clearedRef = useRef(false);

  // Clear cart once on mount
  useEffect(() => {
    if (!clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Checkmark animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 font-display text-3xl font-bold text-espresso"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-3 text-umber"
        >
          Thank you for your order. We&rsquo;ll send you a confirmation email
          with your order details and tracking information once your items ship.
        </motion.p>

        {sessionId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-2 text-xs text-umber/60"
          >
            Session: {sessionId.slice(0, 20)}...
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/shop"
            className="light-sweep inline-block rounded-lg bg-espresso px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ivory transition-all duration-300 hover:shadow-lg"
          >
            Continue Shopping
          </Link>
          <Link
            href="/shop"
            className="inline-block rounded-lg border border-linen px-6 py-3 text-sm font-semibold uppercase tracking-wider text-espresso transition-colors hover:border-antique-gold"
          >
            View Our Collection
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center text-umber">Loading...</div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
