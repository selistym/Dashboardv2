import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import useDimensions from '../Dimensions';
import * as d3 from 'd3';

const margin = 20;

const BarGroup = ({ data, bandwidth, xScale, step_data, identy, sector }) => {
  const graphRef = useRef();
  const drawBarGroup = () => {
    const durate = 1000;
    const yScale = d3
      .scaleBand()
      .domain(data.values.slice(0, 4).map(d => d.label))
      .rangeRound([0, bandwidth]);
    let step = 100 / step_data.range;
    let bar_data = data.values.slice(0, 4).map(d => {
      d.value = +d.value;
      return d;
    });
    let ebitdas = data.values.slice(4, 5).map(d => {
      d.value = +d.value;
      return d;
    });

    const color = d3.scaleOrdinal().range(['#32CD32', '#006400', '#808080', '#000000']);

    d3.select(graphRef.current)
      .selectAll('*')
      .remove();

    d3.select(graphRef.current)
      .selectAll('path')
      .data(bar_data)
      .enter()
      .append('path')
      .attr('class', 'negative' + identy)
      .attr('fill', d => color(d.label))
      .attr('opacity', d => (d.label.includes('Ebitda') ? 0 : 1))
      .attr('d', d => {
        if (d.value > 0) {
          return (
            'M' +
            xScale(0) +
            ',' +
            yScale(d.label) +
            'l1,0' +
            'q' +
            yScale.bandwidth() / 2 +
            ',0,' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'q0,' +
            yScale.bandwidth() / 2 +
            ',' +
            -yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'l-1,0z'
          );
        } else {
          return (
            'M' +
            xScale(0) +
            ',' +
            yScale(d.label) +
            'l1,0' +
            'q' +
            -yScale.bandwidth() / 2 +
            ',0,' +
            -yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'q0,' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'l-1,0z'
          );
        }
      });

    d3.selectAll('.negative' + identy)
      .transition()
      .duration(durate)
      .attr('opacity', d => (Math.abs(d.value * step) < 1 ? 0 : 1))
      .attr('d', d => {
        if (d.value > 0) {
          return (
            'M' +
            xScale(0) +
            ',' +
            yScale(d.label) +
            'l' +
            (xScale(d.value - step_data.max) - yScale.bandwidth() / 2) +
            ',0' +
            'q' +
            yScale.bandwidth() / 2 +
            ',0,' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'q0,' +
            yScale.bandwidth() / 2 +
            ',' +
            -yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'l' +
            -(xScale(d.value - step_data.max) - yScale.bandwidth() / 2) +
            ',0z'
          );
        } else {
          return (
            'M' +
            xScale(0) +
            ',' +
            yScale(d.label) +
            'l' +
            -(xScale(0) - xScale(d.value) - yScale.bandwidth() / 2) +
            ',0' +
            'q' +
            -yScale.bandwidth() / 2 +
            ',0,' +
            -yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'q0,' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            ',' +
            yScale.bandwidth() / 2 +
            'l' +
            (xScale(0) - xScale(d.value) - yScale.bandwidth() / 2) +
            ',0z'
          );
        }
      });
    // // //add EBITDA
    if(sector != 'Finance')
      d3.select(graphRef.current)
        .selectAll('path_ebita')
        .data(ebitdas)
        .enter()
        .append('path')
        .attr('d', d => 'M' + xScale(d.value) + ' -1 L' + xScale(d.value) + ' ' + (yScale.bandwidth() + 2) + ' Z')
        .style('stroke', '#de0730')
        .style('stroke-width', 3);

    // //add percent text
    d3.select(graphRef.current)
      .selectAll('text')
      .data(bar_data)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.value))
      .attr('y', d => (d.label.includes('Ebitda') == false ? yScale(d.label) + yScale.bandwidth() / 2 : 0))
      .attr('dx', d => (d.value > 0 ? 5 : -5))
      .text(d => (d.value == 0 ? '' : d.value.toFixed(0) + ''))
      .attr('text-anchor', d => (d.value > 0 ? 'start' : 'end'))
      .attr('alignment-baseline', 'central')
      .style('font-size', '10pt')
      .style('fill', 'black');
  };
  useEffect(() => drawBarGroup(), [JSON.stringify(data), xScale]); //eslint-disable-line
  return <g ref={graphRef} />;
};

const NegativeGraph = ({ width, height, data, sector }) => {
  const xAxisRef = useRef();
  const yAxisRef = useRef();

  const getRange = data => {
    let arr = [];
    let cnv_data = data.map(d => {
      return d;
    });

    for (let i = 0; i < cnv_data.length; i++) {
      for (let j = 0; j < cnv_data[i].values.length; j++) {
        if (!cnv_data[i].values[j].value) cnv_data[i].values[j].value = 0;
        arr.push(Math.abs(cnv_data[i].values[j].value));
      }
    }

    let min = d3.min(d3.values(arr)),
      max = d3.max(d3.values(arr)) * 1.2,
      range = max * 2;
    return { min: min, max: max, range: range };
  };
  const step_data = getRange(data);

  const xScale = d3
    .scaleLinear()
    .range([0, width - margin * 3])
    .domain([-step_data.max, step_data.max]);

  const y0Scale = d3
    .scaleBand()
    .rangeRound([height - margin, 0])
    .padding(0.3)
    .domain(data.map(d => d.year));

  const drawGraph = () => {
    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(height - margin)
      .ticks(10);

    const yAxis = d3.axisLeft(y0Scale).tickSize(0);

    d3.select(xAxisRef.current)
      .selectAll('*')
      .remove();
    d3.select(yAxisRef.current)
      .selectAll('*')
      .remove();

    d3.select(xAxisRef.current)
      .attr('class', 'x axis')
      .call(xAxis)
      .select('.domain')
      .remove();

    d3.select(xAxisRef.current)
      .selectAll('.tick line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    d3.select(yAxisRef.current)
      .attr('class', 'y axis')
      .call(yAxis)
      .select('.domain')
      .remove();

    d3.select(yAxisRef.current)
      .selectAll('text')
      .attr('x', -10)
      .style('text-anchor', 'middle')
      .attr('fill', 'grey')
      .style('font-size', '10pt');
  };
  useEffect(() => drawGraph(), [width, height, JSON.stringify(data)]); //eslint-disable-line
  const barGroups = useMemo(
    () =>
      data.map((d, i) => (
        <g key={i} className={`bar-group${d.year}`} transform={`translate(0, ${y0Scale(d.year)})`}>
          <BarGroup key={i} identy={i} data={d} xScale={xScale} bandwidth={y0Scale.bandwidth()} step_data={step_data} sector={sector}/>
        </g>
      )),
    [width, JSON.stringify(data)]//eslint-disable-line
  ); 
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin * 2}, 0)`}>
        <g ref={xAxisRef} />
        <g ref={yAxisRef} />
        {barGroups}
      </g>
    </svg>
  );
};
const NegativeGraphContainer = ({ data , sector}) => {
  const [svgContainerRef, svgSize] = useDimensions();
  const cap_data = [
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
    <>
      {!data ? (
        <span>No Data</span>
      ) : (
        <div ref={svgContainerRef}>          
          {svgSize.width && <NegativeGraph data={cap_data} width={svgSize.width} height={400} sector={sector}/>}
        </div>
      )}
    </>
  );
};
BarGroup.propTypes = {
  sector: PropTypes.string,
  data: PropTypes.shape({
    year: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number
      })
    )
  }).isRequired,
  bandwidth: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  step_data: PropTypes.object.isRequired,
  identy: PropTypes.number.isRequired
};

NegativeGraph.propTypes = {
  sector: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      values: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.number
        })
      )
    })
  ).isRequired
};

NegativeGraphContainer.propTypes = {
  sector: PropTypes.string,
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
export default NegativeGraphContainer;
