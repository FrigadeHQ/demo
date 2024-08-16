import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col justify-center text-center gap-2">
      <h2 className="font-medium">Welcome to the Frigade demo</h2>
      <p className="text-sm text-muted-foreground max-w-[500px]">
        We put together a collection of components and patterns to help you get
        started. Feel free to grab time if you have any questions.
      </p>
      <div className="flex flex-row gap-4 justify-center mt-6">
        <Button asChild>
          <Link href="/forms">Begin</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link
            href="https://cal.com/team/frigade/frigade-demo"
            target="_blank"
          >
            Book a call
          </Link>
        </Button>
      </div>
    </div>
  );
}
