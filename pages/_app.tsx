import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider>
      <SessionProvider session={session}>
        <SWRConfig
          value={{
            shouldRetryOnError: false,
          }}
        ></SWRConfig>
        <Head>
          <title>More Reps - Free fitness tracker</title>
          <meta name="robots" content="follow, index" />
          <meta
            name="description"
            content="Simple fitness tracker that is completely free to use."
          />
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
