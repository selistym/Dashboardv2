import React from 'react'
import PropTypes from 'prop-types'
import CubismGraphContainer from '../CubismGraphContainer'
import Loading from '../Loading'

const HistoricPerformanceContainer = ({ security }) => (
  <div className='box has-text-grey'>
    <h3
      className='subtitle is-5 has-text-weight-bold has-text-grey'
      style={{ height: '10px' }}
    >
      Historical price performance in relation to Industry peers
    </h3>
    <hr />
    <div
      className='columns'
      style={{
        height:
          security.globalQuotes && security.top5IndustryHistory ? 400 : 'auto'
      }}
    >
      <div className='column' style={{ textAlign: 'center' }}>
        {security === undefined ||
        security.globalQuotes === undefined ||
        security.top5IndustryHistory === undefined ? (
          <Loading style={{ height: 300 }} />
          ) : security === null ||
          security.globalQuotes === null ||
          security.top5IndustryHistory === null ? (
            <span>No Data</span>
            ) : (
              <CubismGraphContainer
                data={[
                  security,
                  ...security.top5IndustryHistory.map(t => t.security)
                ]}
              />
            )}
      </div>
    </div>
  </div>
)

HistoricPerformanceContainer.propTypes = {
  security: PropTypes.object.isRequired
}

export default HistoricPerformanceContainer
