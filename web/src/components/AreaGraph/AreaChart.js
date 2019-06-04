import React, { useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const margins = 20;

const Chart = props => {
  return (
    <g></g>
  );
}

const GraphSlider = ({data, width, height}) => {
  const sliderContainerRef = useRef();
  const sliderRef = useRef();
  console.log(width, height, 'slider')
  const leftHandler = <rect rx="3" ry="3" width="10" height={height} fill="#777" />;
  const rightHandler = <rect rx="3" ry="3" width="10" height={height} fill="#777" />;
  const fillBar = <rect x={0} width={width} height={height} fill="rgba(150, 150, 150, 0.65)" />;
  const onMouseOver = e => {
    console.log(e.target, "overed element");
    // this.setState({
    //   handle: e.target.parentNode.className.baseVal
    // });
  }
  return (
    <g ref={sliderContainerRef} onMouseOver={(e) => onMouseOver(e)}>
      <g ref={sliderRef} />
      {fillBar}
      {leftHandler}
      {rightHandler}
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
        <g transform={`translate(${margins}, ${height * 5 / 6 + margins})`}>
          <GraphSlider 
            data={data} 
            width={width - margins * 2} 
            height={height / 6 - margins * 2} />
        </g>
      </svg>    
  );
}

export default AreaChart;
