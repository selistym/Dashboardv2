import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const GaugeChart = props => {
  const { width, height, data, dataRange, ptwidth, kind } = props;
  const chartRef = useRef();
  let data_cnv = [];
  data_cnv = data.map(e => (e.value ? e.value : 0));

  if (kind == 0 || kind > 3) {
    data_cnv[0] = data_cnv[0] > dataRange.max ? dataRange.max : data_cnv[0];
    data_cnv[0] = data_cnv[0] < dataRange.min ? dataRange.min : data_cnv[0];
  }
  data_cnv[1] = data_cnv[1] > dataRange.max ? dataRange.max : data_cnv[1];
  data_cnv[1] = data_cnv[1] < dataRange.min ? dataRange.min : data_cnv[1];
  data_cnv[2] = data_cnv[2] > dataRange.max ? dataRange.max : data_cnv[2];
  data_cnv[2] = data_cnv[2] < dataRange.min ? dataRange.min : data_cnv[2];

  if (kind > 0 && kind < 4) {
    data_cnv[0] = data_cnv[0] * 100;
  }

  useEffect(() => {
    {
      const drawChart = () => {
        let radius = Math.min(width * 0.28, height / 2),
          needleRad = radius - (radius * 2) / 5,
          needleCenterRad = radius * 0.15,
          pi = Math.PI,
          halfPi = pi / 2,
          endAngle = pi / 2,
          startAngle = -endAngle,
          n = 100,
          show_diff = 0,
          rmin = 0,
          rmax = 100;
        switch (Number(kind)) {
          case 1:
          case 2:
            n = 25;
            rmin = 0;
            rmax = 25;
            show_diff = 1;
            break;
          case 3:
            n = 200;
            rmin = -100;
            rmax = 100;
            show_diff = 15;
            break;
          case 0:
          case 4:
          case 5:
            n = 100;
            rmin = 0;
            rmax = 100;
            show_diff = 7;
            break;
          default:
            n = 100;
            rmin = 0;
            rmax = 100;
            show_diff = 15;
            break;
        }
        let scale = d3
          .scaleLinear()
          .domain([rmin, rmax])
          .range([startAngle, endAngle]);
        let field = d3.range(startAngle, endAngle, pi / n);
        let range = Math.abs(dataRange.max - dataRange.min),
          step = n / range,
          preStep1 = data_cnv[0] > rmax ? rmax : data_cnv[0],
          preStep = preStep1 < rmin ? rmin : preStep1,
          step1 = (range / n) * preStep,
          linearColor = d3
            .scaleLinear()
            .range(['#e2062a', '#ee7e00', '#66ad2b'])
            .domain([0, range / 2, range]);

        if (dataRange.direction == 1) {
          linearColor = d3
            .scaleLinear()
            .range(['#dc143c', '#ffa500', '#008000'])
            .domain([0, range / 2, range]);
        } else {
          linearColor = d3
            .scaleLinear()
            .range(['#008000', '#ffa500', '#dc143c'])
            .domain([0, range / 2, range]);
        }
        if (kind == 0) {
          linearColor = d3
            .scaleLinear()
            .range(['#008000', '#32cd32', '#ffa500', '#dc143c'])
            .domain([0, range * 0.3, range * 0.31,  range]);        
        }
        if (kind == 3) {
          if (data_cnv[0] > 0) {
            linearColor = d3
              .scaleLinear()
              .range(['#32cd32', '#008000'])
              .domain([0, range / 2]);
          } else {
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500'])
              .domain([-range / 2, 0]);
          }
        }
        if (kind == 5) {
            linearColor = d3
              .scaleLinear()
              .range(['#008000', '#32cd32', '#ffa500',  '#dc143c'])
              .domain([0, range * 5/6, range * 5/6 + range * 0.01,  range]);          
        }

        d3.select(chartRef.current)
          .selectAll('*')
          .remove();

        let arc = d3
          .arc()
          .innerRadius(radius - radius / 5)
          .outerRadius(radius)
          .startAngle((d, i) => scale(i + rmin))
          .endAngle((d, i) => scale(i + rmin + 1));

        if (kind == 0 || kind > 3)
          d3.select(chartRef.current)
            .append('g')
            .selectAll('path')
            .data(field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) =>
              i + 1 <= (Math.abs(dataRange.min) + data_cnv[0]) * step
                ? linearColor(Math.abs(dataRange.min) + data_cnv[0])
                : '#e4e7ec'
            )
            .attr('fill', (d, i) =>
              i + 1 <= (Math.abs(dataRange.min) + data_cnv[0]) * step
                ? linearColor(Math.abs(dataRange.min) + data_cnv[0])
                : '#e4e7ec'
            )
            .attr('d', arc);
        else
          d3.select(chartRef.current)
            .append('g')
            .selectAll('path')
            .data(field)
            .enter()
            .append('path')
            .attr('stroke', (d, i) => (i + 1 + rmin <= data_cnv[0] ? linearColor(step1) : '#e4e7ec'))
            .attr('fill', (d, i) => (i + 1 + rmin <= data_cnv[0] ? linearColor(step1) : '#e4e7ec'))
            .attr('d', arc);
        //draw needle

        let needle = d3
          .select(chartRef.current)
          .append('path')
          .attr('class', 'needle')
          .attr(
            'fill',
            kind == 0 || kind == 4 || kind == 5
              ? linearColor(Math.abs(dataRange.min) + data_cnv[0])
              : linearColor(step1)
          );
        
        let ticks = scale.ticks(n);
        
        // add marker
        d3.select(chartRef.current)
          .append('g')
          .attr('class', 'marker')
          .selectAll('path.marker')
          .data(ticks)
          .enter()
          .append('path')
          .style('stroke', '#929292')
          .style('stroke-width', function(d) {
            if (d === Math.floor((Math.abs(dataRange.min) + data_cnv[1]) * step)) {              
              return 3;
            }
            if (d === Math.floor((Math.abs(dataRange.min) + data_cnv[2]) * step)) {              
              return 3;
            }
            return 0;
          })
          .attr('d', function(d) {
            let _in = scale(d) - halfPi;
            let farX = (radius + 2) * Math.cos(_in),
              farY = (radius + 2) * Math.sin(_in),
              nearX = ((radius * 4) / 5 - 2) * Math.cos(_in),
              nearY = ((radius * 4) / 5 - 2) * Math.sin(_in);

            return 'M ' + farX + ' ' + farY + ' L ' + nearX + ' ' + nearY + ' Z';
          });
        // add branche, market label
        d3.select(chartRef.current)
          .append('g')
          .attr('class', 'label')
          .selectAll('text.label.branch')
          .data(ticks)
          .enter()
          .append('text')
          .attr('transform', function(d) {
            let _in = scale(d) - halfPi;
            let topX = (radius + 5) * Math.cos(_in),
              topY = (radius + 5) * Math.sin(_in);
            return 'translate(' + topX + ',' + topY + ')';
          })
          .style('text-anchor', d => d < (rmax + rmin) / 2 ? 'end' : 'start')
          .style('font-size', width * 0.035 + 'pt')
          .style('font-weight', '600')
          .attr('fill', 'black')
          .text(d => { 
              if (d === Math.floor((Math.abs(dataRange.min) + data_cnv[1]) * step)) {
                return 'Branche';
              }              
            return '';
          });
        d3.select(chartRef.current)
          .append('g')
          .attr('class', 'label')
          .selectAll('text.label.market')
          .data(ticks)
          .enter()
          .append('text')
          .attr('transform', function(d) {
            let _in = scale(d) - halfPi;
            let topX = (radius - 25) * Math.cos(_in),
              topY = (radius - 25) * Math.sin(_in);
            return 'translate(' + topX + ',' + topY + ')';
          })
          .style('text-anchor', d => d < (rmax + rmin) / 2 ? 'start' : 'end')
          .style('font-size', width * 0.035 + 'pt')
          .style('font-weight', '600')
          .attr('fill', 'black')
          .text(d => {
              if(kind == 0 || kind == 1 || kind == 2 || kind == 5){
                if (d === Math.floor((Math.abs(dataRange.min) + data_cnv[2]) * step)) {
                  return 'Market';
                }
              }
            return '';
          });
        
        function updateNeedle(oldValue, newValue) {
          needle
            .datum({ oldValue: oldValue })
            .transition()
            .duration(2000)
            .attrTween('d', lineTween(newValue));
        }
        function updatePercent(oldValue, newValue) {
          d3.select('.percentText' + kind)
            .datum({ oldValue: oldValue })
            .transition()
            .duration(2000)
            .tween('text', textTween(newValue));
        }
        function textTween(newValue) {
          return function(d) {
            var that = d3.select(this),
              i = d3.interpolate(d.oldValue, newValue);

            return function(t) {
              let val = i(t) == i(t).toFixed(0) ? i(t).toFixed(0) : i(t).toFixed(1);
              that.text(kind == 0 || kind == 4 || kind == 5 ? val : val + '%');
            };
          };
        }
        function lineTween(newValue) {
          return function(d) {
            var interpolate = d3.interpolate(d.oldValue, newValue);
            return function(t) {
              var _in = interpolate(t) - halfPi,
                _im = _in - halfPi,
                _ip = _in + halfPi;

              var topX = needleRad * Math.cos(_in),
                topY = needleRad * Math.sin(_in);

              var leftX = needleCenterRad * Math.cos(_im),
                leftY = needleCenterRad * Math.sin(_im);

              var rightX = needleCenterRad * Math.cos(_ip),
                rightY = needleCenterRad * Math.sin(_ip);

              return (
                'M' +
                topX +
                ',' +
                topY +
                'L' +
                leftX +
                ',' +
                leftY +
                'A' +
                leftX +
                ',' +
                leftX +
                ',1,0,0,' +
                rightX +
                ',' +
                rightY +
                'Z'
              );
            };
          };
        }
        updateNeedle(
          scale(0),
          scale(kind == 0 || kind == 4 || kind == 5 ? (Math.abs(dataRange.min) + data_cnv[0]) * step : preStep) + 0.01
        );
        updatePercent(0, data_cnv[0]);
      };
      drawChart();
    }
  }, [width, height, data]); //eslint-disable-line

  return (
    <svg width={width} height={height} transform={`translate(${(ptwidth - width) / 2}, 0)`}>
      <g className="gaugeChart" transform={`translate(${width / 2}, ${height * 0.5})`} ref={chartRef} />
      <g className="legendBottom" transform={`translate(${width / 2}, ${(height * 5) / 7})`}>
        <text
          className={'percentText' + kind}
          textAnchor="middle"
          style={{ fontSize: width * 0.12, fill: '#929292', fontWeight: '600' }}
        >
          {data_cnv[0] == Math.floor(data_cnv[0]) ? data_cnv[0].toFixed(0) : data_cnv[0].toFixed(1)}
        </text>
        <text y={width * 0.08} textAnchor="middle" style={{ fontSize: width * 0.065, fill: '#929292' }}>
          {dataRange.title}
        </text>
      </g>
    </svg>
  );
};

GaugeChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.number
    })
  ).isRequired,
  ptwidth: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
  dataRange: PropTypes.shape({
    title: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    direction: PropTypes.number.isRequired
  })
};

export default GaugeChart;
