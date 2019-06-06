import React, { useEffect, useRef, useState } from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import PropTypes from 'prop-types';
import { context } from '../../lib/cubism-es.esm';
import Link from 'next/link';
import * as d3 from 'd3';

const CubismChart = ({ data, parentWidth }) => {  
  const demoRef = useRef(null);  
  const getDateArray = (_start, _end) => {
    var arr = new Array(),
      dt = new Date(_start);

    while (dt <= _end) {
      arr.push(new Date(dt).toISOString().slice(0, 10));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };
  const getConvertData = input_data => {
    let toDate = input_data[0].globalQuotes[input_data[0].globalQuotes.length - 1].date;
    let fromDate = new Date(new Date(toDate).getTime() - parentWidth * 24 * 3600 * 1000).toISOString().slice(0, 10);

    // let fromDate = (toDate.split('-')[0] - 2) + '-' + toDate.split('-')[1] + '-' + toDate.split('-')[2];
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
              date: input_data[p].globalQuotes[j].date,
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
            date: dateRange[i],
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
  useEffect(() => {
    var c = context()
      //.serverDelay(30 * 1000)
      //.step(10 * 1000) // ten seconds per value
      .step(24 * 60 * 60 * 1000) // ten seconds per value
      .size(parentWidth) // fetch 1112 values
      .stop();

    d3.select(demoRef.current)
      .selectAll('*')
      .remove();

    d3.select(demoRef.current)
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
      .select(demoRef.current)
      .append('div')
      .attr('class', 'rule')
      .attr('id', 'rule')
    c.rule().render(d);

    var bodyRect = document.body.getBoundingClientRect(),
      elemRect = demoRef.current.getBoundingClientRect(),
      offset_top = elemRect.top - bodyRect.top,
      offset_left = elemRect.left - bodyRect.left;

    d.selectAll('.line')
      .style('margin-left', offset_left - 20 + 'px')
      .style('top', offset_top + 'px')
      .style('height', 300 + 'px')
      .style('width', '1px')
      .style('background', '#000')
      .style('zIndex', 2);

    d3.select(demoRef.current)
      .selectAll('.horizon')
      .data(c_data.map(stock))
      .enter()
      .insert('div', '.bottom')
      .attr('class', 'horizon')
      .style('height', '50px')

    c.horizon()
      .format(d3.format('+,.2p'))
      .render(d3.selectAll('.horizon'));
    
    d3.selectAll('.title')
      .html((d, i) => `<a href="/security/${data[i].id}">${data[i].name}</a>`)
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
        let initValue = datum.globalQuotes[0].close == 0 ? getNearest(datum.globalQuotes) : datum.globalQuotes[0].close,showValue;
        datum.globalQuotes[0].close = initValue;
        let prv_data = initValue;
        for (let i = 1; i < datum.globalQuotes.length; i++) {
          if (datum.globalQuotes[i].close == 0) {
            datum.globalQuotes[i].close = prv_data;
          }
          prv_data = datum.globalQuotes[i].close;
        }

        if (isNaN(last)) last = start;
        while (last < stop) {
          last += step;
          value = datum.globalQuotes[i].close;
          showValue = ((value - initValue) / initValue).toFixed(2);
          values.push(showValue);
          i++;
        }
        // console.log(values, ' values')

        callback(null, (values = values.slice((start - stop) / step)));
      }, datum.ticker);
    }
  });
  return (    
      <div ref={demoRef} style={{ height: '40px' }}>
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
}

CubismChart.propTypes = {
  parentWidth: PropTypes.number.isRequired,
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
}

export default ResponsiveWrapper(CubismChart);
