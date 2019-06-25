import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useDimensions from '../Dimensions';
import { context } from '../../lib/cubism-es.esm';

import * as d3 from 'd3';

const deselect_btStyle = {
  color: '#006d2c',
  backgroundColor: '#fff',
  width: '40px',
  marginRight: '5px',
  fontSize: '10pt'
};
const select_btStyle = {
  color: '#fff',
  backgroundColor: '#006d2c',
  width: '40px',
  marginRight: '5px',
  fontSize: '10pt'
};

const CubismGraph = ({ data, period, width }) => {
  
  const graphRef = useRef();
  let toDate, fromDate, dateLen;  
  const getDateArray = (_start, _end) => {
    var arr = new Array(),
      dt = _start;
    while (dt <= _end) {
      arr.push(new Date(dt).toISOString().slice(0, 10));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };
  const setShowDateInfo = period => {
    switch (period) {
      case 'All':        
        var max_date = data[0].globalQuotes[0].date, min_date = data[0].globalQuotes[0].date;
        for(let i = 0; i < data.length; i++){
          if(new Date(max_date) < new Date(data[i].globalQuotes[data[i].globalQuotes.length - 1].date)){
            max_date = data[i].globalQuotes[data[i].globalQuotes.length - 1].date;
          }
          if(new Date(min_date) > new Date(data[i].globalQuotes[0].date)){
            min_date = data[i].globalQuotes[0].date;
          }
        }
        fromDate = min_date;
        toDate = max_date;
        dateLen = getDateArray(new Date(fromDate), new Date(toDate)).length;        
        break;
      case '1 M':
        dateLen = 30;
        toDate = new Date().toISOString().slice(0, 10);
        fromDate = new Date(new Date(toDate) - dateLen * 24 * 3600 * 1000).toISOString().slice(0, 10);
        break;
      case '6 M':
        dateLen = 180;
        toDate = new Date().toISOString().slice(0, 10);
        fromDate = new Date(new Date(toDate) - dateLen * 24 * 3600 * 1000).toISOString().slice(0, 10);
        break;
      case '1 Y':
        dateLen = 365;
        toDate = new Date().toISOString().slice(0, 10);
        fromDate = new Date(new Date(toDate) - dateLen * 24 * 3600 * 1000).toISOString().slice(0, 10);
        break;
      case '3 Y':
        dateLen = 3 * 365;
        toDate = new Date().toISOString().slice(0, 10);
        fromDate = new Date(new Date(toDate) - dateLen * 24 * 3600 * 1000).toISOString().slice(0, 10);
        break;
      case '5 Y':
        dateLen = 5 * 365;
        toDate = new Date().toISOString().slice(0, 10);
        fromDate = new Date(new Date(toDate) - dateLen * 24 * 3600 * 1000).toISOString().slice(0, 10);
        break;
    }
  };
  setShowDateInfo(period);
  const getConvertData = input_data => {
    let c_data = [],
      prv_data = { date: fromDate, close: 0, is_null: true };
    let dateRange = getDateArray(new Date(fromDate), new Date(toDate));

    for (let p = 0; p < input_data.length; p++) {
      prv_data = { date: fromDate, close: 0, is_null: true };
      let c_el = {
        ticker: input_data[p].name,
        globalQuotes: []
      };
      for (let i = 0; i < dateRange.length; i++) {
        let uneq = true;
        for (let j = 0; j < input_data[p].globalQuotes.length; j++) {
          if (input_data[p].globalQuotes[j].date == dateRange[i]) {
            prv_data = {
              date: new Date(input_data[p].globalQuotes[j].date),
              close: input_data[p].globalQuotes[j].close,
              is_null: false
            };
            c_el.globalQuotes.push(prv_data);
            uneq = false;
            break;
          }
        }
        if (uneq) {
          c_el.globalQuotes.push({
            date: new Date(dateRange[i]),
            close: prv_data.close,
            is_null: true
          });
        }
      }
      c_data.push(c_el);
    }
    return c_data;
  };
  const data2 = data.map(d => {
    return Object.assign({}, d, { globalQuotes: d.globalQuotes.sort((x, y) => d3.ascending(x.date, y.date)) });
  });
  let c_data = getConvertData(data2);
  // console.log(c_data, 'converted data')
  useEffect(() => {
    let showStep = dateLen / width;
    var c = context()
      //.serverDelay(30 * 1000)
      //.step(10 * 1000) // ten seconds per value
      .step(showStep * 24 * 60 * 60 * 1000) // ten seconds per value
      .size(width)
      .stop();

    d3.select(graphRef.current)
      .selectAll('*')
      .remove();

    d3.select(graphRef.current)
      .selectAll('.axis')
      .data(['bottom'])
      .enter()
      .append('div')
      .attr('class', function(d) {
        return d + ' axis';
      })
      .each(function(d) {
        c.axis()
          .ticks(10)
          .orient(d)
          .render(d3.select(this));
      });

    const d = d3
      .select(graphRef.current)
      .append('div')
      .attr('class', 'rule')
      .attr('id', 'rule');
    c.rule().render(d);

    var bodyRect = document.body.getBoundingClientRect(),
      elemRect = graphRef.current.getBoundingClientRect(),
      offset_top = elemRect.top - bodyRect.top,
      offset_left = elemRect.left - bodyRect.left;

    d.selectAll('.line')
      .style('margin-left', offset_left - 20 + 'px')
      .style('top', offset_top + 'px')
      // .style('height', 100 + 'px')
      .style('width', '1px')
      .style('background', '#000')
      .style('zIndex', 2);

    d3.select(graphRef.current)
      .selectAll('.horizon')
      .data(c_data.map(stock))
      .enter()
      .insert('div', '.bottom')
      .attr('class', 'horizon')
      .style('height', '50px');

    c.horizon()
      .format(d3.format('+,.2p'))
      .render(d3.selectAll('.horizon'));

    d3.selectAll('.title').html((d, i) => `<a href="/security/${data[i].id}">${data[i].name}</a>`);
    
    c.on('focus', i => {
      d3.selectAll('.value')
        .style('color', 'black')
        .style('right', function() {
          d.selectAll('.line')
            .style('top', offset_top + 'px')
            .style('height', 300 + 'px');
          if (i == null) {
            return null;
          } else {
            if (i > 60) return c.size() - i + 'px';
            else return c.size() - 60 - i + 'px';
          }
        });
    });
    function getNearest(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].close != 0) {
          return arr[i].close;
        }
      }
      return;
    }
    function stock(datum) {
      var value = 0,
        values = [],
        i = 0,
        last;

      return c.metric(function(start, stop, step, callback) {
        (start = +start), (stop = +stop);
        // console.log(datum, 'datum')
        let initValue = datum.globalQuotes[0].close == 0 ? getNearest(datum.globalQuotes) : datum.globalQuotes[0].close,
          showValue;
        datum.globalQuotes[0].close = initValue;
        let prv_data = initValue;

        for (let i = 1; i < datum.globalQuotes.length; i++) {
          if (datum.globalQuotes[i].close == 0) {
            datum.globalQuotes[i].close = prv_data;
          }
          prv_data = datum.globalQuotes[i].close;
        }

        if (isNaN(last)) last = start;
        let revision, focusDate;
        while (last < stop) {
          if (i > datum.globalQuotes.length - 1) break;
          revision = new Date(last).toISOString().slice(0, 10);
          focusDate = (datum.globalQuotes[i].date).toISOString().slice(0, 10);
          // if(i < 20)
          //   console.log(new Date(revision), new Date(focusDate), 'revision')
          if (new Date(revision) <= new Date(focusDate)) {
            value = datum.globalQuotes[i].close;
            showValue = ((value - initValue) / initValue).toFixed(2);
            values.push(showValue);
            last += step;
          } else {
            i++;
          }
        }
        callback(null, (values = values.slice((start - stop) / step)));
      }, datum.ticker);
    }
  });
  return (
    <div ref={graphRef} style={{ height: '40px', marginLeft: '20px', justifyContent: 'center' }}>
      <style jsx global>{`
        .group {
          margin-bottom: 1em;
        }

        .axis {
          font: 10px sans-serif;
          padding-bottom: 0px;
          pointer-events: none;
          z-index: 2;
        }

        .axis text {
          -webkit-transition: fill-opacity 250ms linear;
        }

        .axis path {
          display: none;
        }

        .axis line {
          stroke: #000;
          shape-rendering: crispEdges;
        }

        .axis.bottom {
          background-image: linear-gradient(bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
          background-image: -o-linear-gradient(bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
          background-image: -moz-linear-gradient(bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
          background-image: -webkit-linear-gradient(bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
          background-image: -ms-linear-gradient(bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
        }

        .horizon {
          overflow: hidden;
          position: relative;
        }

        .horizon {
        }

        .horizon + .horizon {
          border-top: none;
        }

        .horizon canvas {
          display: block;
          height: 40px;
        }

        .horizon .title {
          bottom: 0;
          line-height: 40px;
          margin: 0 6px;
          position: absolute;
          white-space: nowrap;
        }

        .horizon .title {
          left: 0;
          font-size: 1rem;
          font-weight: 800;
        }
        .horizon .title:hover {
          color: blue;
          text-decoration: underline;
          cursor: pointer;
        }
        .horizon .value {
          bottom: 0;
          line-height: 50px;
          margin: 0 6px 12px 6px;
          position: absolute;
          white-space: nowrap;
        }
        .horizon .value {
          right: 0;
        }
      `}</style>
    </div>
  );
};

const CubismGraphContainer = ({ data }) => {
  const [containerRef, containerSize] = useDimensions();
  const btRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef()
  ]);

  const btLabels = ['1 M', '6 M', '1 Y', '3 Y', '5 Y', 'All'];
  const [period, setPeriod] = useState(btLabels[3]);

  const onRangeButtonHandler = type_index => {
    setPeriod(btLabels[type_index]);
    for (let i = 0; i < 6; i++) {
      if (i == type_index) {
        btRefs.current[type_index].current.style.backgroundColor = '#006d2c';
        btRefs.current[type_index].current.style.color = '#fff';
      } else {
        btRefs.current[i].current.style.backgroundColor = '#fff';
        btRefs.current[i].current.style.color = '#006d2c';
      }
    }
  };
  return (    
      <div style={{ width: '100%', justifyContent: 'center' }}>
        <div className="columns">
          <div
            className="column is-desktop"
            style={{ margin: '10px', padding: '0px', justifyContent: 'center', textAlign: 'center' }}
          >
            {btLabels.map((e, i) =>
              i == 3 ? (
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
        </div>
        <div className="columns" style={{ width: '100%', justifyContent: 'center' }} ref={containerRef}>
          {containerSize.width && <CubismGraph data={data} width={containerSize.width} period={period} />}
        </div>
      </div>    
  );
};
CubismGraph.propTypes = {
  width: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      security: PropTypes.objectOf(
        PropTypes.shape({
          globalQuotes: PropTypes.arrayOf(
            PropTypes.shape({
              date: PropTypes.string,
              close: PropTypes.number
            })
          ).isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          ticker: PropTypes.string.isRequired
        })
      )
    })
  )
};
CubismGraphContainer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      security: PropTypes.objectOf(
        PropTypes.shape({
          globalQuotes: PropTypes.arrayOf(
            PropTypes.shape({
              date: PropTypes.string,
              close: PropTypes.number
            })
          ).isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          ticker: PropTypes.string.isRequired
        })
      )
    })
  )
};
export default CubismGraphContainer;
