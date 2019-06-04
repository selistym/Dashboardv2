import React, { Fragment } from 'react';
import useDimensions from '../Dimensions';
import PropTypes from 'prop-types';
import AreaChart from './AreaChart';

const AreaGraph = props => {
  const {data, companyName} = props;
  const [svgContainerRef, svgSize] = useDimensions();
  const getColumn = origin => {
    let column = [];
    for (var key in origin[0]) {
      column.push(key);
    }
    return column;
  }
  const isEmpty = origin => !origin || origin.length == 0 ? true : false;

  const preCorrection = origin =>  origin.map(d => {
    d.Date = d.Date ? d.Date : '';
    d.Volume = d.Volume ? d.Volume : 0;
    d.Close = d.Close ? d.Close : 0;
    return d;
  });
  
  return (
    <Fragment>
      {isEmpty(data)? <> No data </> :
          <>
            <div className="columns" style={{width:'100%', marginTop: '10px', justifyContent: 'space-around'}}>
              <div className="columns is-2">
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt', backgroundColor:'#de0730', color:'white'}}>1 M</span>
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt',  backgroundColor:'#de0730', color:'white'}}>6 M</span>
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt',  backgroundColor:'#de0730', color:'white'}}>1 Y</span>
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt',  backgroundColor:'#de0730', color:'white'}}>3 Y</span>
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt',  backgroundColor:'#de0730', color:'white'}}>5 Y</span>
                <span className="button" style={{width: '40px', marginRight: '5px', fontSize:'10pt',  backgroundColor:'#de0730', color:'white'}}>All</span>
              </div>
              <div className="columns is-2">
                <span style={{ color: '#de0730', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
                <span style={{marginRight:'15px'}}>{companyName}</span>
                <span style={{ color: 'grey', fontWeight: '600', fontSize: '15pt' }}>●&nbsp;</span>
                <span>Industry</span>
              </div>
            </div>
            <div className="columns" style={{width:'100%', justifyContent: 'center'}} ref={svgContainerRef}>
              {svgSize.width && 
                <AreaChart
                  companyName={companyName}
                  data={preCorrection(data)}
                  column={getColumn(data)}
                  width={svgSize.width}
                  height={400}
                />
              }
            </div>
          </>
        
      }
    </Fragment>
  );
}

AreaGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Close: PropTypes.number.isRequired,
      Date: PropTypes.string.isRequired,
      Volume: PropTypes.number.isRequired,
      __typename: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  companyName: PropTypes.string.isRequired
};

export default AreaGraph;
