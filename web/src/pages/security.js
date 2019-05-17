import React, { Component } from 'react';

import LayoutBasic from '../components/LayoutBasic';
import Security from '../components/Security';
import Footer from '../components/Footer';
import RoundGraph from '../components/RoundGraph'
import gql from 'graphql-tag';

import { Query, Mutation } from 'react-apollo';

export const SECURITY_QUERY = gql`
  query GetSecurityDetails($id: String!) {
    security(id: $id) {
      id
      name
      longBusinessDescription
      ticker
      currency
      mic
      sector
      globalQuotes {
        date
        close
      }
      liveData {
        dateTime

        open
        last
        dayHigh
        dayLow
        netChange
        changePercent
        cumulativeVolume

        previousDayLow
        previousDayHigh
        previousOpen
        previousClose
        previousCloseDate
        previousTotalVolume

        previousChange
        previousChangePercent

        previousActiveDate

        totalTurnoverCurrency
      }
      factsetData {
        BookValue
        EarningsGrowth
        CEO
        MarketCapitalization
        CompanyFoundedDate
        Daily_DividendYieldDaily
      }
      calculated {
        PERatioCompany
        PERatioBranche
        PERatioMarket
        ROICCompany
        ROICBranche
        ROICMarket
        ROECompany
        ROEBranche
        ROEMarket
        RevenueGrowthCompany
        RevenueGrowthBranche
        RevenueGrowthMarket
        DebtRatioCompany
        DebtRatioBranche
        DebtRatioMarket
        NettDEBTEBITDACompany
        NettDEBTEBITDABranche
        NettDEBTEBITDAMarket
      }
      calculated3Y {
        SalesOrRevenueLY
        SalesOrRevenueLYMin1
        SalesOrRevenueLYMin2
        GrossIncomeLY
        GrossIncomeLYMin1
        GrossIncomeLYMin2
        OperatingIncomeLY
        OperatingIncomeLYMin1
        OperatingIncomeLYMin2
        ConsolidatedNetIncomeLY
        ConsolidatedNetIncomeLYMin1
        ConsolidatedNetIncomeLYMin2
      }
      calculated5Y {
        LY
        SalesOrRevenueLY
        SalesOrRevenueLYMin1
        SalesOrRevenueLYMin2
        DividendPayOutLY
        DividendPayOutLYMin1
        DividendPayOutLYMin2
        NetoperatingCashFlowLY
        NetoperatingCashFlowLYMin1
        NetoperatingCashFlowLYMin2
        NetoperatingCashFlowLYMin3
        NetoperatingCashFlowLYMin4
        NetFinancingCashFlowLY
        NetFinancingCashFlowLYMin1
        NetFinancingCashFlowLYMin2
        NetFinancingCashFlowLYMin3
        NetFinancingCashFlowLYMin4
        NetchangeInCashLY
        NetchangeInCashLYMin1
        NetchangeInCashLYMin2
        NetchangeInCashLYMin3
        NetchangeInCashLYMin4
        NetInvestingCashFlowLY
        NetInvestingCashFlowLYMin1
        NetInvestingCashFlowLYMin2
        NetInvestingCashFlowLYMin3
        NetInvestingCashFlowLYMin4
        EbitdaLY
        EbitdaLYMin1
        EbitdaLYMin2
        EbitdaLYMin3
        EbitdaLYMin4
      }
      historyPrice100 {
        Date
        Volume
        Close
      }
      top5IndustryHistory {
        security {
          id
          name
          ticker
          globalQuotes {
            date
            close
          }
        }
      }
      globalQuotes {
        date
        close
      }
      last3YearsDividend {
        Date
        ConsolidatedNetIncome
        ConsolidatedNetIncomeEUR
        DividendPayoutRatio
        RetainedEarningsEUR
        Currency
        RateEUR
      }
      last5AnnualTotals {
        Date
        TotalLiabilitiesStockholdersEquity
        TotalEquity
        TotalLiabilities
        TotalCash
        NonCurrentAssetsNoGoodwill
        CurrentAssetsNoCash
        Goodwill
      }
      calculatedCircular {
        Year
        Total
        Dividend
        Balance
        Growth
        Value
      }
    }
  }
`;

class SecurityPage extends Component {
  static async getInitialProps({ req, query }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    return { userAgent, securityId: query.id };
  }
  render() {
    const { session, navMenu, securityId } = this.props;
    return (
      <Query query={SECURITY_QUERY} variables={{ id: securityId }}>
        {({ loading, error, data }) => {
          if (loading) return `Loading...`;
          if (error) return `Error! ${error}`;
          const security = data.security;
          return (
            <div>
              <div className="columns is-desktop" style={{ marginBottom: '0px' }}>
                <div
                  className="column is-full-mobile is-full-tablet is-one-fifth-desktop is-2-widescreen is-2-fullhd"
                  style={{ backgroundColor: '#888' }}
                >
                  <div style={{ textAlign: 'center', margin: '20px' }}>
                    <img src="../../static/logo.png" />
                  </div>
                  <div style={{ textAlign: 'center', margin: '20px' }}>
                    <img style={{ borderRadius: '50%', width: '110px', height: '100px' }} src="../../static/man.png" />
                  </div>
                  <div className="has-text-white" style={{ textAlign: 'center' }}>
                    John Doe
                  </div>
                  <div
                    style={{
                      height: '200px',
                      margin: '10px',
                      borderWidth: '1px',
                      borderTopStyle: 'inset',
                      borderBottomStyle: 'outset',
                      color: 'gainsboro'
                    }}
                  >
                    <div  style={{ padding: '3px', paddingTop:'10px' }}>My Porfolio</div>
                    <div  style={{ padding: '3px' }}>Stocks</div>
                    <div  style={{ padding: '3px' }}>Scenarios</div>
                  </div>
                  <div style={{ textAlign: 'center', color: 'gainsboro'}}>My Current Portfolio Performance</div>
                  <div className={'RoundGraph' + security.id} style={{ width: '180px', height: '180px', display:'content', paddingTop:'20px' }}>
                    {security.calculatedCircular[0] != null ? (
                      <RoundGraph
                        key={security.id}
                        index={security.id}
                        params={security.calculatedCircular[security.calculatedCircular.length - 1]}
                      />
                    ) : (
                      <p>No data</p>
                    )}
                  </div>
                </div>
                <div
                  className="column is-full-mobile is-full-tablet is-four-fifths-desktop is-10-widescreen is-10-fullhd"
                  style={{ padding: '40px' }}
                >
                  <Security security={security} toggleLocalPortfolio={() => {}} />
                </div>
              </div>

              <Footer />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default SecurityPage;
