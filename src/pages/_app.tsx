import '@/pages/globals.css';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { AppProps } from 'next/app';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// The demo is a single self-contained page that renders its own header and
// footer, so the app shell is just the shared providers (Frigade SDK + the
// product-toggle context) plus the font variable.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
        }
      `}</style>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}

export default MyApp;
