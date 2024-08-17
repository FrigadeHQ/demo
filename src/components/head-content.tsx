import Head from 'next/head';

export default function HeadContent() {
  return (
    <>
      <Head>
        <title>Frigade Demo</title>
        <meta content="Frigade Demo" name="description" />
        {/* Open Graph */}
        <meta property="og:site_name" content="Frigade" />
        {/*<meta property="og:description" content={description} />*/}
        <meta property="og:title" content="Frigade" />
        {/*<meta*/}
        {/*  property="og:image"*/}
        {/*  content="https://frigade.com/images/common/og.png"*/}
        {/*/>*/}
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
