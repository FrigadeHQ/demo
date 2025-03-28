'use client';

import React, { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as Frigade from '@frigade/react';
import { getUserId } from '@/lib/utils';

export function Providers({ children }: { children: React.ReactNode }) {
  if (typeof process.env.NEXT_PUBLIC_FRIGADE_API_KEY === 'undefined') {
    throw new Error(
      'NEXT_PUBLIC_FRIGADE_API_KEY is not defined. Make sure to run the command: cp .env.example to .env.local',
    );
  }

  useEffect(() => {
    console.log('Demo User ID is:', getUserId());
  }, []);

  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        themes={['light', 'dark', 'windows', 'vaporwave', 'linear', 'spotify']}
      >
        <Frigade.Provider
          apiKey={process.env.NEXT_PUBLIC_FRIGADE_API_KEY}
          userId={getUserId()}
          css={{
            '.fr-dialog-wrapper': {
              zIndex: 100,
            },
          }}
          theme={{
            colors: {
              primary: {
                foreground: 'hsl(var(--primary-foreground))',
                background: 'hsl(var(--primary))',
                surface: 'hsl(var(--primary))',
                border: 'hsl(var(--primary))',
                hover: {
                  background: 'hsl(var(--primary) / 0.9)',
                  surface: 'hsl(var(--primary) / 0.9)',
                  border: 'hsl(var(--primary) / 0.9)',
                },
              },
              secondary: {
                foreground: 'hsl(var(--secondary-foreground))',
                background: 'hsl(var(--secondary))',
                surface: 'hsl(var(--secondary))',
                border: 'hsl(var(--secondary))',
                hover: {
                  background: 'hsl(var(--secondary) / 0.8)',
                  surface: 'hsl(var(--secondary) / 0.8)',
                  border: 'hsl(var(--secondary) / 0.8)',
                },
              },
              neutral: {
                background: 'hsl(var(--card))',
                foreground: 'hsl(var(--neutral-foreground))',
                border: 'hsl(var(--border))',
                '100': 'hsl(var(--neutral))',
                '200': 'hsl(var(--neutral))',
                '300': 'hsl(var(--neutral))',
                '400': 'hsl(var(--neutral))',
                '500': 'hsl(var(--accent))',
                '600': 'hsl(var(--accent))',
                '700': 'hsl(var(--accent))',
                '800': 'hsl(var(--accent))',
                '900': 'hsl(var(--accent))',
              },
            },
          }}
        >
          {children}
        </Frigade.Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
