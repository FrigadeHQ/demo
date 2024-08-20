import Head from 'next/head';

export default function HeadContent() {
  return (
    <>
      <Head>
        <title>Frigade Demo</title>
        <meta
          content="This demo contains a collection of Frigade pre-built UI components and common onboarding patterns in action."
          name="description"
        />
        {/* Open Graph */}
        <meta property="og:site_name" content="Frigade" />
        <meta
          property="og:description"
          content="This demo contains a collection of Frigade pre-built UI components and common onboarding patterns in action."
        />
        <meta property="og:title" content="Frigade Demo" />
        <meta
          property="og:image"
          content="https://demo.frigade.com/images/og.png"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
