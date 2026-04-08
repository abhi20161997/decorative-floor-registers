"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/sizing-guide", label: "Sizing Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-espresso/50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-out panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex w-80 flex-col bg-ivory shadow-xl"
          >
            {/* Header with brand + close */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <Link
                href="/"
                onClick={onClose}
                className="flex flex-col leading-tight"
              >
                <span className="text-[10px] uppercase tracking-widest text-antique-gold font-display">
                  Decorative
                </span>
                <span className="font-display text-lg font-semibold text-espresso">
                  Floor Register
                </span>
              </Link>
              <button
                onClick={onClose}
                className="text-umber transition-colors hover:text-espresso"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-6 px-8 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "font-display text-2xl transition-colors",
                    pathname === link.href ||
                      pathname.startsWith(link.href + "/")
                      ? "text-antique-gold"
                      : "text-espresso hover:text-antique-gold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom contact section */}
            <div className="mt-auto border-t border-espresso/10 px-8 py-8">
              <p className="text-label-sm mb-3 uppercase text-antique-gold">
                Contact
              </p>
              <a
                href="tel:+18473161395"
                className="mb-2 block text-sm text-umber transition-colors hover:text-espresso"
              >
                +1 847-316-1395
              </a>
              <a
                href="mailto:deepakbrass@gmail.com"
                className="block text-sm text-umber transition-colors hover:text-espresso"
              >
                deepakbrass@gmail.com
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
