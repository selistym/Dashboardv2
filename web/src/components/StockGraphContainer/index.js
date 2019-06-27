import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import useDimensions from '../Dimensions';
import * as d3 from 'd3';

const margin = 20;

const StockGraph = ({ data, width, height }) => {
  const graphRef = useRef();
  const drawGraph = (w, h, param) => {
    const formatTime = d3.timeFormat('%Y');
    let max = d3.max(param.map(d => d.ConsolidatedNetIncome)),
      min = d3.min(param.map(d => d.ConsolidatedNetIncome)),
      domain_min,
      domain_max,
      ext = 0.1,
      durate = 1000;

    if (min < 0 && max < 0) {
      domain_min = min + min * ext;
      domain_max = 0;
    } else if (min > 0 && max > 0) {
      domain_min = 0;
      domain_max = max + max * ext;
    } else if (min < 0 && max > 0) {
      domain_min = min + min * ext;
      domain_max = max + max * ext;
    } else if (min < 0 && max == 0) {
      domain_min = min + min * ext;
      domain_max = 0;
    } else if (min == 0 && max > 0) {
      domain_min = 0;
      domain_max = max + max * ext;
    } else {
      domain_min = 0;
      domain_max = 0;
    }    

    let x = d3
        .scaleBand()
        .range([0, w - margin * 2])
        .domain(param.map(d => formatTime(new Date(d.Date)))),
      y = d3
        .scaleLinear()
        .domain([domain_min, domain_max])
        .rangeRound([h - margin, margin]),
      xAxis = d3.axisBottom(x).tickSize(0),
      yAxis = d3
        .axisLeft(y)
        .tickSize(10)
        .ticks(10);

    d3.select(graphRef.current)
      .selectAll('*')
      .remove();

    const xAxisArea = d3
      .select(graphRef.current)
      .append('g')
      .attr('class', 'x-axis-stock')
      .attr('transform', `translate(${margin * 2}, ${y(0)})`)
      .attr('stroke-width', 2)
      .call(xAxis);

    xAxisArea
      .selectAll('text')
      .attr('transform', `translate(0, ${y(domain_min) - y(0)})`)
      .attr('dy', '1.2em')
      .style('font-size', '10pt');

    d3.select(graphRef.current)
      .append('g')
      .attr('class', 'y-axis-stock')
      .attr('transform', `translate(${margin * 2}, 0)`)
      .attr('stroke-width', 1.5)
      .call(yAxis);

    const stock = d3
      .select(graphRef.current)
      .append('g')
      .attr('transform', `translate(${margin * 2}, ${y(0)})`);

    stock
      .append('g')
      .attr('class', 'group-grey-stock')
      .selectAll('path-group-grey-stock')
      .data(param)
      .enter()
      .append('path')
      .attr('fill', '#a2a2a2')
      .attr('d', d => {
        let strPath = '',
          rsz = 5,
          b_w = 30,
          x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2;

        if (d.ConsolidatedNetIncome > 0) {
          strPath =
            'M' +
            (x_pos - b_w / 2) +
            ',0' +
            'l' +
            b_w +
            ',0' +
            'l0,' +
            -rsz +
            'q0,' +
            -rsz +
            ',' +
            -rsz +
            ',' +
            -rsz +
            'l' +
            -(b_w - rsz * 2) +
            ',0' +
            'q' +
            -rsz +
            ',0,' +
            -rsz +
            ',' +
            rsz +
            'l0,' +
            rsz +
            'Z';
        } else {
          strPath =
            'M' +
            (x_pos - b_w / 2) +
            ',0' +
            'l' +
            b_w +
            ',0' +
            'l0,' +
            rsz +
            'q0,' +
            rsz +
            ',' +
            -rsz +
            ',' +
            rsz +
            'l' +
            -(b_w - rsz * 2) +
            ',0' +
            'q' +
            -rsz +
            ',0,' +
            -rsz +
            ',' +
            -rsz +
            'l0,' +
            -rsz +
            'Z';
        }
        return strPath;
      });

    stock
      .select('.group-grey-stock')
      .selectAll('path')
      .transition()
      .duration(durate)
      .attr('d', d => {
        let strPath = '',
          rsz = 5,
          b_w = 30,
          x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2,
          h = Math.abs(y(d.ConsolidatedNetIncome) - y(0));

        if (d.ConsolidatedNetIncome > 0) {
          strPath =
            'M' +
            (x_pos - b_w / 2) +
            ',0' +
            'l' +
            b_w +
            ',0' +
            'l0,' +
            -(h - rsz) +
            'q0,' +
            -rsz +
            ',' +
            -rsz +
            ',' +
            -rsz +
            'l' +
            -(b_w - rsz * 2) +
            ',0' +
            'q' +
            -rsz +
            ',0,' +
            -rsz +
            ',' +
            rsz +
            'l0,' +
            (h - rsz) +
            'Z';
        } else {
          strPath =
            'M' +
            (x_pos - b_w / 2) +
            ',0' +
            'l' +
            b_w +
            ',0' +
            'l0,' +
            (h - rsz) +
            'q0,' +
            rsz +
            ',' +
            -rsz +
            ',' +
            rsz +
            'l' +
            -(b_w - rsz * 2) +
            ',0' +
            'q' +
            -rsz +
            ',0,' +
            -rsz +
            ',' +
            -rsz +
            'l0,' +
            -(h - rsz) +
            'Z';
        }
        return strPath;
      });
    
    
    stock
      .append('g')
      .attr('class', 'group-red-stock')
      .selectAll('path-group-red-stock')
      .data(param)
      .enter()
      .append('path')
      .attr('fill', '#df072c')
      .attr('d', d => {
        let strPath = '',
          b_w = 30,
          x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2;

        if (d.ConsolidatedNetIncome > 0) {
          strPath = 'M' + (x_pos - b_w / 2) + ',0' + 'l' + b_w + ',0' + 'l0,0' + 'l' + -b_w + ',0' + 'l0,0Z';
        } else {
          strPath = 'M' + (x_pos - b_w / 2) + ',0' + 'l' + b_w + ',0' + 'l0,0' + 'l' + -b_w + ',0' + 'l0,0Z';
        }
        return strPath;
      });

    stock
      .select('.group-red-stock')
      .selectAll('path')
      .transition()
      .duration(durate)        
      .attr('d', function(d){
        let strPath = '',
          b_w = 30,
          x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2;
        let ratio = d.DividendPayoutRatio > 100 ? 100 : d.DividendPayoutRatio,
          h = Math.abs(y((d.ConsolidatedNetIncome * ratio) / 100) - y(0));
        if( y((d.ConsolidatedNetIncome * ratio) / 100) <= y(0) ) {
          d3.select(this).attr('opacity', 1);
        }else{
          d3.select(this).attr('opacity', 0);
        }
        
        if (d.ConsolidatedNetIncome > 0) {
          strPath =
            'M' + (x_pos - b_w / 2) + ',0' + 'l' + b_w + ',0' + 'l0,' + -h + 'l' + -b_w + ',0' + 'l0,' + h + 'Z';
        } else {
          strPath =
            'M' + (x_pos - b_w / 2) + ',0' + 'l' + b_w + ',0' + 'l0,' + h + 'l' + -b_w + ',0' + 'l0,' + -h + 'Z';
        }
        return strPath;
      });

    //add stock line
    stock
      .append('g')
      .attr('class', 'stock-lines')
      .selectAll('stock-line')
      .data(param)
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('d', d => {
        let x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2;
        return 'M' + x_pos + ',0l0,0';
      });

    stock
      .select('.stock-lines')
      .selectAll('path')
      .transition()
      .duration(durate)
      .attr('d', function(d){
        let ratio = d.DividendPayoutRatio > 100 ? 100 : d.DividendPayoutRatio,
          h = Math.abs(y((d.ConsolidatedNetIncome * ratio) / 100) - y(0)),
          x_pos = x(formatTime(new Date(d.Date))) + x.bandwidth() / 2;
        if( y((d.ConsolidatedNetIncome * ratio) / 100) <= y(0) ) {
          d3.select(this).attr('opacity', 1);
        }else{
          d3.select(this).attr('opacity', 0);
        }
        if (d.ConsolidatedNetIncome < 0) {
          return 'M' + x_pos + ',' + (h - 10) + 'l0,20';
        } else {
          return 'M' + x_pos + ',' + (-h - 10) + 'l0,20';
        }
      });

    //add percent text
    stock
      .append('g')
      .attr('class', 'text-percents')
      .selectAll('text-percent')
      .data(param)
      .enter()
      .append('text')
      .attr('fill', 'grey')
      .attr('x', d => x(formatTime(new Date(d.Date))) + x.bandwidth() / 2 + 17)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('opacity', 0)
      .attr('dy', '0.3em')
      .style('font-size', '11pt')
      .text(d => (d.DividendPayoutRatio > 100 ? 100 + '%' : Math.floor(d.DividendPayoutRatio) + '%'));
    stock
      .select('.text-percents')
      .selectAll('text')
      .transition()
      .duration(durate)      
      .attr('y', function(d) {
        let ratio = d.DividendPayoutRatio > 100 ? 100 : d.DividendPayoutRatio,
          h = Math.abs(y((d.ConsolidatedNetIncome * ratio) / 100) - y(0));
        if( y((d.ConsolidatedNetIncome * ratio) / 100) <= y(0) ) {
          d3.select(this).attr('opacity', 1);
        }else{
          d3.select(this).attr('opacity', 0);
        }
        return d.ConsolidatedNetIncome < 0 ? h : -h;
      });
    
  };
  useEffect(() => drawGraph(width - margin, height, data), [width, height, JSON.stringify(data)]); //eslint-disable-line
  return (
    <svg width={width} height={height}>
      <g className="graphArea" ref={graphRef} transform={`translate(${margin / 2}, 0)`} />
    </svg>
  );
};

const StockGraphContainer = ({ data }) => {
  const [svgContainerRef, svgSize] = useDimensions();
  
  const preCorrection = params => {
    return params.map(d => {
      d.ConsolidatedNetIncome = d.ConsolidatedNetIncome ? d.ConsolidatedNetIncome : 0;
      d.ConsolidatedNetIncomeEUR = d.ConsolidatedNetIncomeEUR ? d.ConsolidatedNetIncomeEUR : 0;
      d.Currency = d.Currency ? d.Currency : '';
      d.Date = d.Date ? d.Date : '';
      d.DividendPayoutRatio = d.DividendPayoutRatio ? d.DividendPayoutRatio : 0;
      d.RateEUR = d.RateEUR ? d.RateEUR : 0;
      d.RetainedEarningsEUR = d.RetainedEarningsEUR ? d.RetainedEarningsEUR : 0;
      return d;
    });
  };

  return (
    <>
      <div className="columns">
        <div className="column" style={{ padding: 0, textAlign: 'center', fontSize: '18pt' }}>
          <strong style={{ color: '#df072c' }}>*</strong>
          <strong>Net Income</strong>
        </div>
      </div>
      <div className="columns">
        <div className="column" style={{ width: '100%', justifyContent: 'center' }}>
          <div ref={svgContainerRef}>
            {svgSize.width && <StockGraph data={preCorrection(data).reverse()} width={svgSize.width} height={265} />}
          </div>
        </div>
      </div>
      <div className="columns" style={{ textAlign: 'center', fontSize: '11pt' }}>
        <div className="column" style={{ padding: '0px 0px 0.75rem 0px' }}>
          <span style={{ color: '#df072c', fontSize: '14pt' }}>●</span>
          <span>Dividend</span>
        </div>
        <div className="column" style={{ padding: '0px 0px 0.75rem 0px' }}>
          <span style={{ color: '#a2a2a2', fontSize: '14pt' }}>●</span>
          <span>
            Retained
            <br />
            &nbsp;&nbsp;&nbsp;Earnings
          </span>
        </div>
        <div className="column" style={{ padding: '0px 0px 0.75rem 0px' }}>
          <span>%&nbsp;</span>
          <span>
            Pay-out
            <br />
            Ratio
          </span>
        </div>
      </div>
    </>
      
  );
};

StockGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ConsolidatedNetIncome: PropTypes.number,
      ConsolidatedNetIncomeEUR: PropTypes.number,
      Currency: PropTypes.string,
      Date: PropTypes.string,
      DividendPayoutRatio: PropTypes.number,
      RateEUR: PropTypes.number,
      RetainedEarningsEUR: PropTypes.number
    })
  ).isRequired
};
StockGraphContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ConsolidatedNetIncome: PropTypes.number,
      ConsolidatedNetIncomeEUR: PropTypes.number,
      Currency: PropTypes.string,
      Date: PropTypes.string,
      DividendPayoutRatio: PropTypes.number,
      RateEUR: PropTypes.number,
      RetainedEarningsEUR: PropTypes.number
    })
  ).isRequired
};

export default StockGraphContainer;
