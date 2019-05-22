import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';

const GaugeChart = props => {
  const { width, height, data, dataRange, ptwidth, kind } = props;
  const chartRef = useRef();
  let data_cnv = [];
  data_cnv = data.map(e => e.value ? e.value : 0);  
  if(kind == 0){
      data_cnv[0] = data_cnv[0] > dataRange.max ? dataRange.max : data_cnv[0];
      data_cnv[0] = data_cnv[0] < dataRange.min ? dataRange.min : data_cnv[0];
  }
  data_cnv[1] = data_cnv[1] > dataRange.max ? dataRange.max : data_cnv[1];
  data_cnv[1] = data_cnv[1] < dataRange.min ? dataRange.min : data_cnv[1];
  data_cnv[2] = data_cnv[2] > dataRange.max ? dataRange.max : data_cnv[2];
  data_cnv[2] = data_cnv[2] < dataRange.min ? dataRange.min : data_cnv[2];  
  
  if(kind > 0){
    data_cnv[0] = data_cnv[0] * 100;
    console.log(data_cnv[0], ' data_cnv[0]')
  }

  const drawChart = () => {    
    let n = kind == 3 ? 200: 100,
      radius = Math.min(width * 0.28, height / 2),
      needleRad = radius - (radius * 2) / 5,
      needleCenterRad = radius * 0.15,
      pi = Math.PI,
      halfPi = pi / 2,
      endAngle = pi / 2,
      startAngle = -endAngle,
      field = d3.range(startAngle, endAngle, pi / n),
      scale = d3
        .scaleLinear()
        .domain([kind == 3 ? -100 : 0, 100])
        .range([startAngle, endAngle]);
    let range = Math.abs(dataRange.max - dataRange.min),
      step = n / range,
      preStep1 = data_cnv[0] > 100 ? 100 : data_cnv[0],
      rmin = kind == 3 ? -100 : 0,
      preStep = preStep1 < rmin ? rmin : preStep1,
      step1 = (range / n) * preStep,
      linearColor = d3
        .scaleLinear()
        .range(['#e2062a', '#ee7e00', '#66ad2b'])
        .domain([0, range / 2, range]);

    if (dataRange.direction == 1){
      linearColor = d3
        .scaleLinear()
        .range(['#e2062a', '#ee7e00', '#66ad2b'])
        .domain([0, range / 2, range]);    
    }else{
      linearColor = d3
        .scaleLinear()
        .range(['#66ad2b', '#ee7e00', '#e2062a'])
        .domain([0, range / 2, range]);
    }
    if(kind == 3){
      linearColor = d3
        .scaleLinear()        
        .range(['#e2062a', '#e4e7ec', '#66ad2b'])
        .domain([-range / 2, 0, range/2]);
    }

    d3.select(chartRef.current)
      .selectAll('*')
      .remove();

    let arc = d3
      .arc()
      .innerRadius(radius - radius / 5)
      .outerRadius(radius)
      .startAngle((d, i) => kind == 3 ? scale(i - 100) : scale(i))
      .endAngle((d, i) => kind == 3 ? scale(i - 99) : scale(i + 1));

    if (kind == 0)
      d3.select(chartRef.current)
        .append('g')
        .selectAll('path')
        .data(field)
        .enter()
        .append('path')
        .attr('stroke', (d, i) => (i + 1 <= data_cnv[0] * step ? linearColor(data_cnv[0]) : '#e4e7ec'))
        .attr('fill', (d, i) => (i + 1 <= data_cnv[0] * step ? linearColor(data_cnv[0]) : '#e4e7ec'))
        .attr('d', arc);
    else if(kind == 3)
      d3.select(chartRef.current)
        .append('g')
        .selectAll('path')
        .data(field)
        .enter()
        .append('path')
        .attr('stroke', (d, i) => i + 1 - 100 <= data_cnv[0] ? linearColor(step1) : '#e4e7ec')
        .attr('fill', (d, i) => i + 1 - 100 <= data_cnv[0] ? linearColor(step1) : '#e4e7ec')
        .attr('d', arc);
    else
      d3.select(chartRef.current)
        .append('g')
        .selectAll('path')
        .data(field)
        .enter()
        .append('path')
        .attr('stroke', (d, i) => (i + 1 <= data_cnv[0] ? linearColor(step1) : '#e4e7ec'))
        .attr('fill', (d, i) => (i + 1 <= data_cnv[0] ? linearColor(step1) : '#e4e7ec'))
        .attr('d', arc);
    //draw needle

    let needle = d3
      .select(chartRef.current)
      .append('path')
      .attr('class', 'needle')
      .attr('fill', kind == 0 ? linearColor(data_cnv[0]) : linearColor(step1));

    // add branche, market label
    let ticks = scale.ticks(100);
    d3.select(chartRef.current)
      .append('g')
      .attr('class', 'label')
      .selectAll('text.label')
      .data(ticks)
      .enter()
      .append('text')
      .attr('transform', function(d) {
        let _in = scale(d) - halfPi;
        let topX = radius * Math.cos(_in),
          topY = (radius + 10) * Math.sin(_in);
        return 'translate(' + topX + ',' + topY + ')';
      })
      .style('text-anchor', d => (d < 50 ? 'end' : 'start'))
      .style('font-size', width * 0.04 + 'pt')
      .attr('fill', '#929292')
      .text(function(d) {
        if (d === Math.floor(data_cnv[1] * step)) {
          return 'Branche';
        }
        if (d === Math.floor(data_cnv[2] * step)) {
          return 'Market';
        }
        return '';
      });

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
        if (d === Math.floor(data_cnv[1] * step)) {
          return 3;
        }
        if (d === Math.floor(data_cnv[2] * step)) {
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
          that.text(kind == 0 ? val : val + '%');
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
    updateNeedle(scale(0), scale(kind == 0 ? data_cnv[0] * step : preStep) + 0.01);
    updatePercent(0, data_cnv[0]);
  }
  useEffect(() => {    
    drawChart();
  }, [width, height, JSON.stringify(data_cnv)]);

  return (
    <svg width={width} height={height} transform={`translate(${(ptwidth - width) / 2}, 0)`}>
      <g      
        className="gaugeChart"
        transform={`translate(${width / 2}, ${height * 0.5})`}
        ref={chartRef}
      />
      <g className="legendBottom" transform={`translate(${width / 2}, ${(height * 5) / 7})`}>
        <text        
          className={'percentText' + kind} textAnchor="middle"
          style={{ fontSize: width * 0.12, fill: '#929292', fontWeight: '600' }}
        >
          {data_cnv[0] == Math.floor(data_cnv[0]) ? data_cnv[0].toFixed(0) : data_cnv[0].toFixed(1)}
        </text>
        <text
          y={width * 0.08}
          textAnchor="middle"
          style={{ fontSize: width * 0.065, fill: '#929292' }}
        >
          {dataRange.title}
        </text>
      </g>
    </svg>
  );
}

export default GaugeChart;
