import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useExperience } from '@/components/experience-context';

export function Footer() {
  const { experience } = useExperience();

  if (experience === 'assistant') {
    return null;
  }

  return (
    <div className="w-full bg-white border-t border-[#E5E5E5] flex justify-center px-6 xl:px-0 z-10">
      <div className="bg-white grid mb-0 w-full max-w-7xl grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-left py-8 gap-6">
        <LinkButton
          title="Forms"
          description="Like Typeform, but native"
          href="/forms"
        />
        <LinkButton
          title="Tours"
          description="Fully interactive with UI"
          href="/tours"
        />
        <LinkButton
          title="Hints"
          description="Subtle way to guide users"
          href="/hints"
        />
        <LinkButton
          title="Checklists"
          description="Dynamic setup guides"
          href="/checklists"
        />
        <LinkButton
          title="Modals"
          description="Announcements & surveys"
          href="/modals"
        />
        <LinkButton
          title="Cards"
          description="Embed promos in your UI"
          href="/cards"
        />
      </div>
    </div>
  );
}

function LinkButton({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-secondary"
    >
      <h2 className="mb-1 text-base font-semibold text-foreground">
        {title}{' '}
        <ArrowRight
          size={16}
          className="inline-block text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none mb-[2px]"
          stroke="currentColor"
        />
      </h2>
      <p className="m-0 max-w-[30ch] text-xs text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}
