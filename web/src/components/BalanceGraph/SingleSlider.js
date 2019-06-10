import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const Handle = props => {
  const { margins, onChangeYear, svgDimen, initialValue, xScale, handle } = props;
  const [setHandler] = useState(handle);
  const circle = <circle r="7px" fill="#de0730" style={{cursor:'pointer'}} />;
  const text = <text style={{ opacity: 1, fontSize: 14, fill: '#de0730', fontWeight: '600' }} />;

  const onMouseOver = () => {
    setHandler(handle);
  };
  useEffect(() => {
    let mouseValue, trueMouseValue;
    const drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', dragged)
      .on('end', dragend);

    d3.select('.SingleSliderGroup').call(drag);
    function dragstart() {
      mouseValue = d3.mouse(this)[0];
      trueMouseValue = getTrueMouseValue(mouseValue);
      d3.select('.' + handle).attr('transform', 'translate(' + mouseValue + ', 19)');
      d3.select('.' + handle)
        .select('text')
        .attr('dominant-baseline', 'middle')
        .attr('dy', -15)
        .style('text-anchor', 'middle')
        .text(trueMouseValue);
    }
    function dragged() {
      mouseValue = d3.mouse(this)[0];
      trueMouseValue = getTrueMouseValue(mouseValue);
      if (mouseValue > margins.left && mouseValue < svgDimen.width - margins.right) {
        d3.select('.' + handle).attr('transform', 'translate(' + mouseValue + ', 19)');
        d3.select('.' + handle)
          .select('text')
          .attr('dominant-baseline', 'middle')
          .attr('dy', -15)
          .style('text-anchor', 'middle')
          .text(trueMouseValue);
      }
    }
    function dragend() {
      d3.select('.' + handle).attr('transform', 'translate(' + xScale(trueMouseValue) + ', 19)');
      onChangeYear(trueMouseValue);
    }
    function getTrueMouseValue(mouseValue) {
      return Math.round(xScale.invert(mouseValue));
    }
  });
  return (
    <g className={handle} transform={`translate(${xScale(initialValue)}, 19)`} onMouseOver={() => onMouseOver}>
      {text}
      {circle}
    </g>
  );
};

const Axis = props => {
  const { years, xScale } = props;
  const axisRef = useRef();
  const renderAxis = () => {
    let first = years[0];
    let last = years[years.length - 1];

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
      .style('font-style', 'italic')
      .style('fill', 'grey');

    d3.select(axisRef.current)
      .selectAll('line')
      .attr('stroke', 'white'); //set black when shows axis
    d3.select(axisRef.current)
      .select('path')
      .style('d', 'none');
    d3.select(axisRef.current)
      .select('path')
      .style('stroke', 'white');
    d3.select(axisRef.current)
      .select('path')
      .style('opacity', '0');
  };
  useEffect(() => {
    renderAxis();
  });
  return <g className="sliderAxis" transform="translate(0,30)" ref={axisRef} />;
};

const SingleSlider = props => {
  const { width, height, years, onChangeYear } = props;
  const margins = { top: 20, right: 75, bottom: 20, left: 65 },
    svgDimen = { width: width - margins.left - margins.right, height: height };
  const RangeBar = (
    <rect
      rx="5"
      ry="5"
      y="15"
      width={svgDimen.width - margins.left - margins.right}
      transform={`translate(${margins.left}, 0)`}
      height="8"
      fill="grey"
      style={{cursor:'pointer'}}
    />
  );
  let first = parseInt(years[0]);
  let last = parseInt(years[years.length - 1]);
  let xScale = d3
    .scaleLinear()
    .domain([first, last])
    .range([margins.left, svgDimen.width - margins.right])
    .clamp(true);
  return (
    <svg className="SingleSliderSvg" width={svgDimen.width + 60} height={svgDimen.height}>
      <g
        className="SingleSliderSvg"
        width={svgDimen.width}
        height={svgDimen.height}
        transform={`translate(${margins.left}, 0)`}
      >
        <g className="SingleSliderGroup" transform={`translate(0, ${svgDimen.height - margins.bottom - 40})`}>
          {RangeBar}
          <Axis years={years} xScale={xScale} />
          <Handle
            onChangeYear={onChangeYear}
            handle="handle"
            initialValue={last}
            years={years}
            margins={margins}
            svgDimen={svgDimen}
            xScale={xScale}
          />
        </g>
      </g>
    </svg>
  );
};

Handle.propTypes = {
  margins: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  svgDimen: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  onChangeYear: PropTypes.func.isRequired,
  initialValue: PropTypes.number.isRequired,
  handle: PropTypes.string.isRequired,
  xScale: PropTypes.func.isRequired
}

Axis.propTypes = {
  years: PropTypes.arrayOf(PropTypes.string).isRequired,  
  xScale: PropTypes.func.isRequired
}

SingleSlider.propTypes = {
  years: PropTypes.arrayOf(PropTypes.string).isRequired,  
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onChangeYear: PropTypes.func.isRequired
}

export default SingleSlider;
