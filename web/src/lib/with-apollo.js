import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';

import { getDataFromTree } from 'react-apollo';
import initApollo from './init-apollo';

export default ComposedComponent => {
  return class Apollo extends React.Component {

    static displayName = `withApollo(${ComposedComponent.displayName})`;

    static propTypes = {
      apolloState: PropTypes.object
    };

    static async getInitialProps(ctx) {
      const {
        Component,
        router,
        ctx: { req, res } // eslint-disable-line no-unused-vars
      } = ctx;

      let appProps = {};

      if (ComposedComponent.getInitialProps) {
        appProps = await ComposedComponent.getInitialProps(ctx);
      }

      const apollo = initApollo({}, {
        accessToken:
          appProps.pageProps &&
          appProps.pageProps.session &&
          appProps.pageProps.session.user &&
          appProps.pageProps.session.user.accessToken

      });

      // todo: where does this come from
      ctx.ctx.apolloClient = apollo;

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {};
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data

      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ComposedComponent {...appProps} Component={Component} router={router} apolloClient={apollo} />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error); // eslint-disable-line no-console
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState
      };
    }

    constructor(props) {
      super(props);
      this.apolloClient = initApollo(props.apolloState, {});
    }

    render() {
      return <ComposedComponent {...this.props} apolloClient={this.apolloClient} />;
    }
  };
};
