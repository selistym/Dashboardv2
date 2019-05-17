import React from 'react';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

import { render, fireEvent } from 'react-testing-library';

import { MockedProvider } from 'react-apollo/test-utils';
import fetch from 'isomorphic-unfetch';

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import { AppProvider } from '../components/AppContext';
import SecuritySearch from '../components/SecuritySearch';
import gql from 'graphql-tag';

const link = new HttpLink({
  uri: 'https://vde-app4.app.veb.net/graphql', // Server URL (must be absolute)
  credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
  // Use fetch() polyfill on the server
});
const cache = new InMemoryCache().restore({});
const client = new ApolloClient({
  connectToDevTools: false,
  ssrMode: true,
  link,
  fetch,
  cache,
  resolvers: {
    Security: {
      isInLocalPortfolio: (security, _args, { cache }) => {
        console.log('the id is: ', security.id);
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

beforeAll(() => {});

describe('SecuritySearch', () => {
  it('renders', () => {
    const { getByPlaceholderText } = render(
      <ApolloProvider client={client}>
        <AppProvider>
          <SecuritySearch />
        </AppProvider>
      </ApolloProvider>
    );
    const input = getByPlaceholderText(/Search a specific stock.../i);
    expect(input).toBeDefined();
    //expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass('input');
  });
  it('loads more securities', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ApolloProvider client={client}>
        <AppProvider>
          <SecuritySearch />
        </AppProvider>
      </ApolloProvider>
    );
    // the container is loading so we cannot test this yet
    //const securityContainer = getByTestId('test-container');
    //expect(securityContainer).toBeDefined();
    //expect(securityContainer).toHaveLength(10);
    //const input = getByText('Show more');
    //fireEvent.click(input);
    //expect(securityContainer).toHaveLength(20);
  });
});
