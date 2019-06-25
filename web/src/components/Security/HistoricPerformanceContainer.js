import React from 'react';
import PropTypes from 'prop-types';
import CubismGraphContainer from '../CubismGraphContainer';
import Loading from '../Loading';

const HistoricPerformanceContainer = ({security}) => 
    <div className="box has-text-grey">        
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
           Historical price performance in relation to Industry peers
        </h3>        
        <hr />
        <div className="columns" style={{ height: 400 }}>
            <div className="column" style={{textAlign: 'center'}}>
                {security && security.globalQuotes && security.top5IndustryHistory ? 
                    <CubismGraphContainer data={[security, ...security.top5IndustryHistory.map(t => t.security)]} />
                : <Loading style={{height: 300}}/>}
            </div>
        </div>
    </div>

HistoricPerformanceContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default HistoricPerformanceContainer;