import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head></Head>
      <body style={{ overflow: 'hidden' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
