import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ResponsiveWrapper from './ResponsiveWrapper';
import * as d3 from 'd3';

const RoundGraph = props => {
  const { params, idx, filterCondition, parentWidth } = props;
  let strFilter = filterCondition ? filterCondition.sort().toString() : '';
  
  let width = parentWidth, height = parentWidth * 0.8;

  const roundRef = useRef();
  const lineRef = useRef();

  useEffect(() => {
    const drawRound = () => {
      let dataUpdated = [
        {
          index: 0.7,
          text: 'Dividend',
          value: params.Dividend ? params.Dividend / 100 : 0
        },
        {
          index: 0.6,
          text: 'Balance',
          value: params.Balance ? params.Balance / 100 : 0
        },
        {
          index: 0.5,
          text: 'Growth',
          value: params.Growth ? params.Growth / 100 : 0
        },
        {
          index: 0.4,
          text: 'Value',
          value: params.Value ? params.Value / 100 : 0
        }
      ];
      let colors = { red: '#f45b63', orange: '#f49d73', green: '#72c14a' };
      const setColor = total => (total <= 50 ? colors.red : total >= 70 ? colors.green : colors.orange);
      const setFontSize = radius => (radius <= 120 ? 11 : radius >= 180 ? 14 : 12);

      let radius = Math.min(width, height) / 1.6,
        spacing = 0.09;

      d3.select(roundRef.current)
        .selectAll('*')
        .remove();

      let arcBody = d3
        .arc()
        .startAngle(0)
        .endAngle(d => d.value * 2 * Math.PI)
        .innerRadius(d => d.index * radius)
        .outerRadius(d => (d.index + spacing) * radius)
        .cornerRadius(2);

      let field = d3
        .select(roundRef.current)
        .selectAll('g')
        .data(dataUpdated, d => d.value)
        .enter()
        .append('g');

      let total = params.Total ? params.Total : 0;
      //add score
      let txt_score = field
        .append('text')
        .style('font-weight', 'bold')
        .style('font-size', '22pt')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', setColor(total))
        .text(total);
      var arcs = field
        .append('path')
        .attr('class', 'arc-body')
        .style('fill', () => setColor(total));

      arcs
        .attr('opacity', d => (filterCondition ? (filterCondition.indexOf(d.text) != -1 ? 1 : 0) : 1))
        .style('stroke', '#fff')
        .style('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('click', function() {
          arcs.style('fill', 'grey');
          d3.select(this).style('fill', setColor(total));
          d3.select('.text-all' + idx).attr('opacity', 1);
        })
        .on('mouseover', function(d) {
          if (d3.select(this).attr('opacity') == 0) return;
          if (d.value == 0) return;
          d3.select(this).style('stroke-width', 0);
          txt_score
            .attr('dy', '0.3em')
            .attr('fill', setColor(d.value * 100))
            .text(Math.floor(d.value * 100));
        })
        .on('mouseout', function(d) {
          if (d3.select(this).attr('opacity') == 0) return;
          if (d.value == 0) return;
          d3.select(this).style('stroke-width', 2);
          txt_score
            .attr('dy', '0.3em')
            .attr('fill', setColor(total))
            .text(total);
        })
        .transition()
        .duration(750)
        .attrTween('d', arcTween(arcBody));

      d3.select(roundRef.current)
        .append('text')
        .attr('class', 'text-all' + idx)
        .attr('transform', 'translate(' + radius * 0.7 + ',' + radius * 0.7 + ')')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('text-decoration', 'underline')
        .style('font-size', 16)
        .style('fill', 'grey')
        .attr('opacity', 0)
        .text('All')
        .style('cursor', 'pointer')
        .on('click', function() {
          arcs.style('fill', setColor(total));
          d3.select(this).attr('opacity', 0);
          txt_score
            .attr('dy', '0.3em')
            .attr('fill', setColor(total))
            .text(total);
        });
      field
        .append('text')
        .attr('dy', '-.15em')
        .attr('dx', '-0.75em')
        .style('text-anchor', 'middle')
        .attr('transform', d => 'translate(' + [0, -d.index * radius] + ')')
        .style('font-size', setFontSize(radius))
        .style('font-weight', 'bold')
        .style('fill', setColor(total))
        .text(d => d.text.split('')[0]);

      function arcTween(arc) {
        return function(d) {
          var i = d3.interpolateNumber(0, d.value);
          return function(t) {
            d.value = i(t);
            return arc(d);
          };
        };
      }
    };
    drawRound();
  }, [
    params.Dividend,
    params.Balance,
    params.Growth,
    params.Value,
    params.Total,
    strFilter,    
    filterCondition,
    height,
    idx,    
    width
  ]);

  return (
    <>
      <svg className={'roundChart' + idx} width={width} height={height}>
        <g className={'round' + idx} ref={roundRef} transform={`translate(${width / 2}, ${height / 2})`} />
        <g className={'line' + idx} ref={lineRef} transform={`translate(${width / 2}, ${height / 2})`} />
      </svg>
    </>
  );
};
RoundGraph.propTypes = {
  params: PropTypes.shape({
    Year: PropTypes.number.isRequired,
    Total: PropTypes.number.isRequired,
    Dividend: PropTypes.number.isRequired,
    Balance: PropTypes.number.isRequired,
    Growth: PropTypes.number.isRequired,
    Value: PropTypes.number.isRequired
  }).isRequired,
  idx: PropTypes.string.isRequired,
  filterCondition: PropTypes.array
};

export default ResponsiveWrapper(RoundGraph);
