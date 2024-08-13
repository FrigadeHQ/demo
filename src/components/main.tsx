import React from 'react';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-full h-full grow'>
      <div className='max-w-7xl bg-white rounded-sm w-full justify-center items-center border flex mx-auto p-6'>
        {children}
      </div>
    </div>
  );
}
