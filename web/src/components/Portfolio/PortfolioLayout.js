import React from 'react';
import PortfolioContainer from './PortfolioContainer'

const PortfolioLayout = () => {
  return (
    <div>
     <div className="columns is-mobile">
        <div className="column">
          <h3 className="subtitle is-6 has-text-centered" style={{ height: '20px', color: '#a9a9a9' }}>
            All stocks show an average rating score based on Dividend, Balance, Growth and Value.
          </h3>
        </div>
      </div>
      <PortfolioContainer />
    </div>
  );
};

export default PortfolioLayout;
