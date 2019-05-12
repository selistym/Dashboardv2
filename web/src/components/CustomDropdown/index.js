import React, {useEffect, useState, useContext, memo, useCallback} from 'react';
import RangeSlider from './RangeSlider';
import {AppContext} from '../AppContext';

const DropdownItem = props => {
  
  const {parent_index, index, item } = props;
  const {store, dispatch} = useContext(AppContext);
  const [checked, setChecked] = useState(false);

  const onChangeHandler = () => {
    let filters = store.securityFilter;    
    let replaces = filters[parent_index];    
    if(replaces.indexOf(item.code) != -1){
      replaces = replaces.filter(s => s != item.code);
    }else{
      replaces.push(item.code);
    }
    replaces.sort();
    filters.forEach((e, i) => i == parent_index ? filters[i] = replaces : filters[i] = filters[i]);    
    dispatch({type:'CHANGE_FILTER', filters: filters});
  }

  useEffect(() => {    
    let filters = store.securityFilter[parent_index];
    if(filters.indexOf(item.code) != -1){
      setChecked(true);
    }else{
      setChecked(false);
    }
  });

  return (
    <div className="dropdown-item columns" style={{ width: '190px', padding: '0.2rem', margin: '0px' }}>
      <div className="column is-7">
        <p>{item.name}</p>
      </div>
      <div className="column is-right">
        <div className="field" style={{ paddingTop: '0.5em' }}>
          {checked ? (
            <input className='is-checkradio is-rtl has-background-color is-danger' id={'checkbox' + parent_index + index} type="checkbox"
              onChange={onChangeHandler}
              checked={true}/>
          ) : (
            <input className='is-checkradio is-rtl has-background-color' id={'checkbox' + parent_index + index} type="checkbox"
              onChange={onChangeHandler}
              checked={false}/>
          )}
          <label for={'checkbox' + parent_index + index} />
        </div>
      </div>
    </div>
  );
};

const CustomDropdown = props => {
  const { title, items, index, hasSlider} = props;  
  const {store, dispatch} = useContext(AppContext);

  const onViewAll = () => {    
    let filters = store.securityFilter;
    filters[index] = [];
    for(let i = 0; i < items.length; i++){
      filters[index].push(items[i].code);
    }    
    filters[index].sort();    
    dispatch({type:'CHANGE_FILTER', filters: filters});
  };

  return (
    <div className="dropdown">
      <div className="navbar-item has-dropdown is-hoverable" style={{ width: '190px', margin: '1px' }}>
        <a className="box navbar-link has-text-centered has-text-weight-bold has-text-grey" style={{ width: '190px', marginBottom:'0.3rem' }}>
          {title}
        </a>
        <div className="navbar-dropdown is-boxed" id="dropdown-menu" role="menu" style={{ padding: '0px' }}>
          <div className="dropdown-content" style={{ width: '190px', height: '280px', overflowY: 'scroll', overflowX: 'hidden' }}>
            <button className="button" onClick={onViewAll}>{title}</button>
            {items.map((item, i) => (<DropdownItem key={i} item={item} parent_index={index} index={i}/>))}
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
