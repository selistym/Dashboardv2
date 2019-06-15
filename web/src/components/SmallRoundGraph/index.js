import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const SmallRoundGraph = props => {
  const { params, idx, width } = props;
  let height = width * 0.8;
  
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
      const setFontSize = radius => (radius <= 10 ? 11 : radius >= 50 ? 14 : 12);

      let radius = Math.min(width, height) / 1.6,
        spacing = 0.05;

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
        .style('font-size', '6pt')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.4em')
        .attr('fill', setColor(total))
        .text(total);
      var arcs = field
        .append('path')
        .attr('class', 'arc-body')
        .style('fill', () => setColor(total));

      arcs
        .transition()
        .duration(750)
        .attrTween('d', arcTween(arcBody));

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
  }, [JSON.stringify(params), width]); //eslint-disable-line

  return (
    <>
      <svg className={'roundChart' + idx} width={width} height={height}>
        <g className={'round' + idx} ref={roundRef} transform={`translate(${width / 2}, ${height / 2})`} />
        <g className={'line' + idx} ref={lineRef} transform={`translate(${width / 2}, ${height / 2})`} />
      </svg>
    </>
  );
};
SmallRoundGraph.propTypes = {
  params: PropTypes.shape({
    Year: PropTypes.number.isRequired,
    Total: PropTypes.number.isRequired,
    Dividend: PropTypes.number.isRequired,
    Balance: PropTypes.number.isRequired,
    Growth: PropTypes.number.isRequired,
    Value: PropTypes.number.isRequired
  }).isRequired,
  idx: PropTypes.string.isRequired,
  filterCondition: PropTypes.array,
  width: PropTypes.number
};

export default SmallRoundGraph;
