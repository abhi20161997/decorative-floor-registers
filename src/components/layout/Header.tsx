"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/context/CartContext";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/sizing-guide", label: "Sizing Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { itemCount } = useCartContext();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);

  // Hide header on admin pages
  if (isAdmin) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-sm border-b border-brass/10"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col leading-tight transition-colors hover:opacity-80"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-antique-gold font-display">
                Decorative
              </span>
              <span className="font-display text-2xl font-semibold text-espresso -mt-0.5">
                Floor Register
              </span>
            </Link>

            {/* Decorative separator */}
            <div className="hidden md:block h-8 w-px bg-brass/20 mx-4" />

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium uppercase tracking-wide transition-colors",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-antique-gold"
                      : "text-umber hover:text-espresso"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right section: Cart + Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative text-umber transition-colors hover:text-espresso"
                aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[10px] font-bold leading-none text-espresso"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="text-umber transition-colors hover:text-espresso md:hidden"
                aria-label="Open menu"
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
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-20" />

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
