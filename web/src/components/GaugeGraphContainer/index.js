import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import FreeScrollBar from 'react-free-scrollbar'
import useDimensions from '../Dimensions'
import * as d3 from 'd3'

const GaugeGraph = ({ data, width, height, kind }) => {
  const graphRef = useRef()
  const w = Math.min(width, height)

  const h = Math.min(width, height)

  useEffect(
    () => {
      const drawGraph = () => {
        let radius = w * 0.3

        let needleRad = radius - (radius * 2) / 5

        let needleCenterRad = radius * 0.15

        let pi = Math.PI

        let halfPi = pi / 2

        let endAngle = pi / 2

        let startAngle = -endAngle

        let scale = d3
          .scaleLinear()
          .domain([0, 100])
          .range([startAngle, endAngle])

        let field = d3.range(startAngle, endAngle, pi / 100)
        let linearColor

        d3.select(graphRef.current)
          .selectAll('*')
          .remove()

        let arc = d3
          .arc()
          .innerRadius(radius - radius / 5)
          .outerRadius(radius)
          .startAngle((d, i) => scale(i))
          .endAngle((d, i) => scale(i + 1))

        switch (kind) {
          case 0:
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500', '#32cd32', '#008000'])
              .domain([0, 70, 71, 100])
            break
          case 1:
          case 2:
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500', '#008000'])
              .domain([0, 50, 100])
            break
          case 3:
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500', '#32cd32', '#008000'])
              .domain([0, 49.9, 50, 100])
            break
          case 4:
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500', '#008000'])
              .domain([0, 50, 100])
            break
          case 5:
            linearColor = d3
              .scaleLinear()
              .range(['#dc143c', '#ffa500', '#32cd32', '#008000'])
              .domain([0, 19, 22, 100])
            break
        }

        d3.select(graphRef.current)
          .append('g')
          .selectAll('path')
          .data(field)
          .enter()
          .append('path')
          .attr('stroke', (d, i) =>
            (kind < 1 && data.company == 100) || data.company == -1
              ? 'grey'
              : i + 1 <= data.company
                ? linearColor(data.company)
                : '#e4e7ec'
          )
          .attr('fill', (d, i) =>
            (kind < 1 && data.company == 100) || data.company == -1
              ? 'grey'
              : i + 1 <= data.company
                ? linearColor(data.company)
                : '#e4e7ec'
          )
          .attr('d', arc)

        // draw needle
        let needle
        needle = d3
          .select(graphRef.current)
          .append('path')
          .attr('class', 'needle')
          .attr(
            'fill',
            (kind < 1 && data.company == 100) || data.company == -1
              ? 'grey'
              : linearColor(data.company)
          )

        let ticks = scale.ticks(100)

        // add marker
        d3.select(graphRef.current)
          .append('g')
          .attr('class', 'marker')
          .selectAll('path.marker')
          .data(ticks)
          .enter()
          .append('path')
          .style('stroke', '#929292')
          .style('stroke-width', function (d) {
            if (d === Math.floor(data.branch)) {
              return 3
            }
            if (d === Math.floor(data.market)) {
              return 3
            }
            return 0
          })
          .attr('d', function (d) {
            let _in = scale(d) - halfPi
            let farX = (radius + 2) * Math.cos(_in)

            let farY = (radius + 2) * Math.sin(_in)

            let nearX = ((radius * 4) / 5 - 2) * Math.cos(_in)

            let nearY = ((radius * 4) / 5 - 2) * Math.sin(_in)
            return 'M ' + farX + ' ' + farY + ' L ' + nearX + ' ' + nearY + ' Z'
          })

        // add branche, market label
        d3.select(graphRef.current)
          .append('g')
          .attr('class', 'label')
          .selectAll('text.label.branch')
          .data(ticks)
          .enter()
          .append('text')
          .attr('transform', function (d) {
            let _in = scale(d) - halfPi
            let topX = (radius + 5) * Math.cos(_in)

            let topY = (radius + 5) * Math.sin(_in)
            return 'translate(' + topX + ',' + topY + ')'
          })
          .style('text-anchor', d => (d < 50 ? 'end' : 'start'))
          .style('font-size', '8pt')
          .style('font-weight', '600')
          .attr('fill', 'black')
          .text(d => {
            if (d === Math.floor(data.branch)) {
              return 'Industry'
            }
            return ''
          })
        d3.select(graphRef.current)
          .append('g')
          .attr('class', 'label')
          .selectAll('text.label.market')
          .data(ticks)
          .enter()
          .append('text')
          .attr('transform', function (d) {
            let _in = scale(d) - halfPi
            let topX = (radius + 5) * Math.cos(_in)

            let topY = (radius + 5) * Math.sin(_in)
            return 'translate(' + topX + ',' + topY + ')'
          })
          .attr('dy', () => {
            let branch = Math.floor(data.branch)

            let market = Math.floor(data.market)
            if (Math.abs(branch - market) <= 15) {
              if (branch < market) {
                if (branch < 50 && market < 50) {
                  return -10
                } else {
                  return 10
                }
              } else {
                if (branch < 50 && market < 50) {
                  return 10
                } else {
                  return -10
                }
              }
            } else return 0
          })
          .style('text-anchor', d => (d < 50 ? 'end' : 'start'))
          .style('font-size', '8pt')
          .style('font-weight', '600')
          .attr('fill', 'black')
          .text(d => {
            if (d === Math.floor(data.market)) {
              return 'Market'
            }
            return ''
          })

        function updateNeedle (oldValue, newValue) {
          needle
            .datum({ oldValue: oldValue })
            .transition()
            .duration(2000)
            .attrTween('d', lineTween(newValue))
        }
        function updatePercent (oldValue, newValue) {
          d3.select('.percentText' + kind)
            .datum({ oldValue: oldValue })
            .transition()
            .duration(2000)
            .tween('text', textTween(newValue))
        }
        function textTween (newValue) {
          return function (d) {
            var that = d3.select(this)

            var i = d3.interpolate(d.oldValue, newValue)

            return function (t) {
              let val =
                i(t) == i(t).toFixed(0) ? i(t).toFixed(0) : i(t).toFixed(1)
              that.text(kind == 0 || kind == 4 || kind == 5 ? val : val + '%')
            }
          }
        }
        function lineTween (newValue) {
          return function (d) {
            var interpolate = d3.interpolate(d.oldValue, newValue)
            return function (t) {
              var _in = interpolate(t) - halfPi

              var _im = _in - halfPi

              var _ip = _in + halfPi

              var topX = needleRad * Math.cos(_in)

              var topY = needleRad * Math.sin(_in)

              var leftX = needleCenterRad * Math.cos(_im)

              var leftY = needleCenterRad * Math.sin(_im)

              var rightX = needleCenterRad * Math.cos(_ip)

              var rightY = needleCenterRad * Math.sin(_ip)

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
                'z'
              )
            }
          }
        }
        updateNeedle(scale(0), scale(data.company) + 0.01)
        updatePercent(0, data.company)
      }
      drawGraph()
    },
    [data, width, kind, w]//eslint-disable-line
  ) 

  return (
    <div>
      <svg width={w} height={h * 0.5}>
        <g transform={`translate(${w / 2}, ${h * 0.4})`} ref={graphRef} />
      </svg>
      <div
        className='columns'
        style={{
          padding: 0,
          fontSize: '22pt',
          fontWeight: 'bold',
          color: 'grey',
          textAlign: 'center'
        }}
      >
        <div className='column' style={{ padding: 0 }}>
          <span>{data.realCompany}</span>
        </div>
      </div>
      <div
        className='columns'
        style={{
          padding: 0,
          fontSize: '12pt',
          color: '#bdbbbc',
          textAlign: 'center'
        }}
      >
        <div className='column' style={{ padding: 0 }}>
          <span>{data.title}</span>
        </div>
      </div>
    </div>
  )
}
const GaugeGraphContainer = ({ data }) => {
  const [svgContainerRef, svgSize] = useDimensions()

  let i_data = [
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'PE-ratio',
      min: 0,
      max: 40
    },
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'ROIC',
      min: 0,
      max: 0.25
    },
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'Return on equity',
      min: 0,
      max: 0.25
    },
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'Revenue Growth per Share',
      min: -1,
      max: 1
    },
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'Debt-ratio',
      min: 0,
      max: 4
    },
    {
      company: 0,
      branch: 0,
      market: 0,
      realCompany: '',
      title: 'Nett-Debt / EBITDA',
      min: -3,
      max: 3
    }
  ]

  const preCorrection = param => {
    // PE-ratio
    const pe_ratio_step = Math.abs(100 / (i_data[0].max - i_data[0].min))

    if (param.PERatioCompany) {
      i_data[0].company =
        param.PERatioCompany < i_data[0].min
          ? i_data[0].min * 0.999
          : param.PERatioCompany > i_data[0].max
            ? i_data[0].max * 0.999
            : param.PERatioCompany
    } else {
      i_data[0].company = -1
    }

    if (param.PERatioBranche) {
      i_data[0].branch =
        param.PERatioBranche < i_data[0].min
          ? i_data[0].min
          : param.PERatioBranche > i_data[0].max
            ? i_data[0].max
            : param.PERatioBranche
    } else {
      i_data[0].branch = -1
    }

    if (param.PERatioMarket) {
      i_data[0].market =
        param.PERatioMarket < i_data[0].min
          ? i_data[0].min
          : param.PERatioMarket > i_data[0].max
            ? i_data[0].max
            : param.PERatioMarket
    } else {
      i_data[0].market = -1
    }

    if (param.PERatioCompany) {
      i_data[0].company = 100 - i_data[0].company * pe_ratio_step
    }
    i_data[0].branch = 100 - i_data[0].branch * pe_ratio_step
    i_data[0].market = 100 - i_data[0].market * pe_ratio_step

    if (!param.PERatioCompany || param.PERatioCompany == 0) {
      i_data[0].realCompany = 'N/A'
    } else {
      i_data[0].realCompany =
        Math.floor(param.PERatioCompany) == param.PERatioCompany
          ? param.PERatioCompany.toFixed(0)
          : param.PERatioCompany.toFixed(1)
    }

    // ROIC
    const roic_ratio_step = Math.abs(100 / (i_data[1].max - i_data[1].min))

    if (param.ROICCompany) {
      i_data[1].company =
        param.ROICCompany < i_data[1].min
          ? i_data[1].min
          : param.ROICCompany > i_data[1].max
            ? i_data[1].max
            : param.ROICCompany
    } else {
      i_data[1].company = -1
    }

    if (param.ROICBranche) {
      i_data[1].branch =
        param.ROICBranche < i_data[1].min
          ? i_data[1].min
          : param.ROICBranche > i_data[1].max
            ? i_data[1].max
            : param.ROICBranche
    } else {
      i_data[1].branch = -1
    }

    if (param.ROICMarket) {
      i_data[1].market =
        param.ROICMarket < i_data[1].min
          ? i_data[1].min
          : param.ROICMarket > i_data[1].max
            ? i_data[1].max
            : param.ROICMarket
    } else {
      i_data[1].market = -1
    }

    if (param.ROICCompany) {
      i_data[1].company = i_data[1].company * roic_ratio_step
    }
    i_data[1].branch = i_data[1].branch * roic_ratio_step
    i_data[1].market = i_data[1].market * roic_ratio_step

    if (!param.ROICCompany || param.ROICCompany == 0) {
      i_data[1].realCompany = 'N/A'
    } else {
      i_data[1].realCompany = (param.ROICCompany * 100).toFixed(1) + '%'
    }
    // ROE

    const roe_ratio_step = Math.abs(100 / (i_data[2].max - i_data[2].min))

    if (param.ROECompany) {
      i_data[2].company =
        param.ROECompany < i_data[2].min
          ? i_data[2].min
          : param.ROECompany > i_data[2].max
            ? i_data[2].max
            : param.ROECompany
    } else {
      i_data[2].company = -1
    }

    if (param.ROICBranche) {
      i_data[2].branch =
        param.ROEBranche < i_data[2].min
          ? i_data[2].min
          : param.ROEBranche > i_data[2].max
            ? i_data[2].max
            : param.ROEBranche
    } else {
      i_data[2].branch = -1
    }

    if (param.ROICMarket) {
      i_data[2].market =
        param.ROEMarket < i_data[2].min
          ? i_data[2].min
          : param.ROEMarket > i_data[2].max
            ? i_data[2].max
            : param.ROEMarket
    } else {
      i_data[2].market = -1
    }

    if (param.ROECompany) i_data[2].company = i_data[2].company * roe_ratio_step
    i_data[2].branch = i_data[2].branch * roe_ratio_step
    i_data[2].market = i_data[2].market * roe_ratio_step

    if (!param.ROECompany || param.ROECompany == 0) {
      i_data[2].realCompany = 'N/A'
    } else {
      i_data[2].realCompany = (param.ROECompany * 100).toFixed(1) + '%'
    }

    // Revenue
    const rv_ratio_step = Math.abs(100 / (i_data[3].max - i_data[3].min))

    if (param.RevenueGrowthCompany) {
      i_data[3].company =
        param.RevenueGrowthCompany < i_data[3].min
          ? i_data[3].min
          : param.RevenueGrowthCompany > i_data[3].max
            ? i_data[3].max
            : param.RevenueGrowthCompany
    } else {
      i_data[3].company = -1
    }

    if (param.RevenueGrowthBranche) {
      i_data[3].branch =
        param.RevenueGrowthBranche < i_data[3].min
          ? i_data[3].min
          : param.RevenueGrowthBranche > i_data[3].max
            ? i_data[3].max
            : param.RevenueGrowthBranche
    } else {
      i_data[3].branch = -1
    }

    if (param.RevenueGrowthMarket) {
      i_data[3].market =
        param.RevenueGrowthMarket < i_data[3].min
          ? i_data[3].min
          : param.RevenueGrowthMarket > i_data[3].max
            ? i_data[3].max
            : param.RevenueGrowthMarket
    } else {
      i_data[3].market = -1
    }

    if (param.RevenueGrowthCompany) {
      i_data[3].company = i_data[3].company * rv_ratio_step + 50
    }
    i_data[3].branch = i_data[3].branch * rv_ratio_step + 50
    i_data[3].market = i_data[3].market * rv_ratio_step + 50

    if (!param.RevenueGrowthCompany) {
      i_data[3].realCompany = 'N/A'
    } else {
      i_data[3].realCompany =
        (param.RevenueGrowthCompany * 100).toFixed(1) + '%'
    }
    // Debt-ratio
    const debt_ratio_step = Math.abs(100 / (i_data[4].max - i_data[4].min))

    if (param.DebtRatioCompany) {
      i_data[4].company =
        param.DebtRatioCompany < i_data[4].min
          ? i_data[4].min
          : param.DebtRatioCompany > i_data[4].max
            ? i_data[4].max
            : param.DebtRatioCompany
    } else {
      i_data[4].company = -1
    }

    if (param.DebtRatioBranche) {
      i_data[4].branch =
        param.DebtRatioBranche < i_data[4].min
          ? i_data[4].min
          : param.DebtRatioBranche > i_data[4].max
            ? i_data[4].max
            : param.DebtRatioBranche
    } else {
      i_data[4].branch = -1
    }

    if (param.DebtRatioMarket) {
      i_data[4].market =
        param.DebtRatioMarket < i_data[4].min
          ? i_data[4].min
          : param.DebtRatioMarket > i_data[4].max
            ? i_data[4].max
            : param.DebtRatioMarket
    } else {
      i_data[4].market = -1
    }

    if (param.DebtRatioCompany) {
      i_data[4].company = 100 - i_data[4].company * debt_ratio_step
    }
    i_data[4].branch = 100 - i_data[4].branch * debt_ratio_step
    i_data[4].market = 100 - i_data[4].market * debt_ratio_step

    if (!param.DebtRatioCompany || param.DebtRatioCompany == 0) {
      i_data[4].realCompany = 'N/A'
    } else {
      i_data[4].realCompany =
        Math.floor(param.DebtRatioCompany) == param.DebtRatioCompany
          ? param.DebtRatioCompany.toFixed(0)
          : param.DebtRatioCompany.toFixed(1)
    }

    // Nett-Debt
    const net_ratio_step = Math.abs(100 / (i_data[5].max - i_data[5].min))

    if (param.NettDEBTEBITDACompany) {
      i_data[5].company =
        param.NettDEBTEBITDACompany < i_data[5].min
          ? i_data[5].min
          : param.NettDEBTEBITDACompany > i_data[5].max
            ? i_data[5].max
            : param.NettDEBTEBITDACompany
    } else {
      i_data[5].company = -1
    }

    if (param.NettDEBTEBITDABranche) {
      i_data[5].branch =
        param.NettDEBTEBITDABranche < i_data[5].min
          ? i_data[5].min
          : param.NettDEBTEBITDABranche > i_data[5].max
            ? i_data[5].max
            : param.NettDEBTEBITDABranche
    } else {
      i_data[5].branch = -1
    }

    if (param.NettDEBTEBITDAMarket) {
      i_data[5].market =
        param.NettDEBTEBITDAMarket < i_data[5].min
          ? i_data[5].min
          : param.NettDEBTEBITDAMarket > i_data[5].max
            ? i_data[5].max
            : param.NettDEBTEBITDAMarket
    } else {
      i_data[5].market = -1
    }

    if (param.NettDEBTEBITDACompany) {
      i_data[5].company =
        100 - (i_data[5].company + Math.abs(i_data[5].min)) * net_ratio_step
    }
    i_data[5].branch =
      100 - (i_data[5].branch + Math.abs(i_data[5].min)) * net_ratio_step
    i_data[5].market =
      100 - (i_data[5].market + Math.abs(i_data[5].min)) * net_ratio_step

    if (!param.NettDEBTEBITDACompany) {
      i_data[5].realCompany = 'N/A'
    } else {
      i_data[5].realCompany =
        param.NettDEBTEBITDACompany - Math.floor(param.NettDEBTEBITDACompany) ==
        param.NettDEBTEBITDACompany
          ? param.NettDEBTEBITDACompany.toFixed(0)
          : param.NettDEBTEBITDACompany.toFixed(1)
    }
  }

  preCorrection(data)

  return (
    <div className='column'>
      <div className='columns'>
        <div className='column' style={{ textAlign: 'center' }}>
          <div style={{ width: '100%' }} ref={svgContainerRef}>
            {svgSize.width && (
              <GaugeGraph
                key={0}
                kind={0}
                data={i_data[0]}
                width={svgSize.width}
                height={270}
              />
            )}
          </div>
        </div>
        <div className='column' style={{ textAlign: 'center' }}>
          <div style={{ width: '100%' }} ref={svgContainerRef}>
            {svgSize.width && (
              <GaugeGraph
                key={1}
                kind={1}
                data={i_data[1]}
                width={svgSize.width}
                height={270}
              />
            )}
          </div>
        </div>
        <div className='column' style={{ textAlign: 'center' }}>
          <div style={{ width: '100%' }} ref={svgContainerRef}>
            {svgSize.width && (
              <GaugeGraph
                key={1}
                kind={2}
                data={i_data[2]}
                width={svgSize.width}
                height={270}
              />
            )}
          </div>
        </div>
        <div className='column' style={{ textAlign: 'center' }}>
          <div style={{ width: '100%' }} ref={svgContainerRef}>
            {svgSize.width && (
              <GaugeGraph
                key={3}
                kind={3}
                data={i_data[3]}
                width={svgSize.width}
                height={270}
              />
            )}
          </div>
        </div>
      </div>
      <div className='columns'>
        <div className='column'>
          <div className='columns'>
            <div className='column' style={{ textAlign: 'center' }}>
              <div style={{ width: '100%' }} ref={svgContainerRef}>
                {svgSize.width && (
                  <GaugeGraph
                    key={4}
                    kind={4}
                    data={i_data[4]}
                    width={svgSize.width}
                    height={270}
                  />
                )}
              </div>
            </div>
            <div className='column' style={{ textAlign: 'center' }}>
              <div style={{ width: '100%' }} ref={svgContainerRef}>
                {svgSize.width && (
                  <GaugeGraph
                    key={5}
                    kind={5}
                    data={i_data[5]}
                    width={svgSize.width}
                    height={270}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className='column'
          style={{ width: '100%', textAlign: 'left', height: 230 }}
        >
          <FreeScrollBar>
            <div style={{ padding: 10 }}>
              <strong>PE ratio </strong>
              is a measure that gives an indication on how expensive a share is.
              It is calculated as the share price divided by the profits per
              share. A high PE ratio means that the share is expensive.
              <p />
              <strong>ROIC </strong>
              gives the Rate On Invested Capital. It shows how well the company
              is able to generate a return on all the invested assets, like
              buildings, machinery etc.
              <p />
              <strong>ROE </strong>
              gives the Rate On Equity. It shows how well the company is able to
              generate profits on the amount invested by shareholders. It’s
              therefore a measure on how efficient the company is in deploying
              capital.
              <p />
              <strong>Revenue Growth Per Share </strong>
              shows the annual revenue growth (or decline) divided by all
              outstanding shares. By taking into account the number of shares,
              effects of (possible) new shares that were issued or effects of
              acquisitions are reflected in this number.
              <p />
              <strong>Debt Ratio </strong>
              shows the ratio of shareholders Equity to Debt. The higher this
              ratio is, the more debt the company has relative to its equity.
              Therefore it becomes more risky.
              <p />
              <strong>Nett-Debt / EBITDA </strong>
              is another way to give an indication of the level of debt of a
              company. In this measure, a correction is made to the debt
              position by subtracting the amount of cash a company has on it’s
              balance sheet. The result is then compared to the EBITDA, which is
              a common indicator of the operating result of a company.
              <p />
            </div>
          </FreeScrollBar>
        </div>
      </div>
    </div>
  )
}

GaugeGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  kind: PropTypes.number.isRequired,
  data: PropTypes.shape({
    company: PropTypes.number.isRequired,
    branch: PropTypes.number.isRequired,
    market: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired
}
GaugeGraphContainer.propTypes = {
  data: PropTypes.shape({
    DebtRatioBranche: PropTypes.number,
    DebtRatioCompany: PropTypes.number,
    DebtRatioMarket: PropTypes.number,
    NettDEBTEBITDABranche: PropTypes.number,
    NettDEBTEBITDACompany: PropTypes.number,
    NettDEBTEBITDAMarket: PropTypes.number,
    PERatioBranche: PropTypes.number,
    PERatioCompany: PropTypes.number,
    PERatioMarket: PropTypes.number,
    ROEBranche: PropTypes.number,
    ROECompany: PropTypes.number,
    ROEMarket: PropTypes.number,
    ROICBranche: PropTypes.number,
    ROICCompany: PropTypes.number,
    ROICMarket: PropTypes.number,
    RevenueGrowthBranche: PropTypes.number,
    RevenueGrowthCompany: PropTypes.number,
    RevenueGrowthMarket: PropTypes.number
  })
}

export default GaugeGraphContainer
