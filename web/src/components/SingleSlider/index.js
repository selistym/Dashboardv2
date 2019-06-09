import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const SingleSlider = props => {
  const axisRef = useRef(),
    handlerRef = useRef();
  const { width, height, years, initYear, onChangeYear } = props,
    margins = { top: 20, right: 25, bottom: 20, left: 15 },
    slider_w = width - margins.left - margins.right,
    RangeBar = <rect rx="5" ry="5" y="0" width={slider_w} height="8" fill="grey" />,
    circle = <circle r="7px" fill="#de0730" style={{ cursor: 'pointer' }} />,
    text = <text style={{ fontSize: 14, fill: '#de0730', fontWeight: '600' }} />,
    first = years[0],
    last = years[years.length - 1],
    xScale = d3
      .scaleLinear()
      .domain([first, last])
      .range([0, slider_w])
      .clamp(true);

  const [overedObj, setOveredObj] = useState(null);

  const onMouseOver = event => {
    event.preventDefault();
    setOveredObj(event.target.parentNode.className.baseVal);
  };

  const yearStr = JSON.stringify(years);
  useEffect(() => {
    const drawAxis = () => {
      d3.select(axisRef.current)
        .call(
          d3
            .axisBottom()
            .scale(xScale)
            .ticks(years.length)
            .tickFormat(d3.format(''))
        )
        .selectAll('text')
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
  }, [width, height, yearStr, first, last, xScale, years.length]);
  useEffect(() => controlHandlers());

  const controlHandlers = () => {
    let trueMouseValue, mouseValue;
    let drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', draged)
      .on('end', dragend);

    d3.select('.sliderBar').call(drag);
    function dragstart() {
      if (overedObj == 'handler') {
        trueMouseValue = getTrueMouseValue(d3.mouse(this)[0]);
      }
    }
    function draged() {
      mouseValue = d3.mouse(this)[0];
      trueMouseValue = getTrueMouseValue(mouseValue);
      if (overedObj == 'handler') {
        d3.select(handlerRef.current).attr('transform', `translate(${xScale(trueMouseValue)}, 4)`);
        d3.select(handlerRef.current)
          .select('text')
          .attr('text-anchor', 'middle')
          .attr('dy', -12)
          .text(() => trueMouseValue);
      }
    }
    function dragend() {
      onChangeYear(trueMouseValue);
    }
    function getTrueMouseValue(mouseValue) {
      return Math.round(xScale.invert(mouseValue));
    }
  };

  return (
    <svg className="singleSlider" width={width} height={height}>
      <g className="XAxisArea" ref={axisRef} transform={`translate(${margins.left}, 25)`} />
      <g
        className="sliderBar"
        onMouseOver={event => onMouseOver(event)}
        transform={`translate(${margins.left}, ${margins.top})`}
      >
        {RangeBar}
        <g className="handler" ref={handlerRef} transform={`translate(${xScale(initYear)}, 4)`}>
          {circle}
          {text}
        </g>
      </g>
    </svg>
  );
};

SingleSlider.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  years: PropTypes.array.isRequired,
  initYear: PropTypes.number.isRequired,
  onChangeYear: PropTypes.func.isRequired
}

export default SingleSlider;
