'use client';

import React from 'react';
import { ThemeDropdown } from '@/components/theme';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full grow">
      <div className="relative max-w-7xl shadow-sm bg-white rounded-lg w-full justify-center items-center border flex mx-auto p-6">
        <div className="absolute left-6 top-6 z-10">
          <ThemeDropdown />
        </div>
        {children}
      </div>
    </div>
  );
}
