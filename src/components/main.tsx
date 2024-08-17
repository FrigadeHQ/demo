'use client';

import React, { useEffect, useState } from 'react';
import { ThemeDropdown } from '@/components/theme';
import { Box } from '@frigade/react';
import HeadContent from '@/components/head-content';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
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
      <Scripts />
    </>
  );
}

function Scripts() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (domLoaded) {
    return (
      <>
        <script>
          {`!function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://cdn.getkoala.com/v1/pk_211a1bb6ecee2b11dbe259ec95f3f88a66f1/sdk.js"),(document.body || document.head).appendChild(n)}();`}
        </script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WL6B5EKN4K"
        ></script>
        <script
          src="https://www.googletagmanager.com/gtag/js?id=G-WL6B5EKN4K"
          async
        ></script>
        <script>
          {`  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WL6B5EKN4K');`}
        </script>
      </>
    );
  }

  return null;
}
