import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';

const DividendYieldContainer = ({security}) => 
    <div className="column is-mobile is-tablet is-one-third-desktop is-one-third-widescreen is-one-third-fullhd">
        <div className="box  has-text-grey">
            <h4 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
                Dividend Yield
            </h4>
            <hr />
            <div className="content">
                <div className="columns is-mobile" style={{ height: '40px' }}>
                <div className="column is-one-two-mobile is-one-two-tablet has-text-centered">
                    <h4 className="subtitle is-3 has-text-weight-bold has-text-grey">
                    {security && security.factsetData && security.factsetData.Daily_DividendYieldDaily ? (
                        (security.factsetData.Daily_DividendYieldDaily * 100).toFixed(1) + '%'
                    ) : (
                        <p>No Data</p>
                    )}
                    </h4>
                </div>
                </div>
                <div className="columns is-mobile" style={{ height: '42px' }}>
                <div className="column is-one-two-mobile is-one-two-tablet has-text-centered">Dividend Yield</div>
                </div>
                <div>
                    <Scrollbars style={{ width: '100%', height: 285 }}>
                        <ul>
                            <li>
                            The Dividend Yield is the percentual income you get from dividend, based on the current share price.
                            </li>
                            <li>
                            The graph shows the total income of the last three book years, along with the percentage that has
                            been payed out to shareholders, the pay-out ratio. Higher values of this ratio correspond to a
                            higher risk whether this level of dividend can be maintained.
                            </li>
                        </ul>
                    </Scrollbars>
                </div>
            </div>
        </div>
    </div>


DividendYieldContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default DividendYieldContainer;