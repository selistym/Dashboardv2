import React, { useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const margins = 20;
const parseTime = d3.timeParse('%Y-%m-%d');

const Chart = props => {
  return (
    <g></g>
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
  const [rangeEnd, setRangeEnd] = useState(xScale(dates[dates.length - 1]));
  
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

const AreaChart = props => {
  const {data, column, width, height} = props;
  return (
      <svg width={width} height={height}>
        <g transform={`translate(${margins}, ${margins})`}>
          <Chart width={width - margins * 2} 
            height={height * 5 / 6 - margins * 2} 
            partial={data} 
            column={column} />
        </g>
        <g transform={`translate(${margins}, ${height * 5 / 6})`}>
          <GraphSlider 
            data={data}
            column={column}
            width={width - margins * 2} 
            height={height / 6 - margins} />
        </g>
      </svg>    
  );
}

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
