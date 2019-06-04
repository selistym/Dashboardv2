import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ResponsiveWrapper from './ResponsiveWrapper';

import NegativeChart from './NegativeChart';

class NegativeGraph extends Component {
  constructor(props) {
    super(props);
    const { parentWidth, data } = this.props;
    if (this.isEmpty(data)) {
      this.state = {
        is_empty: true
      };
    } else {
      this.state = {
        data: data,
        width: parentWidth > 850 ? 850 : Math.max(parentWidth, 350),
        height: 430,
        is_empty: false
      };
    }
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const { parentWidth, data } = nextProps;
    if (this.isEmpty(data)) {
      this.setState = {
        is_empty: true
      };
    } else {
      this.setState({
        data: data,
        width: parentWidth > 850 ? 850 : Math.max(parentWidth, 350),
        height: 430,
        is_empty: false
      });
    }
  }
  isEmpty(data) {
    return !data ? true : false;
  }
  preCorrection() {}
  render() {
    if (this.state.is_empty) {
      <Fragment>No data</Fragment>;
    } else {
      const { data } = this.state;
      let cap_data = [
        {
          year: data.LY,
          values: [
            { label: 'NetoperatingCashFlowLY', value: data.NetoperatingCashFlowLY ? data.NetoperatingCashFlowLY : 0 },
            { label: 'NetInvestingCashFlowLY', value: data.NetInvestingCashFlowLY ? data.NetInvestingCashFlowLY : 0 },
            { label: 'NetFinancingCashFlowLY', value: data.NetFinancingCashFlowLY ? data.NetFinancingCashFlowLY : 0 },
            { label: 'NetchangeInCashLY', value: data.NetchangeInCashLY ? data.NetchangeInCashLY : 0 },
            { label: 'EbitdaLY', value: data.EbitdaLY ? data.EbitdaLY : 0 }
          ]
        },
        {
          year: data.LY - 1,
          values: [
            {
              label: 'NetoperatingCashFlowLYMin1',
              value: data.NetoperatingCashFlowLYMin1 ? data.NetoperatingCashFlowLYMin1 : 0
            },
            {
              label: 'NetInvestingCashFlowLYMin1',
              value: data.NetInvestingCashFlowLYMin1 ? data.NetInvestingCashFlowLYMin1 : 0
            },
            {
              label: 'NetFinancingCashFlowLYMin1',
              value: data.NetFinancingCashFlowLYMin1 ? data.NetFinancingCashFlowLYMin1 : 0
            },
            { label: 'NetchangeInCashLYMin1', value: data.NetchangeInCashLYMin1 ? data.NetchangeInCashLYMin1 : 0 },
            { label: 'EbitdaLYMin1', value: data.EbitdaLYMin1 ? data.EbitdaLYMin1 : 0 }
          ]
        },
        {
          year: data.LY - 2,
          values: [
            {
              label: 'NetoperatingCashFlowLYMin2',
              value: data.NetoperatingCashFlowLYMin2 ? data.NetoperatingCashFlowLYMin2 : 0
            },
            {
              label: 'NetInvestingCashFlowLYMin2',
              value: data.NetInvestingCashFlowLYMin2 ? data.NetInvestingCashFlowLYMin2 : 0
            },
            {
              label: 'NetFinancingCashFlowLYMin2',
              value: data.NetFinancingCashFlowLYMin2 ? data.NetFinancingCashFlowLYMin2 : 0
            },
            { label: 'NetchangeInCashLYMin2', value: data.NetchangeInCashLYMin2 ? data.NetchangeInCashLYMin2 : 0 },
            { label: 'EbitdaLYMin2', value: data.EbitdaLYMin2 ? data.EbitdaLYMin2 : 0 }
          ]
        },
        {
          year: data.LY - 3,
          values: [
            {
              label: 'NetoperatingCashFlowLYMin3',
              value: data.NetoperatingCashFlowLYMin3 ? data.NetoperatingCashFlowLYMin3 : 0
            },
            {
              label: 'NetInvestingCashFlowLYMin3',
              value: data.NetInvestingCashFlowLYMin3 ? data.NetInvestingCashFlowLYMin3 : 0
            },
            {
              label: 'NetFinancingCashFlowLYMin3',
              value: data.NetFinancingCashFlowLYMin3 ? data.NetFinancingCashFlowLYMin3 : 0
            },
            { label: 'NetchangeInCashLYMin3', value: data.NetchangeInCashLYMin3 ? data.NetchangeInCashLYMin3 : 0 },
            { label: 'EbitdaLYMin3', value: data.EbitdaLYMin3 ? data.EbitdaLYMin3 : 0 }
          ]
        },
        {
          year: data.LY - 4,
          values: [
            {
              label: 'NetoperatingCashFlowLYMin4',
              value: data.NetoperatingCashFlowLYMin4 ? data.NetoperatingCashFlowLYMin4 : 0
            },
            {
              label: 'NetInvestingCashFlowLYMin4',
              value: data.NetInvestingCashFlowLYMin4 ? data.NetInvestingCashFlowLYMin4 : 0
            },
            { label: 'NetchangeInCashLYMin4', value: data.NetchangeInCashLYMin4 ? data.NetchangeInCashLYMin4 : 0 },
            {
              label: 'NetFinancingCashFlowLYMin4',
              value: data.NetFinancingCashFlowLYMin4 ? data.NetFinancingCashFlowLYMin4 : 0
            },
            { label: 'EbitdaLYMin4', value: data.EbitdaLYMin4 ? data.EbitdaLYMin4 : 0 }
          ]
        }
      ];

      return (
        <Fragment>
          <NegativeChart data={cap_data} width={this.state.width} height={this.state.height} />
        </Fragment>
      );
    }
  }
}

NegativeGraph.propTypes = {
  parentWidth: PropTypes.number.isRequired,
  data: PropTypes.shape({
    DividendPayOutLY: PropTypes.number,
    DividendPayOutLYMin1: PropTypes.number,
    DividendPayOutLYMin2: PropTypes.number,
    EbitdaLY: PropTypes.number,
    EbitdaLYMin1: PropTypes.number,
    EbitdaLYMin2: PropTypes.number,
    EbitdaLYMin3: PropTypes.number,
    EbitdaLYMin4: PropTypes.number,
    LY: PropTypes.number,
    NetFinancingCashFlowLY: PropTypes.number,
    NetFinancingCashFlowLYMin1: PropTypes.number,
    NetFinancingCashFlowLYMin2: PropTypes.number,
    NetFinancingCashFlowLYMin3: PropTypes.number,
    NetFinancingCashFlowLYMin4: PropTypes.number,
    NetInvestingCashFlowLY: PropTypes.number,
    NetInvestingCashFlowLYMin1: PropTypes.number,
    NetInvestingCashFlowLYMin2: PropTypes.number,
    NetInvestingCashFlowLYMin3: PropTypes.number,
    NetInvestingCashFlowLYMin4: PropTypes.number,
    NetchangeInCashLY: PropTypes.number,
    NetchangeInCashLYMin1: PropTypes.number,
    NetchangeInCashLYMin2: PropTypes.number,
    NetchangeInCashLYMin3: PropTypes.number,
    NetchangeInCashLYMin4: PropTypes.number,
    NetoperatingCashFlowLY: PropTypes.number,
    NetoperatingCashFlowLYMin1: PropTypes.number,
    NetoperatingCashFlowLYMin2: PropTypes.number,
    NetoperatingCashFlowLYMin3: PropTypes.number,
    NetoperatingCashFlowLYMin4: PropTypes.number,
    SalesOrRevenueLY: PropTypes.number,
    SalesOrRevenueLYMin1: PropTypes.number,
    SalesOrRevenueLYMin2: PropTypes.number
  })
};
export default ResponsiveWrapper(NegativeGraph);
