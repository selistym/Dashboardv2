import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ResponsiveWrapper from './ResponsiveWrapper';
import * as d3 from 'd3';

const RoundGraph = props => {
  const { params, idx } = props;

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
  let width = props.parentWidth, /* eslint-disable-line */
      height = props.parentWidth; /* eslint-disable-line */

  const roundRef = useRef();

  useEffect(() => {
    const drawRound = () => {
      let colors = { red: '#f45b63', orange: '#f49d73', green: '#72c14a' };
      const setColor = total => (total <= 50 ? colors.red : total >= 70 ? colors.green : colors.orange);

      let radius = Math.min(width, height) / 2,
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
      field
        .append('text')
        .style('font-weight', 'bold')
        .style('font-size', '8pt')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', setColor(total))
        .text(total);
      var arcs = field
        .append('path')
        .attr('class', 'arc-body')
        .style('fill', () => setColor(total));

      arcs
        // .style('stroke', '#fff')
        // .style('stroke-width', 2)
        // .style('cursor', 'pointer')
        .transition()
        .duration(750)
        .attrTween('d', arcTween(arcBody));

      // field
      //   .append('text')
      //   .attr('dy', '-.15em')
      //   .attr('dx', '-0.75em')
      //   .style('text-anchor', 'middle')
      //   .attr('transform', d => 'translate(' + [0, -d.index * radius] + ')')
      //   .style('font-size', '8pt')
      //   .style('fill', setColor(total))
      //   .text(d => d.text.split('')[0]);

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
  }, [params.Dividend, params.Balance, params.Growth, params.Value]);

  return (
    <>
      <svg className={'smallroundChart' + idx} width={width} height={height}>
        <g className={'smallround' + idx} ref={roundRef} transform={`translate(${width / 2}, ${height / 2})`} />
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
