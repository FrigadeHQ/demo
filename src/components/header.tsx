import React from 'react';
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"


export function Header() {
  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] flex justify-center">
      <div className="z-10 w-full max-w-7xl items-center justify-between p-6 lg:px-0 text-sm flex">
        <div className="flex items-center dark:via-black static size-auto gap-2">
          <img src="/images/frigade.svg"></img>
          <Badge variant="outline" className="px-2 py-0.5 mt-0.5">
            <span className='text-[10px]'>Demo</span>
          </Badge>
        </div>

        <div className="flex items-center dark:via-black static size-auto gap-6">
          <a href="https://frigade.com" target="_blank" className="m-0 max-w-[30ch] lg:display text-sm font-medium hover:text-blue-500">Website</a>
          <a href="https://frigade.com" target="_blank" className="m-0 max-w-[30ch] hidden md:block text-sm font-medium hover:text-blue-500">Docs</a>
          <a href="https://frigade.com" target="_blank" className="m-0 max-w-[30ch] hidden md:block text-sm font-medium hover:text-blue-500">Github</a>
          <Button size="sm" className='bg-blue-500'>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
