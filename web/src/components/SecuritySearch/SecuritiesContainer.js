import gql from 'graphql-tag';
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { Query } from 'react-apollo';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';
import SecuritiesSection from './SecuritiesSection';
import { usePortfolio } from '../../lib/custom-hooks';

const SECURITIES_PER_PAGE = 5;

// you will export this query because when you create the mutation,
// you can refetch this query when doing mutations like add to portfolio
// we put the file here to keep the queries as close as possible
// to the component that uses it
export const SECURITIES_QUERY = gql`
  query Securities($filter: SecurityFilterInput, $offset: Int, $limit: Int) {
    allSectors {
      code
      name
    }
    securities(filter: $filter, offset: $offset, limit: $limit) @connection(key: "mainFilter") {
      id
      name
      sector
      currency
      country {
        code
      }
      liveData {
        last
        changePercent
      }
      calculatedCircular {
        Year
        Total
        Dividend
        Balance
        Growth
        Value
      }
    }
  }
`;

export const SECURITIES_SUBSCRIPTION = gql`
  subscription SecuritiesSearchSubscription($securityIds: [String]!) {
    securityUpdated(securityIds: $securityIds) {
      id
      liveData {
        dayHigh
        dayLow
        last
        cumulativeVolume
        netChange
        changePercent
      }
    }
  }
`;

const SecuritiesContainer = () => {
  let { store } = useContext(AppContext);

  const { togglePortfolio, isInPortfolio } = usePortfolio({});

  return (
    <Query
      query={SECURITIES_QUERY}
      variables={{
        filter: {
          name: store.securityFilterText,
          year: store.securityFilterYear,
          sectors: store.securityFilterSector,
          marketSize: store.securityFilterMarketSize,
          country: store.securityFilterCountry
        },
        offset: 0,
        limit: SECURITIES_PER_PAGE
      }}
      pollInterval={500}
    >
      {({ loading, error, data: { securities }, fetchMore, subscribeToMore }) => {
        if (error) return <ErrorMessage message="Error loading securities." />;
        if (loading) return <Loading />;
        if (securities === undefined) {
          return <p>Undefined securities</p>;
        }

        const loadMoreSecurities = () => {
          fetchMore({
            variables: {
              offset: securities.length
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return prev;
              }
              return Object.assign({}, prev, {
                // Append the new posts results to the old one
                securities: [...prev.securities, ...fetchMoreResult.securities]
              });
            }
          });
        };

        const subscribeToSecurities = () => {
          if (securities !== undefined) {
            subscribeToMore({
              document: SECURITIES_SUBSCRIPTION,
              variables: { securityIds: securities.map(s => s.id) }
            });
          }
        };

        return (
          <SecuritiesSection
            securities={securities}
            loadMoreSecurities={loadMoreSecurities}
            subscribeToSecurities={subscribeToSecurities}
            togglePortfolio={togglePortfolio}
            isInPortfolio={isInPortfolio}
          />
        );
      }}
    </Query>
  );
};

SecuritiesContainer.propTypes = {};

export default SecuritiesContainer;
