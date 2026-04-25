import '@/pages/globals.css';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { AppProps } from 'next/app';
import { Header } from '@/components/header';
import { Main } from '@/components/main';
import { Footer } from '@/components/footer';

// import HeadContent from '@/components/layout/head-content';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
        }
      `}</style>
      <Providers>
        {/*<HeadContent />*/}
        <main className="flex bg-[#F6F8F7] min-h-screen flex-col items-center justify-between p-0 gap-8">
          <Header />
          <Main>
            <Component {...pageProps} />
          </Main>
          <Footer />
        </main>
      </Providers>
    </>
  );
}

export default MyApp;
