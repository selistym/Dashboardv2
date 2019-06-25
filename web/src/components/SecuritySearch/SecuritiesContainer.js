import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { AppContext } from '../AppContext';
import { Query } from 'react-apollo';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';
import SecuritiesSection from './SecuritiesSection';
import { usePortfolio } from '../../lib/custom-hooks';

import { filter, includes } from 'lodash';

const SECURITIES_PER_PAGE = 15;

const FILTERED_SECURITIES_QUERY = gql`
  query FilteredSecurities($filter: SecurityFilterInput, $offset: Int, $limit: Int) {
    securities(filter: $filter, offset: $offset, limit: $limit) {
      id
      name
      longBusinessDescription
      sector
      ticker      
      currency
      calculated3Y {
        SalesOrRevenueLY
      }
      country {
        code
      }
      factsetData {
        BookValue
        CEO
        CompanyFoundedDate
        Daily_DividendYieldDaily
        EarningsGrowth
        MarketCapitalization
      }
      liveData {
        changePercent
        cumulativeVolume
        dateTime
        dayHigh
        dayLow
        last
        netChange
        open
        previousActiveDate
        previousChange
        previousChangePercent
        previousClose
        previousCloseDate
        previousDayHigh
        previousDayLow
        previousOpen
        previousTotalVolume
        totalTurnoverCurrency        
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

const SecuritiesContainer = ({ suggestions }) => {
  let { store } = useContext(AppContext);

  const { togglePortfolio, isInPortfolio } = usePortfolio({});

  const { securityFilterText, securityFilterSector, securityFilterMarketSize, securityFilterCountry } = store;

  let filteredSuggestions = suggestions;

  // text always overrules all other filters (requirement dd. 2019-06-13)
  if (securityFilterText && securityFilterText !== '') {
    filteredSuggestions = filter(suggestions, s => {
      return s.name.toLowerCase().indexOf(securityFilterText.toLowerCase()) > -1;
    });
  } else {
    if (securityFilterCountry && securityFilterCountry.length > 0) {
      filteredSuggestions = filter(filteredSuggestions, s => includes(securityFilterCountry, s.countryCode));
    }

    if (securityFilterMarketSize && securityFilterMarketSize.length > 0) {
      filteredSuggestions = filter(filteredSuggestions, s => includes(securityFilterMarketSize, s.marketSize));
    }

    if (securityFilterSector && securityFilterSector.length > 0) {
      filteredSuggestions = filter(filteredSuggestions, s => includes(securityFilterSector, s.sector));
    }
  }


  return (
    <Query
      query={FILTERED_SECURITIES_QUERY}
      variables={{
        filter: {
          ids: filteredSuggestions.map(s => s.id)
        },
        offset: 0,
        limit: SECURITIES_PER_PAGE
      }}
    >
      {({ loading, error, data, fetchMore, subscribeToMore }) => {
        if (error) return <ErrorMessage message={error} />;
        if (loading) return <Loading style={{height: 300}}/>;
        if (data.securities === undefined) {
          return <p>Undefined securities</p>;
        }
        const loadMoreSecurities = () => {
          fetchMore({
            variables: {
              offset: data.securities.length,
              limit: SECURITIES_PER_PAGE
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
          if (data.securities !== undefined) {
            subscribeToMore({
              document: SECURITIES_SUBSCRIPTION,
              variables: { securityIds: data.securities.map(s => s.id) }
            });
          }
        };
        
        return (
          <SecuritiesSection
            securities={data.securities}
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

SecuritiesContainer.propTypes = {
  suggestions: PropTypes.array.isRequired
};

export default SecuritiesContainer;
