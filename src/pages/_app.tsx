import '@/pages/globals.css';
import { Providers } from '@/components/providers';

import { AppProps } from 'next/app';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Footer } from '@/components/footer';

// import HeadContent from '@/components/layout/head-content';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Providers>
        {/*<HeadContent />*/}
        <main className="flex bg-[#F6F8F7] min-h-screen flex-col items-center justify-between p-0 gap-8">
          <Header />
          <Main>
            <Component {...pageProps} />
          </Main>
          <Footer />
        </main>
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
      </Providers>
    </>
  );
}

export default MyApp;
