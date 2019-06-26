import React, { useRef, useReducer, useEffect, useContext, createContext } from 'react';
import useDimensions from '../Dimensions';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

const AreaContext = createContext(null);
const margins = 30;
const parseTime = d3.timeParse('%Y-%m-%d');

const currencySign = currency => {
  switch(currency){
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
    case 'LBS':
      return '£';
    default:
      return currency;
  }
}
const getPartial = (start, end, p_data) => {
  if (p_data.length == 0) return [];
  let partial = [];
  let ys, ms, ds, ye, me, de;
  ys = new Date(start).getFullYear();
  ms = new Date(start).getMonth() + 1;
  ds = new Date(start).getDate();
  ye = new Date(end).getFullYear();
  me = new Date(end).getMonth() + 1;
  de = new Date(end).getDate();
  start = parseTime(ys + '-' + ms + '-' + ds);
  end = parseTime(ye + '-' + me + '-' + de);
  for (let i = 0; i < p_data.length; i++) {
    if (parseTime(p_data[i].Date) >= start && parseTime(p_data[i].Date) <= end) {
      partial.push(p_data[i]);
    }
  }
  return partial;
};

const AreaGraph = ({ data, currency,  column, width, height }) => {
  const { areaStore } = useContext(AreaContext);
  const chartRef = useRef();
  const barRef = useRef();
  
  const g_w = width - margins * 2,
    g_h = (height * 5) / 6 - margins * 2,
    s_w = width - margins * 2,
    s_h = height / 6 - margins;
  
  const dates = data.map(d => parseTime(d.Date));
  let   rangeStart = parseTime(areaStore.partial[0].Date),
        rangeEnd = parseTime(areaStore.partial[areaStore.partial.length - 1].Date);
  
  const xScale = d3
    .scaleTime()
    .range([0, s_w]) //or g_w
    .domain([dates[0], dates[dates.length - 1]])
    .clamp(true);
    
  const drawAreaGraph = (data, w, h) => {
    let c_data = column.slice(2, 3).map(id => ({
      id: id,
      values: data.map(d => ({
        date: parseTime(d.Date),
        value: d[id]
      }))
    }));

    let area_data = c_data[0].values.map(d => {
      d.value = +d.value;
      return d;
    });

    let min = d3.min(area_data, d => d.value),
      max = d3.max(area_data, d => d.value);
    let rmin = min - (max - min) * 0.1;

    let x = d3
      .scaleTime()
      .range([0, w])
      .domain([area_data[0].date, area_data[area_data.length - 1].date])
      .clamp(true);
    let y = d3
      .scaleLinear()
      .range([h, 0])
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
      .attr('transform', `translate(0, ${h})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat('%Y-%m-%d'))
      )
      .selectAll('text')
      .style('font-size', '8pt')
      .style('fill', 'grey');

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
      .attr('width', w)
      .attr('height', h)
      .style('opacity', 0)
      .on('mousemove', function() {
        try{
          let x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(area_data, x0, 0),
            d0 = area_data[i - 1],
            d1 = area_data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
          tooltip.attr('transform', `translate(${x(d.date)},${y(d.value)})`).call(callout, d.value);
        }catch(e){
          console.log('less data length!') //eslint-disable-line
        }
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
            .text(d => currencySign(currency) + ' ' + Number(d).toFixed(2))
        );

      const { y, width: tw, height: th } = text.node().getBBox();
      text.attr('transform', `translate(${-tw / 2},${15 - y})`);
      path
        .attr('d', `M${-tw / 2 - 10},5H-5l5,-5l5,5H${tw / 2 + 10}v${th + 10}h-${tw + 20}z`)
        .attr('transform', `translate(0,5)`);
    };
  };
  useEffect(() => {
    drawAreaGraph(areaStore.partial, g_w, g_h);
    d3.select('.leftHandler').attr('x', xScale(rangeStart) - 5);
    d3.select('.rightHandler').attr('x', xScale(rangeEnd) - 5);
    d3.select('.rectFillBar').attr('x', xScale(rangeStart));
    d3.select('.rectFillBar').attr('width', xScale(rangeEnd) - xScale(rangeStart));
  }, [areaStore.partial, g_w, g_h]); //eslint-disable-line

  const getTrueMouseValue = mouseValue => xScale.invert(mouseValue)

  useEffect(() => {
    let trueMouseValue, drag, left_margin, rect_width, startPos, endPos, rectX;
    drag = d3
      .drag()
      .on('start', dragstart)
      .on('drag', draged);

    d3.select('.rectFillBar').call(drag);
    d3.select('.leftHandler').call(drag);
    d3.select('.rightHandler').call(drag);
    const zone = d3.select('.barZone').node();

    function dragstart() {
      trueMouseValue = getTrueMouseValue(d3.mouse(zone)[0]);
      rectX = d3.select('.rectFillBar').attr('x');
      left_margin = d3.mouse(this)[0] - rectX;
      rect_width = d3.select('.rectFillBar').attr('width');
    }
    function draged() {
      trueMouseValue = getTrueMouseValue(d3.mouse(zone)[0]);
      if (d3.select(this).attr('class') == 'rectFillBar') {
        let mouseValue = d3.mouse(zone)[0];
        startPos = mouseValue - left_margin;
        endPos = 1.0 * startPos + 1.0 * rect_width;
        if (startPos <= 0 || endPos >= s_w) return;
        d3.select(this).attr('x', xScale(getTrueMouseValue(startPos)));
        rangeStart = getTrueMouseValue(startPos);//eslint-disable-line
        rangeEnd = getTrueMouseValue(endPos);//eslint-disable-line
        d3.select('.leftHandler').attr('x', xScale(rangeStart) - 5);
        d3.select('.rightHandler').attr('x', xScale(rangeEnd) - 5);
      } else {
        if (d3.select(this).attr('class') == 'leftHandler') {
          rangeStart = trueMouseValue;
        }
        if (d3.select(this).attr('class') == 'rightHandler') {
          rangeEnd = trueMouseValue;
        }
        if (rangeEnd - rangeStart <= 30 * 24 * 60 * 60 * 1000) return;
        d3.select('.leftHandler').attr('x', xScale(rangeStart) - 5);
        d3.select('.rightHandler').attr('x', xScale(rangeEnd) - 5);
        d3.select('.rectFillBar').attr('x', xScale(rangeStart));
        d3.select('.rectFillBar').attr('width', xScale(rangeEnd) - xScale(rangeStart));
      }
      drawAreaGraph(getPartial(rangeStart, rangeEnd, data), g_w, g_h);      
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
    let min = d3.min(c_data[0].values, d => d.value),
      max = d3.max(c_data[0].values, d => d.value);
    let y = d3
      .scaleLinear()
      .range([s_h, 0])
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
      .attr('transform', `translate(0, ${s_h})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')))
      .select('.domain')
      .style('opacity', 0);

    graph
      .append('g')
      .call(d3.axisLeft(y))
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
  }, [data, s_w, s_h]); //eslint-disable-line
  return (
    <svg width={width} height={height}>
      <g ref={chartRef} transform={`translate(${margins}, ${margins})`} />
      <g className="sliderBar" transform={`translate(${margins}, ${(height * 5) / 6})`}>
        <g className="sliderGraph" ref={barRef} />
        <rect className="barZone" x={0} width={s_w} height={s_h} fill="transparent" />
        <rect
          className="rectFillBar"
          x={xScale(rangeStart)}
          width={xScale(rangeEnd) - xScale(rangeStart)}
          height={s_h}
          fill="rgba(150, 150, 150, 0.3)"
        />
        <rect
          className="leftHandler"
          style={{ cursor: 'pointer' }}
          x={xScale(rangeStart) - 5}
          y={-2}
          width="10"
          rx="3"
          ry="3"
          height={s_h + 4}
          fill="rgba(150, 150, 150, 0.8)"
        />
        <rect
          className="rightHandler"
          style={{ cursor: 'pointer' }}
          x={xScale(rangeEnd) - 5}
          y={-2}
          width="10"
          rx="3"
          ry="3"
          height={s_h + 4}
          fill="rgba(150, 150, 150, 0.8)"
        />
      </g>
    </svg>
  );
};

const AreaGraphContainer = props => {
  const { data, companyName, currency} = props;
  const [svgContainerRef, svgSize] = useDimensions();

  const btRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]);

  const getColumn = origin => {
    let column = [];
    for (var key in origin[0]) {
      column.push(key);
    }
    return column;
  };
  
  const preCorrection = origin =>
    origin.map(d => {
      d.Date = d.Date ? d.Date : '';
      d.Volume = d.Volume ? d.Volume : 0;
      d.Close = d.Close ? d.Close : 0;
      return d;
    });

  const sorted_data = preCorrection(data).sort((x, y) => d3.ascending(parseTime(x.Date), parseTime(y.Date)));

  //initial State  
  const initStore = {
    partial: sorted_data
  };
  //use reducer
  const areaReducer = (state, action) => {
    let start, end;
    switch (action.type) {
      case 'RANGE_1_MONTH':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] + '-' + (end.split('-')[1] - 1) + '-' + end.split('-')[2];
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'RANGE_6_MONTH':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] + '-' + (end.split('-')[1] - 6) + '-' + end.split('-')[2];
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'RANGE_1_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] - 1 + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'RANGE_3_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] - 3 + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'RANGE_5_YEAR':
        end = sorted_data[sorted_data.length - 1].Date;
        start = end.split('-')[0] - 5 + '-' + end.split('-')[1] + '-' + end.split('-')[2];
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'RANGE_ALL':
        end = sorted_data[sorted_data.length - 1].Date;
        start = sorted_data[0].Date;
        return {partial: getPartial(parseTime(start), parseTime(end), sorted_data)}
      case 'CHANGE_RANGE':
        return {partial: getPartial(action.value.startDate, action.value.endDate, sorted_data)}
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
    areaDispatch({ type: action_types[type_index] });
    for (let i = 0; i < 6; i++) {
      if (i == type_index) {
        btRefs.current[type_index].current.style.backgroundColor = '#de0730';
        btRefs.current[type_index].current.style.color = '#fff';
      } else {
        btRefs.current[i].current.style.backgroundColor = '#fff';
        btRefs.current[i].current.style.color = '#de0730';
      }
    }
  };
  
  return (
    <AreaContext.Provider value={{ areaStore, areaDispatch }}>
      <div>
        <div className="columns">
          <div
            className="column is-desktop is-7"
            style={{ margin: '0px', padding: '0px', justifyContent: 'center', textAlign: 'center' }}
          >
            {btLabels.map((e, i) =>
              i == 5 ? (
                <span
                  key={i}
                  className="button"
                  ref={btRefs.current[i]}
                  onClick={() => onRangeButtonHandler(i)}
                  style={select_btStyle}
                >
                  {e}
                </span>
              ) : (
                <span
                  key={i}
                  className="button"
                  ref={btRefs.current[i]}
                  onClick={() => onRangeButtonHandler(i)}
                  style={deselect_btStyle}
                >
                  {e}
                </span>
              )
            )}
          </div>
          <div
            className="column is-desktop is-5"
            style={{ margin: '0px', padding: '0px', justifyContent: 'center', textAlign: 'center' }}
          >
            <span style={{ color: '#de0730', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
            <span style={{ marginRight: '15px' }}>{companyName}</span>
          </div>
        </div>
        <div className="columns" style={{ width: '100%', justifyContent: 'center' }} ref={svgContainerRef}>
          {svgSize.width && (
            <AreaGraph data={sorted_data} currency={currency} column={getColumn(sorted_data)} width={svgSize.width} height={400} />
          )}
        </div>
      </div>
    </AreaContext.Provider>      
  );
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
  currency: PropTypes.string,
  column: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
AreaGraphContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  currency: PropTypes.string,
  companyName: PropTypes.string.isRequired
};
export default AreaGraphContainer;
