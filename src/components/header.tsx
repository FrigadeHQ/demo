import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useExperience } from '@/components/experience-context';
import Image from 'next/image';
import { products, productAccent, type ProductSlug } from "@/lib/products";

export function Header() {
  const { experience, setExperience } = useExperience();
  const isAssistant = experience === 'assistant';
  const router = useRouter();
  const switchExperience = (nextExperience: 'assistant' | 'engage') => {
    if (nextExperience === experience) {
      return;
    }

    setExperience(nextExperience);
    router.push('/');
  };

  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] flex justify-center z-10 px-6">
      <div className="z-10 w-full max-w-7xl items-center justify-between p-6 px-0 text-sm flex flex-col gap-4 sm:flex-row">
        <div className="flex gap-3 sm:gap-4 items-center dark:via-black static size-auto w-full sm:w-auto justify-between sm:justify-start">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/frigade.svg"
              alt="Frigade"
              width={120}
              height={24}
              className="block h-6 w-auto sm:h-7"
            />
          </Link>
          <div className="inline-flex items-center rounded-full border border-border bg-muted p-1">
            {products.map((product) => {
              const isActive = product.slug === experience;
              const accent = productAccent[product.color];
              const Icon = product.icon;
              return (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => switchExperience(product.slug)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: `0 0 0 1px rgba(${accent.rgb}, 0.18), 0 1px 2px rgba(${accent.rgb}, 0.08)` }
                      : undefined
                  }
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-[5px] text-white"
                    style={{ background: accent.hex }}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2.25} />
                  </span>
                  {product.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center dark:via-black static size-auto gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <HeaderLink
            href={
              isAssistant
                ? 'https://frigade.com?ref=demo'
                : 'https://frigade.com/engage?ref=demo'
            }
          >
            {isAssistant ? 'Visit Frigade' : 'Visit Frigade Engage'}
          </HeaderLink>
          {!isAssistant && (
            <HeaderLink href={'https://github.com/FrigadeHQ/demo'}>
              Source code
            </HeaderLink>
          )}
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white hover:border-blue-700"
          >
            <Link
              href={
                isAssistant
                  ? 'https://app.frigade.ai/sign-up?ref=demo'
                  : 'https://app.frigade.com/sign-up?ref=demo'
              }
              target="_blank"
            >
              Get started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="m-0 max-w-[30ch] hidden sm:block text-sm font-medium hover:text-blue-500 text-black"
    >
      {children}
    </Link>
  );
}
