import React from 'react';
import PropTypes from 'prop-types';
import BalanceGraphContainer from '../BalanceGraphContainer';

const BalanceContainer = ({security}) => 
    <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
        Balance
        </h3>
        <hr />
        <div className="columns">
            {security && security.last5AnnualTotals && security.last5AnnualTotals.length > 0 ?
            <div className="column is-6">
                <BalanceGraphContainer data={security.last5AnnualTotals} />
            </div>
            : <span> No Data </span>
            }
            <div className="column is-6">
                <div className="content" style={{ height: '400px', overflowY: 'scroll' }}>
                <p>
                    The balance diagram consists of two sides, assets and liabilities. At both sides the total of the
                    categories amounts to the same number, the balance total.
                </p>

                <strong>Asset</strong>
                <p>
                    At the right side of the diagram, you will find the value of the assets of a company, divided in several
                    categories. Assets are the resources the company has a future economic benefit of. For example, this can
                    be in the form of buildings, machinery, inventory or cash. But also, intellectual property, like patents
                    and licences are assets.
                </p>
                <p>Human capital, like the skills that employees of the company have, are no part of the balance.</p>
                <strong>Liabilities</strong>
                <p>
                    The right side of the balance diagram gives a simplified overview on the capital structure of the
                    company. This consists of equity and debt. Equity is the amount of capital shareholders provided to the
                    company, along with earnings that have not been payed out to shareholders.
                </p>
                <p>
                    Debt is the total value of all long and short term obligations to creditors and lenders. A higher
                    debt-to-equity ratio means more risk for the company as a whole, as there is not much room to cover
                    setbacks.
                </p>
                </div>
            </div>
        </div>
    </div>

BalanceContainer.propTypes = {    
    security: PropTypes.object.isRequired
};

export default BalanceContainer;