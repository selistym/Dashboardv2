import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

library.add(faAngleDown);

const actions = ['CHANGE_FILTER_MARKETSIZE', 'CHANGE_FILTER_COUNTRY', 'CHANGE_FILTER_AREA', 'CHANGE_FILTER_SECTOR'];

const DropdownItem = props => {
  const { parent_index, index, item, checked, onDropDownItemChange } = props;
  const onChangeHandler = () => onDropDownItemChange(actions[parent_index], item.code);

  return (
    <div className="dropdown-item" style={{width: 250}}>
      {useMemo(
        () => (
          <div style={{display: 'flex', width: '100%'}}>
          <div style={{marginLeft: 10}}>
            <span>{item.name}</span>
          </div>
          <div style={{textAlign:'right', width: '100%'}}>
            <input
              className={checked ? "is-checkradio is-rtl has-background-color is-danger" : "is-checkradio is-rtl has-background-color"}
              id={'checkbox' + parent_index + index}
              type="checkbox"
              onChange={() => onChangeHandler()}
              checked={checked}
            />
            <label htmlFor={'checkbox' + parent_index + index} style={{marginRight: 20}}/>
          </div>
          </div>
        ),
        [checked, onChangeHandler] //eslint-disable-line
      )}
    </div>
  );
};

const CustomDropdown = props => {
  const { title, items, index, initial, onDropDownChange } = props;

  const onSelectAll = () => {

    onDropDownChange(actions[index], items.map(d => d.code))
  };
  const onDeselectAll = () => {
    onDropDownChange(actions[index], [])
  };

  return (
    <div className="dropdown is-hoverable">
      <div className="dropdown-trigger" style={{width: 250}}>
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" style={{width: 250, justifyContent: 'space-between'}}>
          <span>{title}</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={faAngleDown} size={"1x"}/>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{width: 250}}>
        <div className="dropdown-content" style={{height: 250, overflowY: 'scroll', overflowX: 'hidden'}}>          
            <div className="dropdown-item" style={{width: 250}}>
              <button className="button is-small" onClick={() => onSelectAll()} >Select all</button>
              <button className="button is-small" onClick={() => onDeselectAll()} style={{marginLeft: 60}}>Deselect all</button>  
            </div>
            {items.map((item, i) => (
                <DropdownItem
                  key={i}
                  item={item}
                  parent_index={index}
                  index={i}
                  checked={initial.indexOf(item.code) != -1 ? true : false}
                  onDropDownItemChange={onDropDownChange}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

DropdownItem.propTypes = {
  parent_index: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  checked: PropTypes.bool,
  onDropDownItemChange: PropTypes.func.isRequired
};

CustomDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  index: PropTypes.number.isRequired,
  initial: PropTypes.array.isRequired,
  hasSlider: PropTypes.bool,
  onDropDownChange: PropTypes.func.isRequired
};
export default CustomDropdown;
