'use client';

import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as Frigade from '@frigade/react';

export function Providers({ children }: { children: React.ReactNode }) {
  if (typeof process.env.NEXT_PUBLIC_FRIGADE_API_KEY === 'undefined') {
    throw new Error(
      'NEXT_PUBLIC_FRIGADE_API_KEY is not defined. Make sure to run the command: cp .env.example to .env.local',
    );
  }

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <Frigade.Provider apiKey={process.env.NEXT_PUBLIC_FRIGADE_API_KEY}>
          {children}
        </Frigade.Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
