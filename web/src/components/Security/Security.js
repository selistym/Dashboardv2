import React from 'react'
import PropTypes from 'prop-types'

import KeyFigureContainer from './KeyFigureContainer'
import PriceContainer from './PriceContainer'
import KeyPerformanceContainer from './KeyPerformanceContainer'
import HistoricPerformanceContainer from './HistoricPerformanceContainer'
import ProfitDistributionContainer from './ProfitDistributionContainer'
import DividendYieldContainer from './DividendYieldContainer'
import CashFlowContainer from './CashFlowContainer'
import BalanceContainer from './BalanceContainer'

const Security = props => {
  const { togglePortfolio, isInPortfolio, security } = props
  const last = +(security && security.liveData && security.liveData.last)

  console.log(security) // eslint-disable-line no-console
  return (
    <div>
      {security ? (
        <>
          <KeyFigureContainer
            security={security}
            isInPortfolio={isInPortfolio}
            togglePortfolio={togglePortfolio}
            lastPointed={last}
          />
          <PriceContainer security={security} lastPointed={last} />
          <KeyPerformanceContainer security={security} />
          <div className='columns is-desktop'>
            <ProfitDistributionContainer security={security} />
            <DividendYieldContainer security={security} />
          </div>
          <CashFlowContainer security={security} />
          <BalanceContainer security={security} />
          <HistoricPerformanceContainer security={security} />
        </>
      ) : (
        'Empty Security'
      )}
    </div>
  )
}

Security.propTypes = {
  togglePortfolio: PropTypes.func.isRequired,
  isInPortfolio: PropTypes.bool.isRequired,
  security: PropTypes.object.isRequired
}

export default Security
