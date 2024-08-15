'use client';

import React from 'react';
import { ThemeDropdown } from '@/components/theme';
import { getUserId } from '@/lib/utils';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden" data-frigade-user-id>
        Frigade userId: {getUserId()}
      </div>
      <div className="flex w-full grow px-6 xl:px-0">
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
