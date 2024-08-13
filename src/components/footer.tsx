import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <div className="w-full bg-white border-t border-[#E5E5E5] flex justify-center">
      <div className="bg-white grid mb-0 w-full max-w-7xl grid-cols-6 text-left p-4 gap-6">
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
        />
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
        />
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
        />
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
        />
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
        />
        <LinkButton
          title="Forms"
          description="Powerful Inline Forms"
          href="/forms"
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
      className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      <h2 className="mb-3 text-base font-semibold">
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-xs opacity-50">{description}</p>
    </Link>
  );
}
