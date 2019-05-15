import React, { useEffect, useRef } from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import { context, version } from '../../util/cubism-es.esm';
import * as d3 from 'd3';

function CubismChart({ data, parentWidth }) {
  const demoRef = useRef(null);  
  const data2 = data.map(d => {
    return Object.assign({},d,{globalQuotes: d.globalQuotes.sort((x,y)=>d3.descending(x.date,y.date))})
  });


  useEffect(() => {
    var c = context()
      //.serverDelay(30 * 1000)
      //.step(10 * 1000) // ten seconds per value
      .step(365 * 24 * 60 * 60 * 1000 / parentWidth) // ten seconds per value
      .size(parentWidth) // fetch 1112 values
      .stop();

    d3.select(demoRef.current).selectAll("*").remove();
    
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
      .attr('id', 'rule');
    c.rule().render(d);

    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = demoRef.current.getBoundingClientRect(),
        offset   = elemRect.top - bodyRect.top;
    d.selectAll('.line')
      .style('top', (offset - 239) + 'px')
      .style('height', 240 + 'px')
      .style('width', '1px')
      .style('background', '#000')
      .style('zIndex', 2);

    d3.select(demoRef.current)
      .selectAll('.horizon')
      .data(data2.map(stock))
      .enter()
      .insert('div', '.bottom')
      .attr('class', 'horizon')
      .style("height", '40px')
    
    c.horizon()
      .format(d3.format('+,.2p'))
      .render(d3.selectAll('.horizon'));

    c.on('focus', i => {
      d3.selectAll('.value')
        .style('color', 'black')
        .style('right', function(){
          
          d.selectAll('.line')
            .style('top', (offset - 239) + 'px')
            .style('height', 240 + 'px')
          if(i == null){
            return null;
          }else{            
            if(i > 100){
              return c.size() - i + 'px';
            }else{
              return (c.size() - i - 100) + 'px';
            }
          }          
        })
    });    

    function stock(datum) {
      var value = 0,
        values = [],
        i = 0,
        last;
      return c.metric(function(start, stop, step, callback) {
        start = +start, stop = +stop;
        if (isNaN(last)) last = start;
        while (last < stop) {
          last += step;
          value = Math.max(-10, Math.min(10, value + .8 * Math.random() - .4 + .2 * Math.cos(i += 1 * .02)));
          values.push(value);
        }
        callback(null, values = values.slice((start - stop) / step));
      }, datum.ticker);
    }
    
  });
  return (
    <div ref={demoRef} style={{height:'40px'}}>      
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
          border-bottom: solid 1px #000;
          overflow: hidden;
          position: relative;
        }

        .horizon {
          border-top: solid 1px #000;
          border-bottom: solid 1px #000;
        }

        .horizon + .horizon {
          border-top: none;
        }

        .horizon canvas {
          display: block;
          height: 40px;
        }

        .horizon .title,
        .horizon .value {
          bottom: 0;
          line-height: 40px;
          margin: 0 6px;
          position: absolute;          
          white-space: nowrap;
        }

        .horizon .title {
          left: 0;
          font-size: 1rem;
          font-weight: 300;
        }

        .horizon .value {
          right: 0;
        }
      `}</style>      
    </div>
  );
}

export default ResponsiveWrapper(CubismChart);
