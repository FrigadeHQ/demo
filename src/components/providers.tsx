'use client';

import React, { useEffect } from 'react';
import * as Frigade from '@frigade/react';
import { getUserId } from '@/lib/utils';
import { ExperienceProvider } from './experience-context';
import { frigadeTheme, APP_SCOPE } from '@/lib/theme';

// App-wide providers: the product-toggle context (Engage vs Assistant) and the
// Frigade SDK provider.
//
// Frigade is handed Northwind's own design tokens, so its surfaces render in the
// product's colours, radii and shadows rather than as a third-party widget. The
// tokens are `var(--nw-*)` references and themeSelector scopes Frigade's variables
// into the app root that declares them, which is what lets the dark toggle re-skin
// Frigade along with everything else. See src/lib/theme.ts.
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
        theme={frigadeTheme}
        themeSelector={`.${APP_SCOPE}`}
      >
        {children}
      </Frigade.Provider>
    </ExperienceProvider>
  );
}
