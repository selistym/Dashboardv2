import React from 'react';
import PropTypes from 'prop-types';
import CubismGraphContainer from '../CubismGraphContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';

library.add(faAlignJustify);

const HistoricPerformanceContainer = ({security}) => 
    <div className="box has-text-grey">        
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
            Historic performance
        </h3>        
        <hr />
        <div className="columns" style={{ height: 400 }}>
            <div className="column" style={{textAlign: 'center'}}>
                {security && security.globalQuotes && security.top5IndustryHistory ? 
                    <CubismGraphContainer data={[security, ...security.top5IndustryHistory.map(t => t.security)]} />
                : <FontAwesomeIcon icon={faAlignJustify} size={"10x"} style={{opacity: 0.1, marginTop: 70}}/>}
            </div>
        </div>
    </div>

HistoricPerformanceContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default HistoricPerformanceContainer;