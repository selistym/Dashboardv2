import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AreaGraphContainer from '../AreaGraphContainer';
import CubismGraphContainer from '../CubismGraphContainer';
import NegativeGraphContainer from '../NegativeGraphContainer';
import BalanceGraphContainer from '../BalanceGraphContainer';
import RoundGraphContainer from '../RoundGraphContainer';
import StockGraphContainer from '../StockGraphContainer';
import GaugeGraphContainer from '../GaugeGraphContainer';

import { formatIntl, formatTime, formatDate, formatVolume } from '../../lib/format-intl';
import { useHighlight } from '../../lib/custom-hooks';

const Security = props => {
  const { togglePortfolio, isInPortfolio, security } = props;
  const last = +(security && security.liveData && security.liveData.last);
  const highlightClass = useHighlight(last);
  let changeClass = '';
  if (security && security.liveData && security.liveData.netChange < 0) changeClass = 'has-text-danger';
  if (security && security.liveData && security.liveData.netChange > 0) changeClass = 'has-text-success';
  
  console.log(security); // eslint-disable-line no-console
  return (
    <div>
      <div className="has-background-white-ter">
        <div className="box has-text-grey">
          <div className="columns is-mobile">
            <div className="column is-one-third-mobile is-one-fourth-tablet is-3-desktop is-one-fourth-widescreen is-one-fifth-fullhd">
              <img
                src={`../static/jpg/${security.sector}.jpg`}
                style={{ borderRadius: '3px', maxHeight: '420px', height: '100%' }}
              />
            </div>
            <div className="column is-two-thirds-mobile is-three-quarters-tablet is-three-quarters-desktop is-three-quarters-widescreen is-four-fifths-fullhd">
              <div className="columns" style={{marginBottom:'10px'}}>
                <div className="column is-8">
                  <h3
                    className="subtitle is-5 has-text-weight-bold has-text-grey"
                    style={{ height: '10px' }}
                  >{`Key figures ${security.name} (${security.ticker})`}</h3>
                </div>
                <div className="column is-4" style={{textAlign:'right'}}>
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
              <hr style={{marginTop: '5px'}}/>
              <div className="columns is-desktop">
                <div className="column is-full-mobile is-full-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd">
                  <div className="content" style={{ height: '360px', overflowY: 'scroll' }}>                    
                    <p style={{ paddingTop: '10px' }}>{security.longBusinessDescription}</p>
                  </div>
                </div>
                <div
                  className="column is-full-mobile is-full-tablet is-one-third-desktop is-one-third-widescreen is-one-third-fullhd"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <div className={'RoundGraph' + security.id} style={{ width: '220px', height: '230px' }}>
                    {security.calculatedCircular[0] != null ? (                      
                      <RoundGraphContainer
                        key={security.id}
                        idx={security.id}
                        params={security.calculatedCircular[security.calculatedCircular.length - 1]}
                        width={230}
                        height={220}
                      />
                    ) : (
                      <p>No data</p>
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
                  {last ? formatIntl(last, security.currency) : 'N/A'}
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
                  {security.sector}
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
                  {security.calculated3Y ? security.calculated3Y.SalesOrRevenueLY : 'undefined'}
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
                <h3 className="subtitle is-5 has-text-weight-bold has-text-grey">{security.factsetData.CEO}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>&nbsp;</h3>
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
                  <td className={highlightClass}>{last && security ? formatIntl(last, security.currency) : 'N/A'}</td>
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
          <div className="column is-8">
            <AreaGraphContainer data={security && security.historyPrice100} companyName={security && security.name} currency={security.currency}/>
          </div>
        </div>
      </div>

      <div className="box  has-text-grey is-mobile">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
          Price basics {security && security.name}
        </h3>
        <hr />
        <div className="columns">
          {security.calculated ? 
            <GaugeGraphContainer data={security.calculated} />
            : <p>No Data</p>}
        </div>
      </div>
      <div className="box  has-text-grey" style={{ height: '460px' }}>
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
          Historic performance
        </h3>
        <hr />
        {security.globalQuotes ? (
          security.top5IndustryHistory ? (
            <CubismGraphContainer data={[security, ...security.top5IndustryHistory.map(t => t.security)]} />
          ) : (
            <p>No Data</p>
          )
        ) : (
          <p>No Data</p>
        )}
      </div>
      <div className="columns is-desktop">
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
                        {security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin2
                          ? security.calculated3Y.SalesOrRevenueLYMin2.toFixed(0)
                          : 0}
                      </td>
                      <td>
                        {security.calculated3Y && security.calculated3Y.SalesOrRevenueLYMin1
                          ? security.calculated3Y.SalesOrRevenueLYMin1.toFixed(0)
                          : 0}
                      </td>
                      <td>
                        {security.calculated3Y && security.calculated3Y.SalesOrRevenueLY
                          ? security.calculated3Y.SalesOrRevenueLY.toFixed(0)
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Gross profit</strong>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.GrossIncomeLYMin2
                          ? security.calculated3Y.GrossIncomeLYMin2.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.GrossIncomeLYMin1
                          ? security.calculated3Y.GrossIncomeLYMin1.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.GrossIncomeLY
                          ? security.calculated3Y.GrossIncomeLY.toFixed(0)
                          : 0}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: 'gainsboro' }}>
                      <td>
                        <strong>Operating income</strong>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin2
                          ? security.calculated3Y.OperatingIncomeLYMin2.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.OperatingIncomeLYMin1
                          ? security.calculated3Y.OperatingIncomeLYMin1.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.OperatingIncomeLY
                          ? security.calculated3Y.OperatingIncomeLY.toFixed(0)
                          : 0}
                      </td>
                    </tr>
                    <tr className="has-text-weight-bold">
                      <td>
                        <strong>Net income</strong>
                        <strong className="has-text-danger">*</strong>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin2
                          ? security.calculated3Y.ConsolidatedNetIncomeLYMin2.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLYMin1
                          ? security.calculated3Y.ConsolidatedNetIncomeLYMin1.toFixed(0)
                          : 0}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {security.calculated3Y && security.calculated3Y.ConsolidatedNetIncomeLY
                          ? security.calculated3Y.ConsolidatedNetIncomeLY.toFixed(0)
                          : 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="column is-6">
                <StockGraphContainer data={security.last3YearsDividend} />
              </div>
            </div>
          </div>
        </div>
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
                    {security.factsetData.Daily_DividendYieldDaily ? (
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
              <div style={{ height: '285px', overflowY: 'scroll' }}>
                <strong>Explanation</strong>
                <ul>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, reiciendis, voluptates? Earum ex,
                    harum laudantium maxime molestias odio ratione ut! Dolore earum fugiat pariatur repudiandae
                    veritatis. Culpa debitis pariatur vel.50
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque expedita libero magnam minima
                    perspiciatis suscipit tempore? Ab atque iste optio!
                  </li>
                  <li>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis excepturi minima molestias neque
                    perspiciatis, quas?
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
          Cashflow
        </h3>
        <hr />
        <div className="columns">
          <div className="column is-1" />
          {security.sector != 'Finance' ?
            <div className="column is-2">
                <span style={{ color: 'red', fontWeight: '600', fontSize: '15pt' }}>|&nbsp;</span>
                <span>EBITDA</span>
            </div> : <></>
          }
          <div className="column is-2">
            <span style={{ color: 'LimeGreen', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
            <span>Cashflow from Operating activities</span>
          </div>
          <div className="column is-2">
            <span style={{ color: 'DarkGreen', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
            <span>Cashflow from Investing activites</span>
          </div>
          <div className="column is-2">
            <span style={{ color: 'grey', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
            <span>Cashflow from Financing activites</span>
          </div>
          <div className="column is-2">
            <span style={{ color: 'black', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
            <span>Change in Cash</span>
          </div>
          <div className="column is-1" />
        </div>
        <div className="columns">
          <div className="column is-6">
            <NegativeGraphContainer data={security.calculated5Y} sector={security.sector}/>
          </div>
          <div className="column is-6">
            <div className="content" style={{ height: '380px', overflowY: 'scroll' }}>
              <p>
                <strong className="has-text-danger">Important!: </strong> Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Animi at delectus dolor doloremque facilis iste non quam sapiente tempora totam! A
                accusantium, aliquid architecto consequuntur dolore ducimus, esse est ex explicabo facilis fugit id
                illum nisi nulla odio quidem quisquam, repellendus ut vel voluptatum! Assumenda dolorum eaque iste
                neque! Dicta esse facere, laudantium, minus nam nihil non nostrum officia perspiciatis, praesentium quos
                repudiandae. Aspernatur dolorum eum harum odio perspiciatis porro provident quasi recusandae repellendus
                reprehenderit! Blanditiis cupiditate dolorum iusto repellat tenetur! Ab eaque et facere maiores mollitia
                neque quod repellat reprehenderit similique? Ad aliquam autem beatae cupiditate doloribus, dolorum eius
                ipsa laboriosam modi nulla odit, quasi temporibus unde! Ab cum dolore maxime optio quae quo, suscipit
                totam! Beatae delectus deleniti doloremque eaque eius esse explicabo facere harum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium debitis delectus facere fugiat hic
                mollitia neque nihil numquam praesentium suscipit! Ab amet atque cupiditate, eveniet hic in inventore
                natus necessitatibus odio officia optio quae quidem quod recusandae sit tempore totam voluptatum? Autem
                debitis ipsam iure non possimus sapiente temporibus unde!
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium debitis delectus facere fugiat hic
                mollitia neque nihil numquam praesentium suscipit! Ab amet atque cupiditate, eveniet hic in inventore
                natus necessitatibus odio officia optio quae quidem quod recusandae sit tempore totam voluptatum? Autem
                debitis ipsam iure non possimus sapiente temporibus unde!
              </p>
              <strong>Explanation</strong>
              <ul>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="box  has-text-grey">
        <h3 className="subtitle is-5 has-text-weight-bold has-text-grey" style={{ height: '10px' }}>
          Balance
        </h3>

        <hr />
        <div className="columns">
          <div className="column is-6">
            <BalanceGraphContainer data={security.last5AnnualTotals} />
          </div>
          <div className="column is-6">
            <div className="content" style={{ height: '400px', overflowY: 'scroll' }}>
              <p>
                <strong className="has-text-danger">Important!: </strong> Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Animi at delectus dolor doloremque facilis iste non quam sapiente tempora totam! A
                accusantium, aliquid architecto consequuntur dolore ducimus, esse est ex explicabo facilis fugit id
                illum nisi nulla odio quidem quisquam, repellendus ut vel voluptatum! Assumenda dolorum eaque iste
                neque! Dicta esse facere, laudantium, minus nam nihil non nostrum officia perspiciatis, praesentium quos
                repudiandae. Aspernatur dolorum eum harum odio perspiciatis porro provident quasi recusandae repellendus
                reprehenderit! Blanditiis cupiditate dolorum iusto repellat tenetur! Ab eaque et facere maiores mollitia
                neque quod repellat reprehenderit similique? Ad aliquam autem beatae cupiditate doloribus, dolorum eius
                ipsa laboriosam modi nulla odit, quasi temporibus unde! Ab cum dolore maxime optio quae quo, suscipit
                totam! Beatae delectus deleniti doloremque eaque eius esse explicabo facere harum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium debitis delectus facere fugiat hic
                mollitia neque nihil numquam praesentium suscipit! Ab amet atque cupiditate, eveniet hic in inventore
                natus necessitatibus odio officia optio quae quidem quod recusandae sit tempore totam voluptatum? Autem
                debitis ipsam iure non possimus sapiente temporibus unde!
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium debitis delectus facere fugiat hic
                mollitia neque nihil numquam praesentium suscipit! Ab amet atque cupiditate, eveniet hic in inventore
                natus necessitatibus odio officia optio quae quidem quod recusandae sit tempore totam voluptatum? Autem
                debitis ipsam iure non possimus sapiente temporibus unde!
              </p>
              <strong>Explanation</strong>
              <ul>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem eligendi, explicabo
                  impedit iure laboriosam magni modi neque nihil optio quasi sed sunt, voluptate voluptatibus!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Security.propTypes = {
  togglePortfolio: PropTypes.func.isRequired,
  isInPortfolio: PropTypes.bool.isRequired,
  security: PropTypes.object.isRequired
};

export default Security;
