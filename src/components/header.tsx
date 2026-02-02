import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useExperience } from '@/components/experience-context';
import Image from 'next/image';

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
          <div className="grid grid-cols-2 items-center rounded-full border border-gray-200 bg-gray-100 p-1 w-full sm:w-auto max-w-[220px] sm:max-w-none">
            <button
              type="button"
              onClick={() => switchExperience('assistant')}
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                isAssistant
                  ? 'bg-white text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Frigade
            </button>
            <button
              type="button"
              onClick={() => switchExperience('engage')}
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors ${
                !isAssistant
                  ? 'bg-white text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Frigade Engage
            </button>
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
