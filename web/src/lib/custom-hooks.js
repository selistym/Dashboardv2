import { useEffect, useRef, useState } from 'react';

import createPersistedState from 'use-persisted-state';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useHighlight(value, classEqual = '', classHigher = 'highlight-up', classLower = 'highlight-down') {
  const [highlightClass, setHighlightClass] = useState();
  const currentValue = +value;

  const previousValue = usePrevious(+value);

  useEffect(() => {
    if (previousValue !== currentValue) {
      if (previousValue < currentValue) {
        setHighlightClass(classHigher);
      }
      if (previousValue > currentValue) {
        setHighlightClass(classLower);
      }
    }
    const timeout = setTimeout(() => {
      setHighlightClass(classEqual);
    }, 3 * 1000);
    return () => {
      clearInterval(timeout);
    };
  }, [previousValue, currentValue, classHigher, classLower, classEqual]);

  return highlightClass;
}

// the following probably not needed when useEffect is there
// not really sure about this but it doesn't hurt either
let usePortfolioState = () => [{}, () => {}];

if (process.browser) {
  usePortfolioState = createPersistedState('portfolio');
}

export const usePortfolio = initialPortfolio => {
  const [portfolio, setPortfolio] = usePortfolioState(initialPortfolio);

  return {
    portfolio,
    togglePortfolio: (id, portfolioName = 'default') => {
      let newPortfolio = portfolio;

      // this happens if the user deletes the local storage so we need to reinitialize the object
      if (portfolio === null) {
        newPortfolio = {};
      }

      // prepare dataset for multiple portfolio's because this should be possible in the future
      if (!newPortfolio.hasOwnProperty(portfolioName)) {
        newPortfolio[portfolioName] = {};
      }
      if (id === undefined) {
        return;
      }
      if (newPortfolio[portfolioName].hasOwnProperty(id)) {
        newPortfolio[portfolioName][id] = {
          id,
          inPortfolio: !newPortfolio[portfolioName][id].inPortfolio,
          count: newPortfolio[portfolioName][id].count
        };
      } else {
        newPortfolio[portfolioName][id] = {
          id,
          inPortfolio: true,
          count: 0
        };
      }
      setPortfolio({ ...newPortfolio });
    },
    isInPortfolio: (securityId, portfolioName = 'default') => {
      // edge case when user deletes local storage
      if (portfolio === null) {
        return false;
      }
      if (!portfolio.hasOwnProperty(portfolioName)) {
        portfolio[portfolioName] = {};
      }
      if (portfolio[portfolioName].hasOwnProperty(securityId)) {
        return portfolio[portfolioName][securityId].inPortfolio;
      }
      return false;
    }
  };
};
