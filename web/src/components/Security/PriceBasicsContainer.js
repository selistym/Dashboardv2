import React from 'react';
import PropTypes from 'prop-types';
import GaugeGraphContainer from '../GaugeGraphContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';

library.add(faChartPie);

const PriceBasicContainer = ({security}) => 
    <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
            Price basics {security && security.name}
        </h3>
        <hr />        
        <div className="columns" style={{height: security && security.calculated ? 'auto' : 400}}>
            <div className="column" style={{textAlign : 'center', alignSelf: 'center'}}>
                {security && security.calculated ?
                    <GaugeGraphContainer data={security.calculated} />
                    : <FontAwesomeIcon icon={faChartPie} size={"10x"} style={{opacity: 0.1}}/>}
            </div>
        </div>
    </div>

PriceBasicContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default PriceBasicContainer;