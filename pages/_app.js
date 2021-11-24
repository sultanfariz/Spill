import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../styles/theme';
import { createEmotionCache } from '../src/utils/createEmotionCache';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { RootLayout } from '../src/components/Layout/RootLayout';
import { NextAuth, Provider as SessionProvider } from 'next-auth/client';
import { ApolloProvider } from '@apollo/client';
import client from '../src/libs/GraphQL/client';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Spill</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <LocalizationProvider dateAdapter={DateAdapter}>
              <RootLayout>
                <Component {...pageProps} />
              </RootLayout>
            </LocalizationProvider>
          </ThemeProvider>
        </SessionProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
