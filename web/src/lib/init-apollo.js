import gql from 'graphql-tag';

import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import fetch from 'isomorphic-unfetch';

if (!process.browser) {
  global.fetch = fetch
}

let apolloClient = null;

function create(initialState) {
  const httpLink = new HttpLink({
    uri: 'https://vde-app4.app.veb.net/graphql',
    //uri: 'http://localhost:4070/graphql',
    opts: {
      credentials: 'same-origin'
    },
    // Use fetch() polyfill on the server
    fetch: !process.browser && fetch
  });

  const wsLink =
    process.browser &&
    new WebSocketLink({
      uri: 'wss://vde-app4.app.veb.net/graphql',
      //uri: 'ws://localhost:4070/graphql',
      options: {
        reconnect: true
      }
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
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link:  ApolloLink.from([link]),
    cache: new InMemoryCache().restore(initialState || {}),
    typeDefs: gql`
      extend type Security {
        isInLocalPortfolio: Boolean!
      }
    `,
    resolvers: {
      Security: {
        isInLocalPortfolio: (security, _args, { cache }) => {
          // console.log('the id is: ', security.id);
          // const { cartItems } = cache.readQuery({
          //   query: GET_CART_ITEMS
          // });
          //return cartItems.includes(launch.id);
          return false;
        }
      },
      Mutation: {
        toggleLocalPortfolio: (_root, variables, { cache, getCacheKey }) => {
          const id = getCacheKey({ __typename: 'Security', id: variables.id });
          const fragment = gql`
            fragment localPortfolio on Security {
              isInLocalPortfolio
            }
          `;
          const security = cache.readFragment({ fragment, id });
          const data = { ...security, isInLocalPortfolio: !security.isInLocalPortfolio };
          cache.writeData({ id, data });
          return null;
        }
      }
    }
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
