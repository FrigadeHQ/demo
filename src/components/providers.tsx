'use client';

import React, { useEffect } from 'react';
import * as Frigade from '@frigade/react';
import { getUserId } from '@/lib/utils';
import { ExperienceProvider } from './experience-context';

// App-wide providers: the product-toggle context (Engage vs Assistant) and the
// Frigade SDK provider. Every flow in this demo is read headless with useFlow
// and rendered with our own UI, so the SDK just needs the public API key and a
// stable per-browser user id.
export function Providers({ children }: { children: React.ReactNode }) {
  if (typeof process.env.NEXT_PUBLIC_FRIGADE_API_KEY === 'undefined') {
    throw new Error(
      'NEXT_PUBLIC_FRIGADE_API_KEY is not defined. Copy .env.example to .env.local and add your key.',
    );
  }

  useEffect(() => {
    // The demo identifies each visitor by a random id kept in localStorage, so
    // flow progress (what you've seen, completed, or dismissed) persists per
    // browser. Logged here to make it easy to reset a user while developing.
    console.log('Demo User ID is:', getUserId());
  }, []);

  return (
    <ExperienceProvider>
      <Frigade.Provider
        apiKey={process.env.NEXT_PUBLIC_FRIGADE_API_KEY}
        userId={getUserId()}
        defaultCollection={false}
      >
        {children}
      </Frigade.Provider>
    </ExperienceProvider>
  );
}
