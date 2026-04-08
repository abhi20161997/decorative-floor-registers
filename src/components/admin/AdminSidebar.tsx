"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "\u25A3" },
  {
    label: "Products",
    icon: "\u25A6",
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Styles", href: "/admin/styles" },
      { label: "Finishes", href: "/admin/finishes" },
      { label: "Sizes", href: "/admin/sizes" },
    ],
  },
  { label: "Orders", href: "/admin/orders", icon: "\u2630" },
  { label: "Customers", href: "/admin/customers", icon: "\u2603" },
  { label: "Discounts", href: "/admin/discounts", icon: "\u2605" },
  { label: "Content", href: "/admin/content", icon: "\u270E" },
  { label: "Settings", href: "/admin/settings", icon: "\u2699" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAdmin();
  const [productsOpen, setProductsOpen] = useState(
    pathname.startsWith("/admin/products") ||
      pathname.startsWith("/admin/categories") ||
      pathname.startsWith("/admin/styles") ||
      pathname.startsWith("/admin/finishes") ||
      pathname.startsWith("/admin/sizes")
  );

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-linen bg-white">
      {/* Logo */}
      <div className="border-b border-linen px-6 py-5">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-widest text-antique-gold font-display">
            Decorative
          </span>
          <span className="font-display text-base font-semibold text-espresso">
            Floor Register
          </span>
        </Link>
        <p className="mt-1 text-label-sm uppercase tracking-wider text-umber">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if ("children" in item && item.children) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                      productsOpen
                        ? "bg-linen text-espresso font-medium"
                        : "text-umber hover:bg-linen/50 hover:text-espresso"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </span>
                    <span
                      className={`text-xs transition-transform ${
                        productsOpen ? "rotate-90" : ""
                      }`}
                    >
                      &#9654;
                    </span>
                  </button>
                  {productsOpen && (
                    <ul className="ml-7 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                              isActive(child.href)
                                ? "bg-linen text-espresso font-medium"
                                : "text-umber hover:bg-linen/50 hover:text-espresso"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            const navItem = item as { label: string; href: string; icon: string };
            return (
              <li key={navItem.href}>
                <Link
                  href={navItem.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(navItem.href)
                      ? "bg-linen text-espresso font-medium"
                      : "text-umber hover:bg-linen/50 hover:text-espresso"
                  }`}
                >
                  <span className="text-base">{navItem.icon}</span>
                  {navItem.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="border-t border-linen px-3 py-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-umber transition-colors hover:bg-linen/50 hover:text-espresso"
        >
          <span className="text-base">&#x2190;</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
