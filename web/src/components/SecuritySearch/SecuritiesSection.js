import React, { useEffect } from 'react';
import LocalPortfolio from '../LocalPortfolio';
import PropTypes from 'prop-types';

const SecuritiesSection = ({ securities, loadMoreSecurities, subscribeToSecurities }) => {
  // initialize subscriptions
  
  useEffect(() => {
    subscribeToSecurities();
  });

  if (securities === undefined) {
    return null;
  }

  return (
    <section style={{ paddingTop: '20px' }}>
      <div
        className="columns is-mobile"
        style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around', padding:'40px' }}
        data-testid="filtered-securities"
      >
        {securities.map(s => (
          <LocalPortfolio key={s.id} index={s.id} security={s} />
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
