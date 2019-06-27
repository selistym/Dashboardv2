import React from 'react';
import PropTypes from 'prop-types';
import StockGraphContainer from '../StockGraphContainer';
import { formatIntl } from '../../lib/format-intl';
import Loading from '../Loading';

const ProfitDistributionContainer = ({security}) => 
    <div className="column is-mobile is-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd">
        <div className="box  has-text-grey">
            <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
                Profit distribution
            </h3>
            <hr />
            <div className="columns">
                <div className="column is-7">
                <p style={{ fontStyle: 'italic' }}>In millions &euro;</p>
                <table style={{ verticalAlign: 'middle', width: '100%' }}>
                    <tbody style={{ lineHeight: 2.5 }}>
                    <tr>
                        <td style={{width: '40%'}}/>
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
                    <tr style={{ backgroundColor: 'gainsboro'}}>
                        <td>
                        <strong>Revenue</strong>
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin2
                            ? formatIntl(security.calculated3Y.SalesOrRevenueLYMin2) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin1
                            ? formatIntl(security.calculated3Y.SalesOrRevenueLYMin1) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.SalesOrRevenueLY
                            ? formatIntl(security.calculated3Y.SalesOrRevenueLY) : 0}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <strong>Gross profit</strong>
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLYMin2
                            ? formatIntl(security.calculated3Y.GrossIncomeLYMin2) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLYMin1
                            ? formatIntl(security.calculated3Y.GrossIncomeLYMin1) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.GrossIncomeLY
                            ? formatIntl(security.calculated3Y.GrossIncomeLY) : 0}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>
                        <strong>Operating income</strong>
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin2
                            ? formatIntl(security.calculated3Y.OperatingIncomeLYMin2) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin1
                            ? formatIntl(security.calculated3Y.OperatingIncomeLYMin1) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.OperatingIncomeLY
                            ? formatIntl(security.calculated3Y.OperatingIncomeLY) : 0}
                        </td>
                    </tr>
                    <tr className="has-text-weight-bold">
                        <td>
                        <strong>Net income</strong>
                        <strong className="has-text-danger">*</strong>
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin2
                            ? formatIntl(security.calculated3Y.ConsolidatedNetIncomeLYMin2) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin1
                            ? formatIntl(security.calculated3Y.ConsolidatedNetIncomeLYMin1) : 0}
                        </td>
                        <td style={{fontSize: 15, verticalAlign: 'middle'}}>
                        {security && security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLY
                            ? formatIntl(security.calculated3Y.ConsolidatedNetIncomeLY) : 0}
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>                
                <div className="column is-5" style={{textAlign: 'center'}}>
                    {security === undefined || security.last3YearsDividend === undefined ? <Loading style={{height: 300}}/>
                        : security === null || security.last3YearsDividend === null || security.last3YearsDividend.length == 0 ? <span>No Data</span>
                        : <StockGraphContainer data={security.last3YearsDividend} />
                    }
                </div>
                
            </div>
        </div>
    </div>

ProfitDistributionContainer.propTypes = {
    security: PropTypes.object.isRequired
};

export default ProfitDistributionContainer;