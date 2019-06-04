import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import fetch from 'isomorphic-unfetch';

if (!process.browser) {
  global.fetch = fetch;
}

let apolloClient = null;

function create(initialState, { accessToken }) {

  const cache = new InMemoryCache().restore(initialState || {});

  const httpLink = new HttpLink({
    uri: publicRuntimeConfig.graphApi,
    opts: {
      credentials: 'same-origin'
    },
    // Use fetch() polyfill on the server
    fetch: !process.browser && fetch
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    };
  });

  const wsLink =
    process.browser &&
    new WebSocketLink({
      uri: publicRuntimeConfig.graphWsApi,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: accessToken
        }
      },
      credentials: 'same-origin'
    });

  const link = process.browser
    ? split(
        // split based on operation type
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink
      )
    : httpLink;

  return new ApolloClient({
    cache,
    link: ApolloLink.from([authLink, link]),
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    credentials: 'same-origin'
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
