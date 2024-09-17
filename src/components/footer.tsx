import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Footer() {
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
      className="group rounded-lg border  border-gray-200 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
    >
      <h2 className="mb-1 text-base font-semibold text-black">
        {title}{' '}
        <ArrowRight
          size={16}
          className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none mb-[2px]"
          stroke="currentColor"
        />
      </h2>
      <p className="m-0 max-w-[30ch] text-xs opacity-50 text-gray-600">
        {description}
      </p>
    </Link>
  );
}
