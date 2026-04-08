import Link from "next/link";

const shopLinks = [
  { href: "/shop?style=art-deco", label: "Art Deco" },
  { href: "/shop?style=contemporary", label: "Contemporary" },
  { href: "/shop?style=geometrical", label: "Geometrical" },
  { href: "/shop", label: "All Registers" },
];

const helpLinks = [
  { href: "/sizing-guide", label: "Sizing Guide" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-widest text-antique-gold font-display">
                Decorative
              </span>
              <span className="font-display text-lg font-semibold text-warm-white">
                Floor Register
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-warm-white/70">
              Handcrafted decorative floor registers bringing artistry and
              elegance to every room. Premium quality in Antique Brass, Black,
              and Bronze finishes.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-label-sm mb-4 uppercase text-antique-gold">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-white/70 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-label-sm mb-4 uppercase text-antique-gold">
              Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-white/70 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-label-sm mb-4 uppercase text-antique-gold">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+18473161395"
                className="block text-sm text-warm-white/70 transition-colors hover:text-warm-white"
              >
                +1 847-316-1395
              </a>
              <a
                href="mailto:deepakbrass@gmail.com"
                className="block text-sm text-warm-white/70 transition-colors hover:text-warm-white"
              >
                deepakbrass@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-warm-white/10 pt-8 text-center">
          <p className="text-xs text-warm-white/50">
            &copy; {new Date().getFullYear()} Decorative Floor Register. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
