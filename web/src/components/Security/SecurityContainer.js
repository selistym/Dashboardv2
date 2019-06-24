import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import Query from 'react-apollo/Query';
import Loading from '../Loading';
import Security from './Security';
import SecurityLayout from './SecurityLayout';

import { usePortfolio } from '../../lib/custom-hooks';

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

export const SECURITY_SUBSCRIPTION = gql`
  subscription SecuritySearchSubscription($securityIds: [String]!) {
    securityUpdated(securityIds: $securityIds) {
      id
      liveData {
        dayHigh
        dayLow
        last
        cumulativeVolume
        netChange
        changePercent
      }
    }
  }
`;

const SecurityContainer = ({ securityId, session, short_security}) => {
  const { togglePortfolio, isInPortfolio } = usePortfolio({});
  
  return (
    <Query query={SECURITY_QUERY} variables={{ id: securityId }}>
      {({ loading, error, data, subscribeToMore }) => {
        if (error) return `Error! ${error}`;

        let security = null;

        if (loading) {
          if(short_security){
            security = short_security;
          }

        }else{//full loading
          security = data.security;
          subscribeToMore({
            document: SECURITY_SUBSCRIPTION,
            variables: { securityIds: [security.id] }
          });
        }

        return (
          <SecurityLayout security={security} session={session}>
            <Security
              security={security}
              togglePortfolio={() => togglePortfolio(securityId)}
              isInPortfolio={isInPortfolio(securityId)}
            />
          </SecurityLayout>
        );
      }}
    </Query>
  );
};

SecurityContainer.propTypes = {
  short_security: PropTypes.object,
  session: PropTypes.object.isRequired,
  securityId: PropTypes.string.isRequired
};

export default SecurityContainer;
