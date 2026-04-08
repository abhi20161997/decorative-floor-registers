import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Decorative Floor Register | Premium Floor Registers & Grilles",
    template: "%s | Decorative Floor Register",
  },
  description:
    "Handcrafted decorative floor registers in Art Deco, Contemporary, and Geometrical designs. Available in Antique Brass, Black, and Bronze finishes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://decorativefloorregister.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Decorative Floor Register",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
