import React from 'react';
import PropTypes from 'prop-types';
import { useHighlight } from '../../lib/custom-hooks';
import { formatIntl, formatTime, formatDate, formatVolume } from '../../lib/format-intl';

import AreaGraphContainer from '../AreaGraphContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChartArea } from '@fortawesome/free-solid-svg-icons';
library.add(faChartArea);

const PriceContainer = ({security, lastPointed}) => {
    const highlightClass = useHighlight(lastPointed);
    let changeClass = '';
    if (security && security.liveData && security.liveData.netChange < 0) changeClass = 'has-text-danger';
    if (security && security.liveData && security.liveData.netChange > 0) changeClass = 'has-text-success';
    return (
        <div className="box  has-text-grey">
            <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
                Price
            </h3>
            <hr />
            <div className="columns">
                <div className="column is-4">
                <table className="table is-striped is-narrow is-hoverable is-fullwidth ">
                    <tbody>
                    <tr>
                        <td>Date</td>
                        <td>
                        {security && security.liveData && security.liveData.dateTime
                            ? formatDate(security.liveData.dateTime)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Time</td>
                        <td>
                        {security && security.liveData && security.liveData.dateTime
                            ? formatTime(security.liveData.dateTime)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td className={highlightClass}>{lastPointed && security ? formatIntl(lastPointed, security.currency) : 'N/A'}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Difference</td>
                        <td>
                        {security && security.liveData && security.liveData.netChange
                            ? formatIntl(security.liveData.netChange)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Difference (%)</td>
                        <td className={changeClass}>
                        {security && security.liveData && security.liveData.changePercent
                            ? formatIntl(security.liveData.changePercent)
                            : 'N/A'}
                        %
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Previous opening price</td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.liveData && security.liveData.previousOpen
                            ? formatIntl(security.liveData.previousOpen)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Previous closing price</td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.liveData && security.liveData.previousClose
                            ? formatIntl(security.liveData.previousClose)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Lowest price</td>
                        <td>
                        {security && security.liveData && security.liveData.dayLow
                            ? formatIntl(security.liveData.dayLow)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Highest price</td>
                        <td style={{ verticalAlign: 'middle' }}>
                        {security && security.liveData && security.liveData.dayHigh
                            ? formatIntl(security.liveData.dayHigh)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Volume</td>
                        <td>
                        {security && security.liveData && security.liveData.cumulativeVolume
                            ? formatVolume(security.liveData.cumulativeVolume)
                            : 'N/A'}
                        </td>
                    </tr>
                    <tr>
                        <td>Currency</td>
                        <td>{security && security.currency}</td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                        <td>Market</td>
                        <td>{security && security.mic}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <div className="column is-8" style={{textAlign: 'center', alignSelf: 'center'}}>
                    {security && security.historyPrice100 && security.historyPrice100.length > 0 ?                    
                        <AreaGraphContainer
                            data={security.historyPrice100}
                            companyName={security.name}
                            currency={security.currency}
                        />
                        : <FontAwesomeIcon icon={faChartArea} size={"10x"} style={{opacity: 0.1}}/>}
                </div>
            </div>
        </div>
    );
}
PriceContainer.propTypes = {    
    security: PropTypes.object.isRequired,
    lastPointed: PropTypes.number
};

export default PriceContainer;