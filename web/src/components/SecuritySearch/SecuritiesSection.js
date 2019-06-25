import React, { useEffect, useContext } from 'react';
import LocalPortfolio from '../LocalPortfolio';
import { AppContext } from '../AppContext';
import PropTypes from 'prop-types';

const SecuritiesSection = ({ securities, loadMoreSecurities, subscribeToSecurities }) => {
  // initialize subscriptions
  const { store } = useContext(AppContext);
  useEffect(() => {
    subscribeToSecurities();
  });

  if (securities === undefined) {
    return null;
  }
  
  const availableForArea = sc => {    
    let canBeShow = [false, false, false, false];
    if(sc == null || sc.calculatedCircular == null || sc.calculatedCircular[0].Year != store.securityFilterYear) return false;
    
    if(store.securityFilterArea.length == 0) return true;
    
    if(store.securityFilterArea.indexOf("Balance") != -1 && sc.calculatedCircular[0].Balance >= 75){
      canBeShow[0] = true;
    }
    if(store.securityFilterArea.indexOf("Dividend") != -1 && sc.calculatedCircular[0].Dividend >= 75){
      canBeShow[1] = true;
    }
    if(store.securityFilterArea.indexOf("Growth") != -1 && sc.calculatedCircular[0].Growth >= 75){
      canBeShow[2] = true;
    }
    if(store.securityFilterArea.indexOf("Value") != -1 && sc.calculatedCircular[0].Value >= 75){
      canBeShow[3] = true;
    }    
    return canBeShow.filter(show => show == true).length > 0;
  }
  return (
    <section style={{ minHeight:'500px' }}>
      <div
        className="columns is-mobile"
        style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around', padding:'30px' }}
        data-testid="filtered-securities"
      >
        {securities.map(s => (
          availableForArea(s) &&
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
