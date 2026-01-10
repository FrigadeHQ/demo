import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExperience, ExperienceType } from '@/components/experience-context';

export function Header() {
  const { experience, setExperience } = useExperience();

  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] flex justify-center z-10 px-6">
      <div className="z-10 w-full max-w-7xl items-center justify-between p-6 px-0 text-sm flex">
        <div className="flex gap-4 items-center dark:via-black static size-auto">
          <Link href="/" className="flex items-center">
            <img src="/images/frigade.svg" />
          </Link>
          <Select
            value={experience}
            onValueChange={(val) => setExperience(val as ExperienceType)}
          >
            <SelectTrigger className="w-[160px] h-8 bg-blue-600 text-white border-none hover:bg-blue-700 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assistant">Frigade Assistant</SelectItem>
              <SelectItem value="engage">Frigade Engage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center dark:via-black static size-auto gap-6">
          <HeaderLink href={'https://frigade.com?ref=demo'}>
            Frigade.com
          </HeaderLink>
          <HeaderLink href={'https://frigade.ai?ref=demo'}>
            Frigade.ai
          </HeaderLink>
          <HeaderLink href={'https://docs.frigade.com?ref=demo'}>
            Docs
          </HeaderLink>
          <HeaderLink href={'https://github.com/FrigadeHQ/demo'}>
            Source code
          </HeaderLink>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white hover:border-blue-700"
          >
            <Link
              href="https://app.frigade.com/sign-up?ref=demo"
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
