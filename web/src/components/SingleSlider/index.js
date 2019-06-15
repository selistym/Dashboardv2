import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const margin = 20;
const SingleSlider = ({data, width, height, onChangeHandler}) => {
  const axisRef = useRef();

  const w = width - 2 * margin,    
    first = data[0],
    last = data[data.length - 1],
    xScale = d3
      .scaleLinear()
      .domain([first, last])
      .range([0, w])
      .clamp(true);

  const getTrueMouseValue = mouseValue => Math.round(xScale.invert(mouseValue))

  useEffect(() => {
    const drawAxis = () => {
      d3.select(axisRef.current)
        .call(
          d3
            .axisBottom()
            .scale(xScale)
            .ticks(data.length)
            .tickFormat(d3.format(''))
        )
        .selectAll('text')
        .attr('dy', 20)
        .style('opacity', d => (d == first || d == last ? 1 : 0))        
        .style('font-size', '14px')
        .style('cursor', 'pointer')
        .style('font-weight', 600)
        .style('fill', 'grey')
        .select('.domain')
        .remove();
      d3.select(axisRef.current)
        .select('path')
        .style('opacity', '0');
      d3.select(axisRef.current)
        .selectAll('line')
        .style('opacity', '0');
      d3.select(axisRef.current)
        .select('path')
        .style('d', 'none');
    };
    drawAxis();
  }, [width, height, data]);//eslint-disable-line

  useEffect(() => {    
    d3.select(".handler").attr('cx', xScale(data[data.length - 1]));
  }, [width]); //eslint-disable-line

  useEffect(() => {
    let trueMouseValue;
    let drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', draged)
      .on('end', dragend);

    d3.select(".handler").call(drag);
    const zone = d3.select(".sliderZone").node();
    function dragstart() {
      trueMouseValue = getTrueMouseValue(d3.mouse(zone)[0]);
    }
    function draged() {
      trueMouseValue = getTrueMouseValue(d3.mouse(zone)[0]);
      if (d3.select(this).attr('class') == 'handler') {
        d3.select(this).attr('cx', xScale(trueMouseValue));
        d3.select(".handlerText")          
          .attr('x', xScale(trueMouseValue))
          .attr('dy', -10)
          .attr('text-anchor', 'middle')
          .text(trueMouseValue);
      }
    }
    function dragend() {
      onChangeHandler(trueMouseValue);
    }
    
  });

  return (
    <svg width={width} height={height}>
      <g ref={axisRef} transform={`translate(${margin}, 25)`} />
      <g className="sliderZone" transform={`translate(${margin}, 25)`}>
        <rect rx="5" ry="5" y="0" width={w} height="6" fill="grey" />
        <circle className="handler" cx="0" r="8px" fill="#de0730" style={{ cursor: 'pointer' }} transform={`translate(0, 3)`}/>
        <text className="handlerText" style={{ fontSize: 14, fill: '#de0730', fontWeight: '600' }} />        
      </g>
    </svg>
  );
};

SingleSlider.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,  
  onChangeHandler: PropTypes.func.isRequired
}

export default SingleSlider;
