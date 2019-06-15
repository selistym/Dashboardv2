import React,  {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import useDimensions from '../Dimensions';
import * as d3 from 'd3';

const GaugeGraph = ({data, width, height, kind}) => {  
  const graphRef = useRef();
  const w = Math.min(width, height), h = Math.min(width, height);

  if(kind == 0 || kind > 3){
    data.company = data.company > data.max ? data.max : data.company;
    data.company = data.company < data.min ? data.min : data.company;
  }
  data.branch = data.branch > data.max ? data.max : data.branch;
  data.branch = data.branch < data.min ? data.min : data.branch;
  data.market = data.market > data.max ? data.max : data.market;
  data.market = data.market < data.min ? data.min : data.market;

  if (kind > 0 && kind < 4) {
    data.company = data.company * 100;
  }
  useEffect(() => {
    
    const drawGraph = () => {
      let radius = w * 0.3,
          needleRad = radius - (radius * 2) / 5,
          needleCenterRad = radius * 0.15,
          pi = Math.PI,
          halfPi = pi / 2,
          endAngle = pi / 2,
          startAngle = -endAngle,
          n, rmin, rmax, diff;

      switch (Number(kind)) {
        case 1:
        case 2:
          n = 25;
          rmin = 0;
          rmax = 25;
          diff = 2;
          break;
        case 3:
          n = 200;
          rmin = -100;
          rmax = 100;
          diff = 15;
          break;
        case 0:
        case 4:
        case 5:
          n = 100;
          rmin = 0;
          rmax = 100;
          diff = 8;
          break;
        default:
          n = 100;
          rmin = 0;
          rmax = 100;            
          break;
      }
      let scale = d3
        .scaleLinear()
        .domain([rmin, rmax])
        .range([startAngle, endAngle]);
      
      let field = d3.range(startAngle, endAngle, pi / n);
      let range = Math.abs(data.max - data.min),
          step = n / range,
          preStep1 = data.company > rmax ? rmax : data.company,
          preStep = preStep1 < rmin ? rmin : preStep1,
          step1 = (range / n) * preStep,
          linearColor = d3
            .scaleLinear()
            .range(['#e2062a', '#ee7e00', '#66ad2b'])
            .domain([0, range / 2, range]);
      
      if (data.direction == 1) {
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
        if (data.company > 0) {
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

      d3.select(graphRef.current)
        .selectAll('*')
        .remove();
      
      let arc = d3
        .arc()
        .innerRadius(radius - radius / 5)
        .outerRadius(radius)
        .startAngle((d, i) => scale(i + rmin))
        .endAngle((d, i) => scale(i + rmin + 1));

      if (kind == 0 || kind > 3)
        d3.select(graphRef.current)
          .append('g')
          .selectAll('path')
          .data(field)
          .enter()
          .append('path')
          .attr('stroke', (d, i) =>
            i + 1 <= (Math.abs(data.min) + data.company) * step
              ? linearColor(Math.abs(data.min) + data.company)
              : '#e4e7ec'
          )
          .attr('fill', (d, i) =>
            i + 1 <= (Math.abs(data.min) + data.company) * step
              ? linearColor(Math.abs(data.min) + data.company)
              : '#e4e7ec'
          )
          .attr('d', arc);
      else
        d3.select(graphRef.current)
          .append('g')
          .selectAll('path')
          .data(field)
          .enter()
          .append('path')
          .attr('stroke', (d, i) => (i + 1 + rmin <= data.company ? linearColor(step1) : '#e4e7ec'))
          .attr('fill', (d, i) => (i + 1 + rmin <= data.company ? linearColor(step1) : '#e4e7ec'))
          .attr('d', arc);
      //draw needle

      let needle = d3
        .select(graphRef.current)
        .append('path')
        .attr('class', 'needle')
        .attr(
          'fill',
          kind == 0 || kind == 4 || kind == 5
            ? linearColor(Math.abs(data.min) + data.company)
            : linearColor(step1)
        );
      
      let ticks = scale.ticks(n);
      
      // add marker
      d3.select(graphRef.current)
        .append('g')
        .attr('class', 'marker')
        .selectAll('path.marker')
        .data(ticks)
        .enter()
        .append('path')
        .style('stroke', '#929292')
        .style('stroke-width', function(d) {
          if (d === Math.floor((Math.abs(data.min) + data.branch) * step)) {              
            return 3;
          }
          if (d === Math.floor((Math.abs(data.min) + data.market) * step)) {              
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
      d3.select(graphRef.current)
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
        .style('font-size', '8pt')
        .style('font-weight', '600')
        .attr('fill', 'black')
        .text(d => { 
            if (d === Math.floor((Math.abs(data.min) + data.branch) * step)) {
              return 'Branche';
            }              
          return '';
        });
      d3.select(graphRef.current)
        .append('g')
        .attr('class', 'label')
        .selectAll('text.label.market')
        .data(ticks)
        .enter()
        .append('text')
        .attr('transform', function(d) {
          let _in = scale(d) - halfPi;
          let topX = (radius + 5) * Math.cos(_in),
            topY = (radius + 5) * Math.sin(_in);
          return 'translate(' + topX + ',' + topY + ')';
        })
        .attr('dy', () => {
          let branch = Math.floor((Math.abs(data.min) + data.branch) * step),
              market = Math.floor((Math.abs(data.min) + data.market) * step);
          if(Math.abs(branch - market) <= diff){
            if(branch < market ){
              if(branch < (rmax + rmin) / 2 && market < (rmax + rmin) / 2){
                return -10;
              }else{
                return 10;
              }
            }else{
              if(branch < (rmax + rmin) / 2 && market < (rmax + rmin) / 2){
                return 10;
              }else{
                return -10;
              }
            }
          }else return 0;
          
        })
        .style('text-anchor', d => d < (rmax + rmin) / 2 ? 'end' : 'start')
        .style('font-size', '8pt')
        .style('font-weight', '600')
        .attr('fill', 'black')
        .text(d => {
            if(kind == 0 || kind == 1 || kind == 2 || kind == 5){
              if (d === Math.floor((Math.abs(data.min) + data.market) * step)) {
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

            return ('M' +topX +',' +topY +'L' +leftX +',' +leftY +'A' +leftX +',' +leftX +',1,0,0,' +rightX +',' +rightY + 'z');
          };
        };
      }
      updateNeedle(scale(0), scale(kind == 0 || kind == 4 || kind == 5 ? (Math.abs(data.min) + data.company) * step : preStep) + 0.01
      );
      updatePercent(0, data.company);
    }
    drawGraph();
  }, [data, width]); //eslint-disable-line
  
  return (
    <div>
      <svg width={w} height={h * 0.5}>
        <g transform={`translate(${w / 2}, ${h * 0.4})`} ref={graphRef} />
      </svg>
      <div className="columns" style={{padding: 0, fontSize: '22pt', fontWeight:'bold', color: 'grey', textAlign:'center'}}>
        <div className="column" style={{padding: 0}}>
          <span>{data.company == Math.floor(data.company) ? data.company.toFixed(0) : data.company.toFixed(1)}</span>
          <span>{kind == 1 || kind == 2 || kind == 3 ? '%' : ''}</span>
        </div>
      </div>
      <div className="columns" style={{padding: 0, fontSize: '12pt', color: '#bdbbbc', textAlign:'center'}}>
        <div className="column" style={{padding: 0}}>
          <span>{data.title}</span>
        </div>
      </div>
    </div>
  );
}
const GaugeGraphContainer = ({data}) => {
  const [svgContainerRef, svgSize] = useDimensions();
  const preCorrection = param => {
    param.DebtRatioBranche = param.DebtRatioBranche ? param.DebtRatioBranche : 0;
    param.DebtRatioCompany = param.DebtRatioCompany ? param.DebtRatioCompany : 0;
    param.DebtRatioMarket = param.DebtRatioMarket ? param.DebtRatioMarket : 0;
    param.NettDEBTEBITDABranche = param.NettDEBTEBITDABranche ? param.NettDEBTEBITDABranche : 0;
    param.NettDEBTEBITDACompany = param.NettDEBTEBITDACompany ? param.NettDEBTEBITDACompany : 0;
    param.NettDEBTEBITDAMarket = param.NettDEBTEBITDAMarket ? param.NettDEBTEBITDAMarket : 0;
    param.PERatioBranche = param.PERatioBranche ? param.PERatioBranche : 0;
    param.PERatioCompany = param.PERatioCompany ? param.PERatioCompany : 0;
    param.PERatioMarket = param.PERatioMarket ? param.PERatioMarket : 0;
    param.ROEBranche = param.ROEBranche ? param.ROEBranche : 0;
    param.ROECompany = param.ROECompany ? param.ROECompany : 0;
    param.ROEMarket = param.ROEMarket ? param.ROEMarket : 0;
    param.ROICBranche = param.ROICBranche ? param.ROICBranche : 0;
    param.ROICCompany = param.ROICCompany ? param.ROICCompany : 0;
    param.ROICMarket = param.ROICMarket ? param.ROICMarket : 0;
    param.RevenueGrowthBranche = param.RevenueGrowthBranche ? param.RevenueGrowthBranche : 0;
    param.RevenueGrowthCompany = param.RevenueGrowthCompany ? param.RevenueGrowthCompany : 0;
    param.RevenueGrowthMarket = param.RevenueGrowthMarket ? param.RevenueGrowthMarket : 0;        
    return param;    
  }
  const c_data = preCorrection(data);
  const i_data = [
    {company: c_data.PERatioCompany, branch: c_data.PERatioBranche, market: c_data.PERatioMarket, title: 'PE-ratio', min: 0, max: 40, dir: 0},
    {company: c_data.ROICCompany, branch: c_data.ROICBranche, market: c_data.ROICMarket, title: 'ROIC', min: 0, max: 0.2, dir: 1},
    {company: c_data.ROECompany, branch: c_data.ROEBranche, market: c_data.ROEMarket, title: 'Return on equity', min: 0, max: 0.2, dir: 1 },
    {company: c_data.RevenueGrowthCompany, branch: c_data.RevenueGrowthBranche, market: c_data.RevenueGrowthMarket, title: 'Revenue Growth per Share', min: -30, max: 60, dir: 1},
    {company: c_data.DebtRatioCompany, branch: c_data.DebtRatioBranche, market: c_data.DebtRatioMarket, title: 'Debt-ratio', min: 0, max: 4, dir: 0},
    {company: c_data.NettDEBTEBITDACompany, branch: c_data.NettDEBTEBITDABranche, market: c_data.NettDEBTEBITDAMarket, title: 'Nett-Debt / EBITDA', min: -3, max: 3, dir: 0}
  ];

  return (
    <div className="column">
      <div className="columns">
        <div className="column" style={{textAlign:'center'}}>
          <div style={{width: '100%'}} ref={svgContainerRef}>
          {svgSize.width && <GaugeGraph key={0} kind={0} data={i_data[0]} width={svgSize.width} height={270} />}
          </div>
        </div>
        <div className="column" style={{textAlign:'center'}}>
          <div style={{width: '100%'}}>
            {svgSize.width && <GaugeGraph key={1} kind={1} data={i_data[1]} width={svgSize.width} height={270} />}
          </div>
        </div>
        <div className="column" style={{textAlign:'center'}}>
          <div style={{width: '100%'}}>
            {svgSize.width && <GaugeGraph key={2} kind={2} data={i_data[2]} width={svgSize.width} height={270} />}
          </div>
        </div>
        <div className="column" style={{textAlign:'center'}}>
          <div style={{width: '100%'}}>
            {svgSize.width && <GaugeGraph key={3} kind={3} data={i_data[3]} width={svgSize.width} height={270} />}
          </div>
        </div>
      </div>              
      <div className="columns">              
        <div className="column">
          <div className="columns">
            <div className="column" style={{textAlign:'center'}}>
              <div style={{width: '100%'}}>
                {svgSize.width && <GaugeGraph key={4} kind={4} data={i_data[4]} width={svgSize.width} height={270} />}
              </div>
            </div>
            <div className="column" style={{textAlign:'center'}}>
              <div style={{width: '100%'}}>
                {svgSize.width && <GaugeGraph key={5} kind={5} data={i_data[5]} width={svgSize.width} height={270} />}
              </div>
            </div>
          </div>
        </div>
        <div className="column" style={{height: '300px', overflowY: 'scroll' }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aperiam, consequuntur dolor dolorum
            eveniet ipsum molestiae nobis nostrum nulla numquam optio pariatur quae quisquam reiciendis tempore
            velit voluptas. Aliquid, ullam.
          </p>
          <br/>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam animi architecto aspernatur at
            dolores, mollitia necessitatibus numquam officiis perspiciatis quasi repellat sequi, tempore tenetur?
            At consectetur deserunt dolorum error ipsam!
          </p>
        </div>
      </div>
    </div>
  );
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
      max: PropTypes.number.isRequired,
      dir: PropTypes.number.isRequired,
  }).isRequired
};
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
};

export default GaugeGraphContainer;
