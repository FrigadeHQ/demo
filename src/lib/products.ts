import { CodeXml, Sparkles, type LucideIcon } from "lucide-react";

export type ProductSlug = "assistant" | "engage";
export type ProductColor = "brand" | "engage";

export type Product = {
  slug: ProductSlug;
  name: string;
  href: string;
  icon: LucideIcon;
  color: ProductColor;
};

export const products: Product[] = [
  { slug: "assistant", name: "Assistant", href: "/", icon: Sparkles, color: "brand" },
  { slug: "engage", name: "Engage", href: "/forms", icon: CodeXml, color: "engage" },
];

export function getProduct(slug: ProductSlug): Product {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product slug: ${slug}`);
  return product;
}

// Per-product accent colors as hex (matches marketing's --color-brand /
// --color-engage). Used by the chooser to color each product's icon and
// active-pill glow.
export const productAccent: Record<ProductColor, { hex: string; rgb: string }> = {
  brand: { hex: "#015EFB", rgb: "1, 94, 251" },
  engage: { hex: "#404E61", rgb: "64, 78, 97" },
};
