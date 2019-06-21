import React from 'react';
import PropTypes from 'prop-types';
import GaugeGraphContainer from '../GaugeGraphContainer';

const PriceBasicContainer = ({security}) => 
    <div className="box  has-text-grey is-mobile">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
            Price basics {security && security.name}
        </h3>
        <hr />
        {security && security.calculated ?
        <div className="columns">
            <GaugeGraphContainer data={security.calculated} />
        </div>
        : <span>No Data</span>}
    </div>

PriceBasicContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default PriceBasicContainer;