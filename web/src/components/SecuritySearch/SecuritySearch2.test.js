const wait = require('waait');

import React from 'react';

import { render, cleanup, waitForElementToBeRemoved } from 'react-testing-library';

require('react-testing-library/cleanup-after-each');
require('jest-dom/extend-expect');

afterEach(cleanup);

import { AppProvider } from '../AppContext';
import { SecuritySearch } from './SecuritySearch';


import { MockedProvider } from 'react-apollo/test-utils';
// import { MockedProvider, MockLink } from 'react-apollo/test-utils';
import { SECURITIES_QUERY } from './SecuritySearch';


const mocks =[
  {
    request: {
      query: SECURITIES_QUERY,
      variables: {
        filter: {
          name: '',
          year: 2018,
          sectors: ['Finance', 'ConsumerServices']
        },
        offset: 0,
        limit: 10
      }
    },
    result: {
      data: {
        securities: [
          {
            id: 'epjgn',
            name: '3i Group',
            sector: 'Finance',
            calculatedCircular: [
              {
                Year: 2014,
                Total: 91,
                Dividend: 47,
                Balance: 55,
                Growth: 55,
                Value: 73
              },
              {
                Year: 2015,
                Total: 66,
                Dividend: 26,
                Balance: 3,
                Growth: 23,
                Value: 40
              },
              {
                Year: 2016,
                Total: 83,
                Dividend: 69,
                Balance: 76,
                Growth: 64,
                Value: 84
              },
              {
                Year: 2017,
                Total: 98,
                Dividend: 14,
                Balance: 3,
                Growth: 93,
                Value: 76
              },
              {
                Year: 2018,
                Total: 37,
                Dividend: 91,
                Balance: 67,
                Growth: 95,
                Value: 30
              }
            ]
          }
        ]
      }
    }
  }]
;

jest.setTimeout(30000); // 1 second

// Broken because it's missing Apollo Client in the context
it('should render without error', async () => {
  const { getByTestId, debug } = render(
    <AppProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <SecuritySearch allSectors={['Finance', 'ConsumerServices']} />
      </MockedProvider>
    </AppProvider>
  );

  await waitForElementToBeRemoved(() => getByTestId('spinner'));
  await wait(0);

  debug();
  //expect(container.firstChild).toHaveClass('columns');
});
