import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { formatIntl } from '../../lib/format-intl';
import RoundGraphContainer from '../RoundGraphContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAlignLeft, faChartPie } from '@fortawesome/free-solid-svg-icons';

library.add(faAlignLeft);
library.add(faChartPie);

const KeyFigureContainer = ({security, isInPortfolio, togglePortfolio, lastPointed}) => 
    <div className="box has-text-grey">
        <div className="columns is-mobile">
        <div className="column is-one-third-mobile is-one-fourth-tablet is-3-desktop is-one-fourth-widescreen is-one-fifth-fullhd">
            <img
            src={`../static/jpg/${security.sector}.jpg`}
            style={{ borderRadius: '3px', maxHeight: '420px', height: '100%' }}
            />
        </div>
        <div className="column is-two-thirds-mobile is-three-quarters-tablet is-three-quarters-desktop is-three-quarters-widescreen is-four-fifths-fullhd">
            <div className="columns" style={{ marginBottom: '10px' }}>
                <div className="column is-8">
                    <h3
                    className="subtitle is-5 has-text-weight-bold has-text-grey"
                    style={{ height: '10px' }}
                    >{`Key figures ${security.name ? security.name : ''} (${security.ticker ? security.ticker : ''})`}</h3>
                </div>
                <div className="column is-4" style={{ textAlign: 'right' }}>
                    {isInPortfolio ? (
                    <button className="button is-small is-danger" onClick={() => togglePortfolio()}>
                        - Remove from portfolio
                    </button>
                    ) : (
                    <button className="button is-small is-danger" onClick={() => togglePortfolio()}>
                        + Add to portfolio
                    </button>
                    )}
                </div>
            </div>
            <hr style={{ marginTop: '5px' }} />
            <div className="columns is-desktop" style={{height: 360}}>
                <div className="column is-full-mobile is-full-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd" 
                    style={{textAlign: 'center', height: 360}}
                >                        
                    <Scrollbars style={{ width: '100%'}}>
                        {security.longBusinessDescription ?
                            <p style={{textAlign: 'left'}}>{security.longBusinessDescription}</p>
                            : <FontAwesomeIcon icon={faAlignLeft} size={"10x"} style={{opacity: 0.1, marginTop: 80}}/>}
                    </Scrollbars>
                </div>
                <div
                    className="column is-full-mobile is-full-tablet is-one-third-desktop is-one-third-widescreen is-one-third-fullhd"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <div className={'RoundGraph' + security.id} style={{ width: '220px', height: '230px' }}>
                        {security && security.calculatedCircular && security.calculatedCircular[0] != null ? (
                            <RoundGraphContainer
                                key={security.id}
                                idx={security.id}
                                params={security.calculatedCircular[security.calculatedCircular.length - 1]}
                                width={230}
                                height={220}
                            />
                        ) : (
                            <FontAwesomeIcon icon={faChartPie} size={"10x"} style={{opacity: 0.1}}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>

        <div className="columns" style={{ paddingLeft: '25px' }}>
        <div className="column is-2">
            <div className="columns">
            <h3 className="subtitle is-6 has-text-weight-bold has-text-grey" style={{ height: '25px' }}>
                Price
            </h3>
            </div>
            <div className="columns" style={{ height: '50px' }}>
            <h3 className={classNames('subtitle', 'is-4', 'has-text-weight-bold', 'has-text-grey')}>
                {lastPointed ? formatIntl(lastPointed, security.currency) : 'N/A'}
            </h3>
            </div>
        </div>
        <div className="column is-3">
            <div className="columns">
            <h3 className="subtitle is-6 has-text-weight-bold has-text-grey" style={{ height: '25px' }}>
                &nbsp;Branche
            </h3>
            </div>
            <div className="columns" style={{ height: '50px', fontSize: 'small' }}>
            <div className="column is-2" style={{ padding: 'inherit' }}>
                <img src={`../static/svg/${security.sector}.svg`} style={{ height: '34px' }} />
            </div>
            <div className="column is-10" style={{ padding: 'inherit' }}>
                {security.sector ? security.sector : ''}
            </div>
            </div>
        </div>

        <div className="column is-2">
            <div className="columns">
            <h3 className="subtitle is-6 has-text-weight-bold has-text-grey" style={{ height: '25px' }}>
                Revenue
            </h3>
            </div>
            <div className="columns" style={{ height: '50px' }}>
            <h3 className="subtitle is-4 has-text-weight-bold has-text-grey">
                {security.calculated3Y ? security.calculated3Y.SalesOrRevenueLY : 'N/A'}
            </h3>
            </div>
        </div>

        <div className="column is-2">
            <div className="columns">
            <h3 className="subtitle is-6 has-text-weight-bold has-text-grey" style={{ height: '25px' }}>
                Market cap
            </h3>
            </div>
            <div className="columns" style={{ height: '50px' }}>
            <h3 className="subtitle is-4 has-text-weight-bold has-text-grey">
                {security && security.factsetData && security.factsetData.MarketCapitalizatino
                ? `${security.factsetData.MarketCapitalization.toFixed(1)}B`
                : 'N/A'}
            </h3>
            </div>
        </div>
        <div className="column is-3">
            <div className="columns">
            <h3 className="subtitle is-6 has-text-weight-bold has-text-grey" style={{ height: '25px' }}>
                CEO
            </h3>
            </div>
            <div className="columns" style={{ height: '50px' }}>
            <h3 className="subtitle is-5 has-text-weight-bold has-text-grey">{security && security.factsetData && security.factsetData.CEO ? security.factsetData.CEO : 'N/A'}</h3>
            </div>
        </div>
        </div>
    </div>

KeyFigureContainer.propTypes = {
    togglePortfolio: PropTypes.func.isRequired,
    isInPortfolio: PropTypes.bool.isRequired,
    security: PropTypes.object.isRequired,
    lastPointed: PropTypes.number
};
  
export default KeyFigureContainer;