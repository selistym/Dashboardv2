import React from 'react';
import PropTypes from 'prop-types';
import GaugeGraphContainer from '../GaugeGraphContainer';
import Loading from '../Loading';

const PriceBasicContainer = ({security}) => 
    <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
        Key performance indicators {security && security.name}
        </h3>
        <hr />        
        <div className="columns" style={{height: security && security.calculated ? 'auto' : 400}}>
            <div className="column" style={{textAlign : 'center', alignSelf: 'center'}}>
                {security && security.calculated ?
                    <GaugeGraphContainer data={security.calculated} />
                    : <Loading style={{height: 300}}/>}
            </div>
        </div>
    </div>

PriceBasicContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default PriceBasicContainer;