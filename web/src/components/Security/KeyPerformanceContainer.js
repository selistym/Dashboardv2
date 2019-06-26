import React from 'react';
import PropTypes from 'prop-types';
import GaugeGraphContainer from '../GaugeGraphContainer';
import Loading from '../Loading';

const KeyPerformanceContainer = ({security}) => 
    <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
        Key performance indicators {security && security.name}
        </h3>
        <hr />        
        <div className="columns" style={{height: security && security.calculated ? 'auto' : 400}}>
            <div className="column" style={{textAlign : 'center', alignSelf: 'center'}}>
                {security === undefined || security.calculated === undefined ? <Loading style={{height: 300}}/>
                    : security === null || security.calculated === null ? <span>No Data</span>
                    : <GaugeGraphContainer data={security.calculated} />
                }
            </div>
        </div>
    </div>

KeyPerformanceContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default KeyPerformanceContainer;