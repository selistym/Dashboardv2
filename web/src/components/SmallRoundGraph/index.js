import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

const SmallRoundGraph = props => {
  const { params, idx, width } = props
  let height = width * 0.8

  const roundRef = useRef()
  const lineRef = useRef()

  useEffect(
    () => {
      const drawRound = () => {
        let dataUpdated = [
          {
            index: 0.7,
            text: 'Dividend',
            value: params.dividend ? params.dividend / 100 : 0
          },
          {
            index: 0.6,
            text: 'Balance',
            value: params.balance ? params.balance / 100 : 0
          },
          {
            index: 0.5,
            text: 'Growth',
            value: params.growth ? params.growth / 100 : 0
          },
          {
            index: 0.4,
            text: 'Value',
            value: params.value ? params.value / 100 : 0
          }
        ]
        let colors = { red: '#f45b63', orange: '#f49d73', green: '#72c14a' }
        const setColor = total =>
          total <= 40 ? colors.red : total >= 60 ? colors.green : colors.orange

        let radius = Math.min(width, height) / 1.6

        let spacing = 0.05

        d3.select(roundRef.current)
          .selectAll('*')
          .remove()

        let arcBody = d3
          .arc()
          .startAngle(0)
          .endAngle(d => d.value * 2 * Math.PI)
          .innerRadius(d => d.index * radius)
          .outerRadius(d => (d.index + spacing) * radius)
          .cornerRadius(2)

        let field = d3
          .select(roundRef.current)
          .selectAll('g')
          .data(dataUpdated, d => d.value)
          .enter()
          .append('g')

        let total = params.total ? params.total : 0
        // add score
        field
          .append('text')
          .style('font-weight', 'bold')
          .style('font-size', '6pt')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.4em')
          .attr('fill', setColor(total))
          .text(total)
        var arcs = field
          .append('path')
          .attr('class', 'arc-body')
          .style('fill', () => setColor(total))

        arcs
          .transition()
          .duration(750)
          .attrTween('d', arcTween(arcBody))

        function arcTween (arc) {
          return function (d) {
            var i = d3.interpolateNumber(0, d.value)
            return function (t) {
              d.value = i(t)
              return arc(d)
            }
          }
        }
      }
      drawRound()
    },
    [JSON.stringify(params), width]//eslint-disable-line
  ) 

  return (
    <>
      <svg className={'roundChart' + idx} width={width} height={height}>
        <g
          className={'round' + idx}
          ref={roundRef}
          transform={`translate(${width / 2}, ${height / 2})`}
        />
        <g
          className={'line' + idx}
          ref={lineRef}
          transform={`translate(${width / 2}, ${height / 2})`}
        />
      </svg>
    </>
  )
}
SmallRoundGraph.propTypes = {
  params: PropTypes.shape({
    year: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    dividend: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    growth: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  idx: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
}

export default SmallRoundGraph
