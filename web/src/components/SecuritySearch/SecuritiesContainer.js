import gql from 'graphql-tag';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Query } from 'react-apollo';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';
import SecuritiesSection from './SecuritiesSection'

const SECURITIES_PER_PAGE = 10;

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
    securities(filter: $filter, offset: $offset, limit: $limit) @connection(key: "security", filter: ["filter"]) {
      id
      name
      sector
      currency
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
      isInLocalPortfolio @client
    }
  }
`;

export const SECURITIES_SUBSCRIPTION = gql`
  subscription SecuritySearchSubscription($securityIds: [String]!) {
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
  console.log(store)
  return (
    <Query
      query={SECURITIES_QUERY}
      variables={{
        filter: {
          name: store.securityFilterText,
          year: store.securityFilterYear,
          sectors: store.securityFilterSector,
          marketSize: store.securityFilterMarketSize
        },
        offset: 0,
        limit: SECURITIES_PER_PAGE
      }}
    >
      {({ loading, error, data: { securities }, fetchMore, subscribeToMore }) => {
        if (error) return <ErrorMessage message="Error loading securities." />;
        if (loading) return <Loading />;

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
          subscribeToMore({
            document: SECURITIES_SUBSCRIPTION,
            variables: { securityIds: securities.map(s => s.id) }
          });
        };

        return (
          <SecuritiesSection
            securities={securities}
            loadMoreSecurities={loadMoreSecurities}
            subscribeToSecurities={subscribeToSecurities}
          />
        );
      }}
    </Query>
  );
};

SecuritiesContainer.propTypes = {};


export default SecuritiesContainer;
