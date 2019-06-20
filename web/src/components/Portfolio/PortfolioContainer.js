import React from 'react';
import PropTypes from 'prop-types';

import { includes } from 'lodash';

import { usePortfolio } from '../../lib/custom-hooks';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

import SecuritiesContainer from '../SecuritySearch/SecuritiesContainer';

export const INSTRUMENT_SUGGESTIONS_QUERY = gql`
  query InstrumentSuggestions {
    instrumentSuggestions {
      id
      name
      sector
      countryCode
      marketSize
    }
  }
`;

const PortfolioContainer = () => {
  const { portfolio } = usePortfolio({});
  const defaultPortfolio = portfolio['default'];
  const portfolioIds = Object.values(defaultPortfolio).filter(p=>p.inPortfolio).map(p=>p.id);


  return (
    <div>
      <div className="columns is-mobile">
        <div className="column">
          <h3 className="subtitle is-6 has-text-centered" style={{ height: '20px', color: '#a9a9a9' }}>
            All stocks show an average rating score based on Dividend, Balance, Growth and Value.
          </h3>
        </div>
      </div>
      <Query query={INSTRUMENT_SUGGESTIONS_QUERY}>
        {({ loading, error, data }) => {
          if (error) return <ErrorMessage message="Error loading securities." />;
          if (loading) return <Loading />;

          const filteredInstrumentSuggestions = data.instrumentSuggestions.filter(
            s => includes(portfolioIds, s.id)
          );

          return (
            <div>
              <SecuritiesContainer suggestions={filteredInstrumentSuggestions} />
              {
                //<hr/>
                //<pre>{JSON.stringify(portfolio['default'], null, 2)}
                //</pre>
              }

            </div>
          );
        }}
      </Query>
    </div>
  );
};

PortfolioContainer.propTypes = {
  test: PropTypes.string
};

export default PortfolioContainer;

//
// <ul>
//   {portfolioIds.map(k => (
//     <li key={k}>
//       <button className={'button'} onClick={() => togglePortfolio(defaultPortfolio[k].id)}>
//         {portfolio['default'][k].id}
//       </button>
//     </li>
//   ))}
// </ul>
// <hr />
// <pre>{JSON.stringify(portfolio['default'], null, 2)}</pre>
