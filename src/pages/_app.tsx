import '@/pages/globals.css';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { AppProps } from 'next/app';
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Site-wide metadata (Pages Router): browser title, description, favicon, and the
// social link-preview tags (Open Graph + Twitter). The preview image is committed
// at public/images/og.png; og:image needs an absolute URL, hence SITE_URL.
const SITE_URL = 'https://demo.frigade.com';
const OG_IMAGE = `${SITE_URL}/images/og.png`;
const TITLE = 'Frigade Demo';
const DESCRIPTION =
  'A live demo of Frigade, the backend for product onboarding. Explore Engage and Assistant: announcements, tours, checklists, forms, surveys, and more.';

// The demo is a single self-contained page that renders its own header and
// footer, so the app shell is just the shared providers (Frigade SDK + the
// product-toggle context) plus the font variable.
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#015efb" />
        {/* Open Graph (Slack, iMessage, LinkedIn, Facebook link previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Frigade" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="3540" />
        <meta property="og:image:height" content="2031" />
        {/* Twitter / X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </Head>
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
