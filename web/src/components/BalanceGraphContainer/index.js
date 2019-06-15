import React, {useState, useRef, useEffect} from 'react';
import useDimensions from '../Dimensions';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import SingleSlider from '../SingleSlider';


const BalanceGraph = ({data, width, height}) => {
  const leftRef = useRef(),
        rightRef = useRef();

  const w = width, h = height - 120;
  const colors_left = ['#63ae2d', '#a6ae2d', '#ef7d00', '#de0730'];
  const colors_right = ['#63ae2d', '#a6ae2d', '#ef7d00', '#de0730'];
  
  useEffect(() => {    
    const l_data = [data.TotalCash, data.CurrentAssetsNoCash, data.NonCurrentAssetsNoGoodwill, data.Goodwill]
    const r_data = [data.TotalEquity, 0, 0, data.TotalLiabilities]
    drawStockBar(l_data, d3.select(leftRef.current), colors_left);
    drawStockBar(r_data, d3.select(rightRef.current), colors_right);
  }, [data, width]) //eslint-disable-line
  const curHeight = (data, n, rate) => {
    let sh = 0, k;
    for (k = 0; k < n; k++) {
      sh += data[k] * rate;
    }
    return sh;
  }
  const drawStockBar = (dd, drawZone, colors) => {    
    drawZone.selectAll("*").remove();    
    let total = 0, step, p, i, t_height = 0, rect_w = w * 0.4, rate = h / 100;
    for(p = 0; p < dd.length; p++){
      total += dd[p];
    }
    step = 100 / total;
    for(p = 0; p < dd.length; p++){
      dd[p] = dd[p] * step;
      t_height += dd[p] * rate;
    }
    
    for(i = 0; i < dd.length; i++){
      drawZone
        .append('path')
        .attr('d', 'M' + (-rect_w/ 2) + ',0l' + rect_w + ',0l0,' + (-t_height + curHeight(dd, i, rate)) +
            'l' + (-rect_w) + ',0l0,' + (t_height - curHeight(dd, i, rate)) + 'z'
          )
        .style('fill', colors[i])
      drawZone
        .append('text')        
        .attr('y', () => {
          let sh = 0;
          for (let k = 0; k < i; k++) {
            sh += dd[k] * rate;
          }
          return -(t_height - sh - (dd[i] * rate) / 2);
        })
        .attr('dominant-baseline', 'middle')
        .style('fill', 'white')
        .style('opacity', dd[i] == 0 ? 0 : 1)
        .style('text-anchor', 'middle')
        .style('font-size', 16)
        .text(dd[i] > 10 ? dd[i].toFixed(0) + '%' : '');
    }    
  }
  
  return (
    <div>
      <svg width={w} height={h}>
        <g ref={leftRef} transform={`translate(${w/4}, ${h})`} />
        <g ref={rightRef} transform={`translate(${w * 3/4}, ${h})`} />
      </svg>
      <div className="columns" style={{padding: 0}}>
        <div className="column" style={{padding: 0, textAlign:'center', marginTop: '-6px'}}>
          <img src="/static/balance.png" />
        </div>
      </div>
      <div className="columns" style={{padding: 0}}>
        <div className="column" style={{width: '100%', textAlign:'center', padding: 0}}>
          <span style={{fontSize: '16pt', color: 'black', fontWeight: 'bold'}}>
            € {(data.TotalLiabilitiesStockholdersEquity / 100).toFixed(0)} mld
          </span>
        </div>
      </div>
    </div>
  );
}

const BalanceGraphContainer = ({data}) => {
  const [svgContainerRef, svgSize] = useDimensions();  

  const preCorrection = param => {
    return param.map(d => {
      d.CurrentAssetsNoCash = d.CurrentAssetsNoCash ? d.CurrentAssetsNoCash : 0;
      d.Goodwill = d.Goodwill ? d.Goodwill : 0;
      d.NonCurrentAssetsNoGoodwill = d.NonCurrentAssetsNoGoodwill ? d.NonCurrentAssetsNoGoodwill : 0;
      d.Date = d.Date ? d.Date : '';
      d.TotalCash = d.TotalCash ? d.TotalCash : 0;
      d.TotalEquity = d.TotalEquity ? d.TotalEquity : 0;
      d.TotalLiabilities = d.TotalLiabilities ? d.TotalLiabilities : 0;
      d.TotalLiabilitiesStockholdersEquity = d.TotalLiabilitiesStockholdersEquity
        ? d.TotalLiabilitiesStockholdersEquity
        : 0;
      return d;
    });
  }
  const c_data = data && data.length > 0 ? preCorrection(data).reverse() : []
  const years = c_data.map(d => d.Date.split("-")[0])
  const [curData, setCurData] = useState(c_data[c_data.length - 1]);

  const onChangeYear = year => {
    for(let i = 0; i < c_data.length; i++){
      if(c_data[i].Date.split('-')[0] == year){
        setCurData(c_data[i]);
        break;
      }
    }    
  }
  return (
    <div className="columns">
      <div className="column is-2">
        <div className="columns" style={{height: 90}}></div>
        <div className="columns">
          <ul>
            <li>
              <span style={{ color: '#63ae2d', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>Cash</span>
            </li>
            <li>
              <span style={{ color: '#a6ae2d', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>Current</span>
            </li>
            <li>
              <span style={{ color: '#ef7d00', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>NonCurrent</span>
            </li>
            <li>
              <span style={{ color: '#de0730', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>Goodwill</span>
            </li>
          </ul>
        </div>        
      </div>
      <div className="column is-8" style={{padding: 0}}>
        <div style={{width: '100%'}} ref={svgContainerRef}>
          {svgSize.width && (
            <div>
              <SingleSlider data={years} width={svgSize.width} height={70} onChangeHandler={onChangeYear}/>            
            <div className="columns" style={{padding: 0, textAlign: 'center', color: '#bdbbbc', fontSize: '12pt', fontWeight: 'bold'}}>
              <div className="column is-6" style={{padding: 0}}>
                <span>Total Assets</span>
              </div>
              <div className="column is-6" style={{padding: 0}}>
                <span>Total Liabilities</span>
              </div>
            </div>
              <BalanceGraph data={curData} width={svgSize.width} height={330} />
            </div>
          )}
        </div>
      </div>
      <div className="column is-2">
      <div className="columns" style={{height: 90}}></div>
        <div className="columns">
          <ul>
            <li>
              <span style={{ color: '#63ae2d', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>Equity</span>
            </li>
            <li>
              <span style={{ color: '#de0730', fontWeight: '600', fontSize: '15pt' }}>&nbsp;&nbsp;●&nbsp;</span>
              <span style={{fontSize: '10pt'}}>Debt</span>
            </li>            
          </ul>
        </div>
      </div>
    </div>
  );
}

BalanceGraph.propTypes = {
  data: PropTypes.shape({
      CurrentAssetsNoCash: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Goodwill: PropTypes.number.isRequired,
      NonCurrentAssetsNoGoodwill: PropTypes.number.isRequired,
      TotalCash: PropTypes.number.isRequired,
      TotalEquity: PropTypes.number.isRequired,
      TotalLiabilities: PropTypes.number.isRequired,
      TotalLiabilitiesStockholdersEquity: PropTypes.number.isRequired
    }).isRequired,  
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}
BalanceGraphContainer.propTypes = {  
  data: PropTypes.arrayOf(
    PropTypes.shape({
      CurrentAssetsNoCash: PropTypes.number,
      Date: PropTypes.string,      
      Goodwill: PropTypes.number,
      NonCurrentAssetsNoGoodwill: PropTypes.number,
      TotalCash: PropTypes.number,
      TotalEquity: PropTypes.number,
      TotalLiabilities: PropTypes.number,
      TotalLiabilitiesStockholdersEquity: PropTypes.number
    }).isRequired
  ).isRequired
}

export default BalanceGraphContainer;

