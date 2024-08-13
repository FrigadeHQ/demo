import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {Providers} from '@/components/providers';
import {Header} from '@/components/header';
import {Main} from '@/components/main';
import {Footer} from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex bg-[#FAFAFA] min-h-screen flex-col items-center justify-between p-0 gap-8">
          <Header />
          <Main>
              <Providers>{children}</Providers>
          </Main>
          <Footer />
        </main>
      </body>
    </html>
  );
}
