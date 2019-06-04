import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

import { usePortfolio } from '../../lib/custom-hooks';
import Portfolio from './Portfolio';

export const PORTFOLIO_QUERY = gql`
  query PortfolioQuery($filter: SecurityFilterInput) {
    securities(filter: $filter) @connection(key: "security", filter: ["filter"]) {
      id
      name
      sector
      currency
      liveData {
        last
        changePercent
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

const PortfolioContainer = () => {
  const { portfolio } = usePortfolio({});

  if (portfolio['default'] === undefined) {
    return null;
  }
  const portfolioKeys = Object.values(portfolio['default'])
    .filter(p => p.inPortfolio)
    .map(p => p.id);

  return (
    <Query
      query={PORTFOLIO_QUERY}
      variables={{
        filter: {
          ids: portfolioKeys
        }
      }}
    >
      {({ loading, error, data, subscribeToMore }) => {
        if (error) return <ErrorMessage message="Error loading securities." />;
        if (loading) return <Loading />;

        if (data.securities === undefined) {
          return <p>Undefined securites</p>;
        }

        const subscribeToSecurities = () => {
          subscribeToMore({
            document: SECURITIES_SUBSCRIPTION,
            variables: { securityIds: portfolioKeys }
          });
        };

        return <Portfolio securities={data.securities} subscribeToSecurities={subscribeToSecurities} />;
      }}
    </Query>
  );
};

PortfolioContainer.propTypes = {
  test: PropTypes.string
};

export default PortfolioContainer;
