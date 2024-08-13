import React from 'react';

export function Header() {
  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] flex justify-center">
      <div className="z-10 w-full max-w-7xl items-center justify-between p-6 text-sm flex">
        <div className="flex items-end dark:via-black static size-auto">
          Left header
        </div>

        <div className="flex items-end dark:via-black static size-auto">
          Right header
        </div>
      </div>
    </div>
  );
}
