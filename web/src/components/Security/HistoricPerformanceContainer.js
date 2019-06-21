import React from 'react';
import PropTypes from 'prop-types';
import CubismGraphContainer from '../CubismGraphContainer';

const HistoricPerformanceContainer = ({security}) => 
    <div className="box has-text-grey" style={{ height: '460px' }}>
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
            Historic performance
        </h3>
        <hr />
        {security && security.globalQuotes && security.top5IndustryHistory ? 
            <CubismGraphContainer data={[security, ...security.top5IndustryHistory.map(t => t.security)]} />
        : <span> No Data </span>}
    </div>

HistoricPerformanceContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default HistoricPerformanceContainer;