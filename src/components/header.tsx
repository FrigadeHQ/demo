import React from 'react';

export function Header() {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between  text-sm lg:flex">
      <div className="fixed left-0 top-0 flex w-full items-end justify-center dark:via-black lg:static lg:size-auto">
        Left header
      </div>

      <div className="fixed bottom-0 left-0 flex w-full items-end justify-center dark:via-black lg:static lg:size-auto">
        Right header
      </div>
    </div>
  );
}
