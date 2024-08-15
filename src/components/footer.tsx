import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <div className="w-full bg-white border-t border-[#E5E5E5] flex justify-center">
      <div className="bg-white grid mb-0 w-full max-w-7xl grid-cols-3 xl:grid-cols-6 text-left py-8 gap-6">
        <LinkButton
          title="Forms"
          description="Like Typeform, but native"
          href="/forms"
        />
        <LinkButton
          title="Tours"
          description="Flexible and interactive"
          href="/tours"
        />
        <LinkButton
          title="Cards"
          description="Live within your UI"
          href="/cards"
        />
        <LinkButton
          title="Modals"
          description="Easy to target and launch"
          href="/forms"
        />
        <LinkButton
          title="Surveys"
          description="Right user at the right time"
          href="/forms"
        />
        <LinkButton
          title="Checklists"
          description="Configurable and dynamic"
          href="/checklists"
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
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-xs opacity-50 text-gray-600">
        {description}
      </p>
    </Link>
  );
}
