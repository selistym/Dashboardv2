import React, { useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const margins = 20;
const parseTime = d3.timeParse('%Y-%m-%d');

const Chart = ({partial, column, width, height}) => {
  const chartRef = useRef();
  //draw areachart
  useEffect(() => {
    let c_data = column.slice(2, 3).map(id => ({
      id: id,
      values: partial.map(d => ({
          date: parseTime(d.Date),
          value: d[id]
        }))
    }));

    let area_data = c_data[0].values.map(d => {      
      d.value = +d.value;
      return d;
    });
    
    let min = d3.min(area_data, d => d.value), max = d3.max(area_data, d => d.value);
    let rmin = min - (max - min) * 0.1;
    
    let x = d3
      .scaleTime()
      .range([0, width])
      .domain([area_data[0].date, area_data[area_data.length - 1].date])
      .clamp(true);
    let y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([rmin, max]);
    let area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y0(y(rmin))
      .y1(d => y(d.value));

    const chart = d3.select(chartRef.current);
    chart.selectAll('*').remove();

    let ticks_count = Math.floor(width / 120);

    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(ticks_count)
          .tickFormat(d3.timeFormat('%Y-%m'))
      )
      .selectAll('text')
      .style('font-size', '9pt')
      .style('fill', 'grey');
    chart
      .append('g')
      // .attr('transform', 'translate(50, 0)')
      .attr('stroke-width', 1.5)
      .call(
        d3
          .axisLeft(y)
          .tickSize(3)
          .ticks(10)
      )
      .selectAll('text')
      .attr('x', -5)
      .style('font-size', '10pt')
      .style('fill', 'grey');
    // .select('.domain')
    // .style('opacity', 0);

    chart
      .selectAll('.area')
      .data(c_data)
      .enter()
      .append('path')
      .attr('d', d => area(d.values))
      .style('fill', '#df072c');

    const tooltip = chart.append('g');
    const bisectDate = d3.bisector(d => d.date).right;
    
    chart
      .append('rect')      
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0)
      .on('mousemove', function() {
        let x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(area_data, x0, 0),
          d0 = area_data[i - 1],
          d1 = area_data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;        
        tooltip.attr('transform', `translate(${x(d.date)},${y(d.value)})`).call(callout, d.value);
      });
    chart.on('mouseleave', () => tooltip.call(callout, null));
    const callout = (g, value) => {
      if (!value) return g.style('display', 'none');

      g.style('display', null)
        .style('pointer-events', 'none')
        .style('font', '10px sans-serif');

      g.selectAll('circle')
        .data([null])
        .join('circle')
        .attr('r', 7)
        .style('fill', 'grey')
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const path = g
        .selectAll('path')
        .data([null])
        .join('path')
        .attr('fill', 'grey');
      // .attr("stroke", "white");

      const text = g
        .selectAll('text')
        .data([null])
        .join('text')
        .call(text =>
          text
            .selectAll('tspan')
            .data((value + '').split(/\n/))
            .join('tspan')
            .attr('x', 0)
            .style('font-weight', 'bold')
            .style('font-size', 14)
            .style('fill', 'white')
            .text(d => '€ ' + d)
        );

      const { y, width: w, height: h } = text.node().getBBox();
      text.attr('transform', `translate(${-w / 2},${15 - y})`);
      path
        .attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 10}h-${w + 20}z`)
        .attr('transform', `translate(0,5)`);
    }
  });

  return (
    <svg ref={chartRef} width={width} height={height}/>
  );
}

const GraphSlider = ({data, column, width, height}) => {
  
  const dates = data.map(d => parseTime(d.Date));
  const xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([dates[0], dates[dates.length - 1]])
        .clamp(true);

  const barRef = useRef();
  const fillBarRef = useRef();
  const leftHandlerRef = useRef();
  const rightHandlerRef = useRef();
  
  const [overed, setOvered] = useState('');
  const [rangeStart, setRangeStart] = useState(dates[0]);
  const [rangeEnd, setRangeEnd] = useState(dates[dates.length - 1]);

  const onMouseOver = event => setOvered(event.target.parentNode.className.baseVal);
  
  //control handler
  useEffect(() => {    
    let trueMouseValue, drag;
    drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', draged)
      .on('end', dragend);
      
    d3.select(".sliderBar").call(drag);
    function dragstart() {      
      if (overed == 'leftHandler' || overed == 'rightHandler') {
        trueMouseValue = getTrueMouseValue(d3.mouse(this)[0]);
      }
    }
    function draged() {
      // fillBarWidth = parseFloat(d3.select(fillBarRef.current).style("width"));      
      trueMouseValue = getTrueMouseValue(d3.mouse(this)[0]);
      if (overed == 'leftHandler') {
        d3.select(leftHandlerRef.current).attr('transform', `translate(${xScale(trueMouseValue)}, -2)`);
        setRangeStart(trueMouseValue);        
      }
      if(overed == 'rightHandler'){
        d3.select(rightHandlerRef.current).attr('transform', `translate(${xScale(trueMouseValue)}, -2)`);
        setRangeEnd(trueMouseValue);
      }

    }
    function dragend() {}
    function getTrueMouseValue(mouseValue) {
      return Math.round(xScale.invert(mouseValue));
    }
  });
  //draw slider graph
  useEffect(() => {    
    let c_data = column.slice(2, 3).map(id => ({
        id: id,
        values: data.map(d => ({
            date: parseTime(d.Date),
            value: d[id]
          }))
      }));    
    let min = d3.min(c_data[0].values, d => d.value), max = d3.max(c_data[0].values, d => d.value);    
    let y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([min, max]);

    let area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y0(y(min))
      .y1(d => y(d.value));

    let graph = d3.select(barRef.current);
    graph.selectAll('*').remove();
    
    graph
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat(d3.timeFormat('%Y'))
      )
      .select('.domain')
      .style('opacity', 0);
    
    graph
      .append('g')
      .call(
        d3.axisLeft(y)
      )
      .select('.domain')
      .style('opacity', 0);
    
    graph.selectAll('text').style('opacity', 0);
    graph.selectAll('line').style('opacity', 0);
    
    graph
      .selectAll('.area')
      .data(c_data)
      .enter()
      .append('path')
      .attr('d', d => area(d.values))
      .style('fill', '#ddd');
  }, [data, width, height, column, xScale]);
    
  return (    
    <g className="sliderBar" onMouseOver={(e) => onMouseOver(e)}>
      <g ref={barRef} />
      <rect ref={fillBarRef} x={xScale(rangeStart)} width={xScale(rangeEnd) - xScale(rangeStart)} height={height} fill="rgba(150, 150, 150, 0.3)"/>
      <g className="leftHandler" ref={leftHandlerRef} transform={`translate(0, -2)`}>
        <rect rx="3" ry="3" width="10" height={height + 4} fill="rgba(150, 150, 150, 0.8)" transform={`translate(-5, 0)`}/>
      </g>
      <g className="rightHandler" ref={rightHandlerRef} transform={`translate(${width}, -2)`}>
        <rect rx="3" ry="3" width="10" height={height + 4} fill="rgba(150, 150, 150, 0.8)" transform={`translate(-5, 0)`}/>
      </g>
    </g>    
  );
}

const AreaChart = ({data, column, width, height}) => {
  const sorted_data = data.sort((x, y) => d3.ascending(parseTime(x.Date), parseTime(y.Date)));
  
  return(
    <svg width={width} height={height}>
      <g transform={`translate(${margins}, ${margins})`}>
        <Chart width={width - margins * 2} 
          height={height * 5 / 6 - margins * 2} 
          partial={sorted_data} 
          column={column} />
      </g>
      <g transform={`translate(${margins}, ${height * 5 / 6})`}>
        <GraphSlider 
          data={sorted_data}
          column={column}
          width={width - margins * 2} 
          height={height / 6 - margins} />
      </g>
    </svg>
  );
};
 

Chart.propTypes = {
  partial: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,  
  column: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

GraphSlider.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,  
  column: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

AreaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,  
  column: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
export default AreaChart;
