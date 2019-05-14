import React, {useEffect, useState, useMemo } from 'react';
import RangeSlider from './RangeSlider';

const actions = [
  "CHANGE_FILTER_LARGECAP",
  "CHANGE_FILTER_VALUE",
  "CHANGE_FILTER_AREA",
  "CHANGE_FILTER_SECTOR"
];

const DropdownItem = props => {
  
  const {parent_index, index, item, checked, onDropDownItemChange} = props;    
  const onChangeHandler = () => onDropDownItemChange(actions[parent_index], item.code);

  return (    
    <div className="dropdown-item columns" style={{ width: '190px', padding: '0.2rem', margin: '0px' }}>
      {useMemo(() =>
        <>{console.log('item' + parent_index + index, checked)}
          <div className="column is-7">
            <p>{item.name}</p>
          </div>
          <div className="column is-right">
            <div className="field" style={{ paddingTop: '0.5em' }}>          
              {checked ? (
                <input className='is-checkradio is-rtl has-background-color is-danger' id={'checkbox' + parent_index + index} type="checkbox"
                  onChange={() => onChangeHandler()}
                  checked={true}/>
              ) : (
                <input className='is-checkradio is-rtl has-background-color' id={'checkbox' + parent_index + index} type="checkbox"
                  onChange={() => onChangeHandler()}
                  checked={false}/>
              )}
              <label for={'checkbox' + parent_index + index} />
            </div>
          </div>
        </>, [checked])}
    </div>
  );
};

const CustomDropdown = props => {
  const { title, items, index, initial, hasSlider, onDropDownChange} = props;
  
  const onViewAll = () => onDropDownChange(actions[index], items.map(d => d.code));

  return (    
    <div className="dropdown">
      <div className="navbar-item has-dropdown is-hoverable" style={{ width: '190px', margin: '1px' }}>
        <a className="box navbar-link has-text-centered has-text-weight-bold has-text-grey" style={{ width: '190px', marginBottom:'0.3rem' }}>
          {title}
        </a>
        <div className="navbar-dropdown is-boxed" id="dropdown-menu" role="menu" style={{ padding: '0px' }}>
          <div className="dropdown-content" style={{ width: '190px', height: '280px', overflowY: 'scroll', overflowX: 'hidden' }}>
            <button className="button" onClick={() => onViewAll()}>{title}</button>            
            {items.map((item, i) =>
                <DropdownItem key={i} item={item} parent_index={index} index={i} 
                  checked={initial.indexOf(item.code) != -1 ? true : false} 
                  onDropDownItemChange={onDropDownChange}/>)}
            {hasSlider && (
              <div className="dropdown-item" style={{ padding: '0', paddingTop: '1.2em' }}>
                <RangeSlider width={170} height={40} index={index} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
