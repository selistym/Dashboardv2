import React from 'react';
import RoundGraph from '../RoundGraph';

const LeftNavbar = ({security}) => {
    return (
        <div
            className="column is-full-mobile is-full-tablet is-one-fifth-desktop is-2-widescreen is-2-fullhd"
            style={{ backgroundColor: '#888' }}
        >
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <img src="../../static/logo.png" />
            </div>
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <img style={{ borderRadius: '50%', width: '110px', height: '100px' }} src="../../static/man.png" />
            </div>
            <div className="has-text-white" style={{ textAlign: 'center' }}>
                John Doe
            </div>
            <div
                style={{
                    height: '200px',
                    margin: '10px',
                    borderWidth: '1px',
                    borderTopStyle: 'inset',
                    borderBottomStyle: 'outset',
                    color: 'gainsboro'
                }}
            >
                <div  style={{ padding: '3px', paddingTop:'10px' }}>My Porfolio</div>
                <div  style={{ padding: '3px' }}>Stocks</div>
                <div  style={{ padding: '3px' }}>Scenarios</div>
            </div>
            <div style={{ textAlign: 'center', color: 'gainsboro'}}>My Current Portfolio Performance</div>
            <div className={'RoundGraph' + security.id} style={{ width: '180px', height: '180px', display:'content', paddingTop:'20px' }}>
                {security.calculatedCircular[0] != null ? (
                    <RoundGraph
                        key={security.id}
                        index={security.id}
                        params={security.calculatedCircular[security.calculatedCircular.length - 1]}
                    />
                ) : (
                    <p>No data</p>
                )}
            </div>
        </div>
    );
}

export default LeftNavbar;