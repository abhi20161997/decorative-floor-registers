import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSku(
  styleName: string,
  finishName: string,
  sizeLabel: string
): string {
  const styleCode = styleName.substring(0, 2).toUpperCase();
  const finishCode = finishName.substring(0, 2).toUpperCase();
  const sizeCode = sizeLabel.toUpperCase().replace("X", "X");
  return `${styleCode}-${finishCode}-${sizeCode}`;
}
