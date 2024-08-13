import React from 'react';

export function Header() {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between  text-sm lg:flex">
      <div className="fixed left-0 top-0 flex w-full justify-center pb-6 pt-8 backdrop-blur-2xl dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Left header
      </div>

      <div className="fixed bottom-0 left-0 flex w-full items-end justify-center dark:via-black lg:static lg:size-auto lg:bg-none">
        Right header
      </div>
    </div>
  );
}
