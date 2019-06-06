import React, { useState, useRef, useReducer, useEffect, useContext, createContext, Fragment} from 'react';
import useDimensions from '../Dimensions';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

const AreaContext = createContext(null);
const margins = 30;
const parseTime = d3.timeParse('%Y-%m-%d');

const Chart = ({column, width, height}) => {
  let { areaStore } = useContext(AreaContext);  
  const chartRef = useRef();
  //draw areachart
  useEffect(() => {
    let c_data = column.slice(2, 3).map(id => ({
      id: id,
      values: areaStore.partial.map(d => ({
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

    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat('%Y-%m-%d'))
      )
      .selectAll('text')      
      .style('font-size', '8pt')
      .style('fill', 'grey')      

    chart
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .tickSize(3)
          .ticks(10)
      )
      .selectAll('text')
      .attr('x', -4)
      .style('font-size', '8pt')      
      .style('fill', 'grey')
      .select('.domain')
      .style('opacity', 0);

    chart
      .append('g')
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
    <g ref={chartRef} width={width} height={height} />
  );
}

const GraphSlider = ({data, column, width, height}) => {
  let { areaStore, areaDispatch } = useContext(AreaContext);  
  const dates = data.map(d => parseTime(d.Date));
  const xScale = d3
        .scaleTime()
        .range([0, width])
        .domain([dates[0], dates[dates.length - 1]])
        .clamp(true);
  let rangeStart = parseTime(areaStore.partial[0].Date),
      rangeEnd = parseTime(areaStore.partial[areaStore.partial.length - 1].Date);
  
  const barRef = useRef();  
  const leftHandlerRef = useRef();
  const rightHandlerRef = useRef();
  
  const [overed, setOvered] = useState('');  

  const onMouseOver = event => setOvered(event.target.parentNode.className.baseVal);
  
  //control handler
  useEffect(() => {    
    let trueMouseValue, drag, left_margin, rect_width, startPos, endPos, rectX, range;
    drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', draged)
      .on('end', dragend);
      
    d3.select(".sliderBar").call(drag);
    function dragstart() {
      trueMouseValue = getTrueMouseValue(d3.mouse(this)[0]);
      if (overed == 'sliderBar'){
        rectX = d3.select("rect[id='rectFillBar']").attr('x');
        rect_width = d3.select("rect[id='rectFillBar']").attr('width');
        left_margin = d3.mouse(this)[0] - rectX;
      }
    }
    function draged() {
      trueMouseValue = getTrueMouseValue(d3.mouse(this)[0]);
      if (overed == 'sliderBar'){
        let mouseValue = d3.mouse(this)[0];
        startPos = mouseValue - left_margin;
        endPos = 1.0 * startPos + 1.0 * rect_width;
        if (xScale(getTrueMouseValue(startPos)) == xScale(parseTime(data[0].Date))) return;
        if (xScale(getTrueMouseValue(endPos)) == xScale(parseTime(data[data.length - 1].Date))) return;
        areaDispatch({type: 'CHANGE_RANGE', value: {startDate: getTrueMouseValue(startPos), endDate: getTrueMouseValue(endPos)}});
      }
      if (overed == 'leftHandler') {
        if(rangeEnd - trueMouseValue <= 30 * 24 * 60 * 60 * 1000) return;
        areaDispatch({type: 'CHANGE_RANGE', value: {startDate: trueMouseValue, endDate: rangeEnd}});        
      }
      if(overed == 'rightHandler'){
        if(trueMouseValue - rangeStart <= 30 * 24 * 60 * 60 * 1000) return;
        areaDispatch({type: 'CHANGE_RANGE', value: {startDate: rangeStart, endDate: trueMouseValue}});        
      }
    }
    function dragend() {}
    function getTrueMouseValue(mouseValue) {
      return Math.round(xScale.invert(mouseValue));
    }
  });
  //draw slider graph
  useEffect(() => {    
    const dates = data.map(d => parseTime(d.Date));
    const xScale = d3
          .scaleTime()
          .range([0, width])
          .domain([dates[0], dates[dates.length - 1]]);

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
  }, [data, width, height, column]);
    
  return (    
    <g className="sliderBar" onMouseOver={(e) => onMouseOver(e)}>
      <g ref={barRef} />
      <rect id="rectFillBar" x={xScale(rangeStart)} width={xScale(rangeEnd) - xScale(rangeStart)} height={height} fill="rgba(150, 150, 150, 0.3)"/>
      <g className="leftHandler" ref={leftHandlerRef} transform={`translate(${xScale(rangeStart)}, -2)`} style={{cursor: 'pointer'}}>
        <rect rx="3" ry="3" width="10" height={height + 4} fill="rgba(150, 150, 150, 0.8)" transform={`translate(-5, 0)`}/>
      </g>
      <g className="rightHandler" ref={rightHandlerRef} transform={`translate(${xScale(rangeEnd)}, -2)`} style={{cursor: 'pointer'}}>
        <rect rx="3" ry="3" width="10" height={height + 4} fill="rgba(150, 150, 150, 0.8)" transform={`translate(-5, 0)`}/>
      </g>
    </g>
  );
}

const AreaChart = ({data, column, width, height}) => {  
  
  return(
    <svg width={width} height={height}>
      <g transform={`translate(${margins}, ${margins})`}>
        <Chart width={width - margins * 2} 
          height={height * 5 / 6 - margins * 2}
          column={column} />
      </g>
      <g transform={`translate(${margins}, ${height * 5 / 6})`}>
        <GraphSlider 
          data={data}
          column={column}
          width={width - margins * 2}
          height={height / 6 - margins}        
          />
      </g>
    </svg>
  );
};
 
const AreaGraph = props => {  
  const {data, companyName} = props;
  const [svgContainerRef, svgSize] = useDimensions();

  const btRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]);  

  const getColumn = origin => {
    let column = [];
    for (var key in origin[0]) {
      column.push(key);
    }
    return column;
  }
  const isEmpty = origin => !origin || origin.length == 0 ? true : false;
  const preCorrection = origin =>  origin.map(d => {
    d.Date = d.Date ? d.Date : '';
    d.Volume = d.Volume ? d.Volume : 0;
    d.Close = d.Close ? d.Close : 0;
    return d;
  });

  const sorted_data = !isEmpty(data) ? preCorrection(data).sort((x, y) => d3.ascending(parseTime(x.Date), parseTime(y.Date))) : [];
  //initial State
  const getPartial = (start, end) => {
    if(sorted_data.length == 0) return [];
    let partial = [];
    for(let i = 0; i < sorted_data.length; i++){
      if(start <= parseTime(sorted_data[i].Date) && end >= parseTime(sorted_data[i].Date)){
        partial.push(sorted_data[i]);
      }
    }    
    return {partial: partial};
  }
  const initStore = {
    partial: !isEmpty(data) ? sorted_data : []
  };
  //use reducer
  const areaReducer = (state, action) => {
    let start, end;    
    switch (action.type) {
      case 'RANGE_1_MONTH':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] + '-' + (end.split('-')[1] - 1) + '-' + end.split('-')[2];
        return getPartial(parseTime(start), parseTime(end));
      case 'RANGE_6_MONTH':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] + '-' + (end.split('-')[1] - 6) + '-' + end.split('-')[2];
        return getPartial(parseTime(start), parseTime(end));
      case 'RANGE_1_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = (end.split('-')[0] - 1) + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return getPartial(parseTime(start), parseTime(end));
      case 'RANGE_3_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = (end.split('-')[0] - 3) + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return getPartial(parseTime(start), parseTime(end));
      case 'RANGE_5_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = (end.split('-')[0] - 5) + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return getPartial(parseTime(start), parseTime(end));
      case 'RANGE_ALL':
        end = sorted_data[sorted_data.length - 1].Date;
        start = sorted_data[0].Date;
        return getPartial(parseTime(start), parseTime(end));
      case 'CHANGE_RANGE':        
        return getPartial(action.value.startDate, action.value.endDate);
      default:
        throw new Error();
    }
  };
  const [areaStore, areaDispatch] = useReducer(areaReducer, initStore);

  const deselect_btStyle = {
    color: '#de0730',
    backgroundColor: '#fff',
    width: '40px', 
    marginRight: '5px', 
    fontSize: '10pt'
  };
  const select_btStyle = {
    color: '#fff',
    backgroundColor: '#de0730',
    width: '40px', 
    marginRight: '5px', 
    fontSize: '10pt'
  };  
  const btLabels = ['1 M', '6 M', '1 Y', '3 Y', '5 Y', 'All'];
  const action_types = ['RANGE_1_MONTH', 'RANGE_6_MONTH', 'RANGE_1_YEAR', 'RANGE_3_YEAR', 'RANGE_5_YEAR', 'RANGE_ALL'];
  const onRangeButtonHandler = type_index => {
    areaDispatch({type: action_types[type_index]});
    for(let i = 0; i < 6; i++){
      if(i == type_index){
        btRefs.current[type_index].current.style.backgroundColor = '#de0730';
        btRefs.current[type_index].current.style.color = '#fff';
      }else{
        btRefs.current[i].current.style.backgroundColor = '#fff';
        btRefs.current[i].current.style.color = '#de0730';
      }
    }
  }  
  
  return (
    <Fragment>
      {isEmpty(data)? <> No data </> :
      <AreaContext.Provider value={{areaStore, areaDispatch}}>
        <div>
            <div className="columns">
              <div className="column is-desktop is-7" style={{ margin: '0px', padding: '0px', justifyContent: 'center', textAlign: 'center'}}>
                {btLabels.map((e, i) => (
                  i == 5 ? <span key={i} className="button" ref={btRefs.current[i]} onClick={() => onRangeButtonHandler(i)} style={select_btStyle}>{e}</span>
                   : <span key={i} className="button" ref={btRefs.current[i]} onClick={() => onRangeButtonHandler(i)} style={deselect_btStyle}>{e}</span>
                ))}
              </div>
              <div className="column is-desktop is-5" style={{ margin: '0px', padding: '0px', justifyContent: 'center', textAlign: 'center'}}>
                <span style={{ color: '#de0730', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
                <span style={{ marginRight: '15px' }}>{companyName}</span>
                <span style={{ color: 'grey', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
                <span>Industry</span>
              </div>      
            </div>    
            <div className="columns" style={{width:'100%', justifyContent: 'center'}} ref={svgContainerRef}>
              {svgSize.width && 
                <AreaChart
                  data={sorted_data}
                  column={getColumn(sorted_data)}
                  width={svgSize.width}
                  height={400}
                />
              }
            </div>
        </div>
      </AreaContext.Provider>
      }
    </Fragment>
  );
}
Chart.propTypes = {  
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

AreaGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  companyName: PropTypes.string.isRequired
};
export default AreaGraph;
