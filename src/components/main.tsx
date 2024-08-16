'use client';

import React from 'react';
import { ThemeDropdown } from '@/components/theme';
import { Box } from '@frigade/react';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex w-full grow px-6 xl:px-0 lg:hidden">
        <Box className="bg-grid -z-1"></Box>
        <div className="relative max-w-7xl shadow-sm bg-background rounded-lg w-full justify-center items-center border flex mx-auto p-6">
          <p className="text-sm font-medium text-muted-foreground">
            This demo is optimized for larger screens.
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-full grow px-6 xl:px-0">
        <Box className="bg-grid -z-1"></Box>
        <div className="relative max-w-7xl shadow-sm bg-background rounded-lg w-full justify-center items-center border flex mx-auto p-6">
          <div className="absolute left-6 top-6 z-10">
            <ThemeDropdown />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
