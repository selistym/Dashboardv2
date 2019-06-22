import React from 'react';
import PropTypes from 'prop-types';
import StockGraphContainer from '../StockGraphContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

library.add(faChartBar);

const ProfitDistributionContainer = ({security}) => 
    <div className="column is-mobile is-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd">
        <div className="box  has-text-grey">
            <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
                Profit distribution
            </h3>
            <hr />
            <div className="columns">
                <div className="column is-6">
                <p style={{ fontStyle: 'italic' }}>In millions &euro;</p>
                <table style={{ verticalAlign: 'middle', width: '100%' }}>
                    <tbody style={{ lineHeight: 2 }}>
                    <tr>
                        <td />
                        <td>
                        <strong>2016</strong>
                        </td>
                        <td>
                        <strong>2017</strong>
                        </td>
                        <td>
                        <strong>2018</strong>
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>
                        <strong>Revenue</strong>
                        </td>
                        <td>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin2
                            ? security.calculated3Y.SalesOrRevenueLYMin2.toFixed(0) : 0}
                        </td>
                        <td>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin1
                            ? security.calculated3Y.SalesOrRevenueLYMin1.toFixed(0) : 0}
                        </td>
                        <td>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLY
                            ? security.calculated3Y.SalesOrRevenueLY.toFixed(0) : 0}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <strong>Gross profit</strong>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLYMin2
                            ? security.calculated3Y.GrossIncomeLYMin2.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLYMin1
                            ? security.calculated3Y.GrossIncomeLYMin1.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLY
                            ? security.calculated3Y.GrossIncomeLY.toFixed(0) : 0}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>
                        <strong>Operating income</strong>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin2
                            ? security.calculated3Y.OperatingIncomeLYMin2.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin1
                            ? security.calculated3Y.OperatingIncomeLYMin1.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLY
                            ? security.calculated3Y.OperatingIncomeLY.toFixed(0) : 0}
                        </td>
                    </tr>
                    <tr className="has-text-weight-bold">
                        <td>
                        <strong>Net income</strong>
                        <strong className="has-text-danger">*</strong>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin2
                            ? security.calculated3Y.ConsolidatedNetIncomeLYMin2.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin1
                            ? security.calculated3Y.ConsolidatedNetIncomeLYMin1.toFixed(0) : 0}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLY
                            ? security.calculated3Y.ConsolidatedNetIncomeLY.toFixed(0) : 0}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>                
                <div className="column is-6" style={{textAlign: 'center'}}>
                    {security && security.last3YearsDividend && security.last3YearsDividend.length > 0 ?
                        <StockGraphContainer data={security.last3YearsDividend} />
                        : <FontAwesomeIcon icon={faChartBar} size={"10x"} style={{opacity: 0.1}}/>}
                </div>
                
            </div>
        </div>
    </div>

ProfitDistributionContainer.propTypes = {
    security: PropTypes.object.isRequired
};

export default ProfitDistributionContainer;