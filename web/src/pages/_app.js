import App, { Container } from 'next/app';
import React from 'react';

import { IntlProvider, addLocaleData } from 'react-intl';

import withApolloClient from '../lib/with-apollo';
import { ApolloProvider } from 'react-apollo';
import { AppProvider } from '../components/AppContext';

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach(lang => {
    addLocaleData(window.ReactIntlLocaleData[lang]);
  });
}

class MyApp extends App {
  static displayName = 'MyApp';

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const { req } = ctx;
    const { locale, messages } = req || window.__NEXT_DATA__.props;
    const initialNow = Date.now();

    return { pageProps, locale, messages, initialNow };
  }
  render() {
    // eslint-disable-next-line no-unused-vars
    const { Component, pageProps, locale, messages, initialNow, apolloClient } = this.props;
    return (
      <Container>
        <IntlProvider locale={locale}>
          <ApolloProvider client={apolloClient}>
            <AppProvider>
              <Component {...pageProps} />
            </AppProvider>
          </ApolloProvider>
        </IntlProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
