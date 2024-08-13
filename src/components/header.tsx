import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] flex justify-center">
      <div className="z-10 w-full max-w-7xl items-center justify-between p-6 xl:px-0 text-sm flex">
        <div className="flex items-center dark:via-black static size-auto gap-2">
          <img src="/images/frigade.svg"></img>
          <Badge className="px-2 py-0.5 mt-0.5 bg-blue-600 border-none text-white">
            <span className="text-[9px]">Demo</span>
          </Badge>
        </div>

        <div className="flex items-center dark:via-black static size-auto gap-6">
          <HeaderLink href={'https://frigade.com?ref=demo'}>Website</HeaderLink>
          <HeaderLink href={'https://docs.frigade.com?ref=demo'}>
            Docs
          </HeaderLink>
          {/*TODO Add Github link*/}
          <HeaderLink href={'https://github.com'}>Github</HeaderLink>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link
              href="https://app.frigade.com/sign-up?ref=demo"
              target="_blank"
            >
              Get Started
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
      className="m-0 max-w-[30ch] lg:display text-sm font-medium hover:text-blue-500 text-black"
    >
      {children}
    </Link>
  );
}
