import Link from "next/link";
import { cn } from "@/lib/utils";

export type CtaVariant = "primary" | "secondary";

// Extracted from the live frigade.com scrape — exact gradient + multi-layer
// shadow lifted verbatim.
export const ctaVariantStyles: Record<CtaVariant, string> = {
  primary:
    "rounded-lg text-white bg-[linear-gradient(rgb(0,110,255)_0%,rgb(0,86,248)_100%)] shadow-[inset_0_1px_0.4px_0_rgba(255,255,255,0.28),inset_0_-3px_2px_0_rgba(0,0,0,0.24),0_1px_1px_0_rgba(0,0,0,0.14),0_2px_4px_0_rgba(0,30,90,0.16),1px_4px_10px_0_rgba(0,86,248,0.18),0_0_0_1px_rgb(13,97,255)]",
  secondary:
    "rounded-md text-[rgb(26,27,47)] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(194,200,209,0.12)_100%)] shadow-[inset_0_1px_0.4px_0_rgba(255,255,255,0.9),inset_0_-2px_2px_0_rgba(20,30,60,0.08),0_1px_1px_0_rgba(0,0,0,0.06),0_2px_4px_0_rgba(20,30,60,0.08),0_0_0_1px_rgba(18,55,105,0.1)]",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
}) {
  const base =
    "relative inline-flex flex-col items-center justify-center gap-[10px] w-min cursor-pointer overflow-hidden no-underline px-4 py-1.5 text-sm font-medium leading-[1.6] whitespace-nowrap transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(base, ctaVariantStyles[variant], className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, ctaVariantStyles[variant], className)}>
      {children}
    </Link>
  );
}
