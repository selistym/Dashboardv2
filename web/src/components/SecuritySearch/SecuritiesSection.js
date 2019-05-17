import React, { useEffect } from 'react';
import LocalPortfolioContainer from '../LocalPortfolio';
import PropTypes from 'prop-types';

const SecuritiesSection = ({ securities, loadMoreSecurities, subscribeToSecurities }) => {
  // initialize subscriptions
  let unsubscribe;

  useEffect(() => {
    if (process.browser && subscribeToSecurities) {
      unsubscribe = subscribeToSecurities();
    }

    return () => {
      if (process.browser && unsubscribe !== undefined) {
        unsubscribe();
      }
    };
  });

  return (
    <section style={{ paddingTop: '20px' }}>
      <div
        className="columns is-mobile"
        style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }}
        data-testid="filtered-securities"
      >
        {securities.map(s => (
          <LocalPortfolioContainer key={s.id} index={s.id} security={s} />
        ))}
      </div>
      <button
        className="button"
        onClick={() => loadMoreSecurities()}
        style={{ backgroundColor: '#b9b9b9', color: 'white' }}
      >
        Show more
      </button>
    </section>
  );
};

SecuritiesSection.propTypes = {
  securities: PropTypes.array.isRequired,
  loadMoreSecurities: PropTypes.func.isRequired,
  subscribeToSecurities: PropTypes.func.isRequired
};

export default SecuritiesSection;
