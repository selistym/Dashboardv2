import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import RangeSlider from './RangeSlider';

const actions = ['CHANGE_FILTER_MARKETSIZE', 'CHANGE_FILTER_COUNTRY', 'CHANGE_FILTER_AREA', 'CHANGE_FILTER_SECTOR'];

const DropdownItem = props => {
  const { parent_index, index, item, checked, onDropDownItemChange } = props;
  const onChangeHandler = () => onDropDownItemChange(actions[parent_index], item.code);

  return (
    <div className="dropdown-item columns" style={{ width: '250px', padding: '0.2rem', margin: '0px' }}>
      {useMemo(
        () => (
          <>
            <div className="column is-7" style={{alignItems:'center'}}>
              <p>{item.name}</p>
            </div>
            <div className="column is-right">
              <div className="field" style={{ paddingTop: '0.1em', paddingLeft: '1.5em' }}>
                {checked ? (
                  <input
                    className="is-checkradio is-rtl has-background-color is-danger"
                    id={'checkbox' + parent_index + index}
                    type="checkbox"
                    onChange={() => onChangeHandler()}
                    checked={true}                    
                  />
                ) : (
                  <input
                    className="is-checkradio is-rtl has-background-color"
                    id={'checkbox' + parent_index + index}
                    type="checkbox"
                    onChange={() => onChangeHandler()}
                    checked={false}                    
                  />
                )}
                <label htmlFor={'checkbox' + parent_index + index}/>
              </div>
            </div>
          </>
        ),
        [checked, onChangeHandler] //eslint-disable-line
      )}
    </div>
  );
};

const CustomDropdown = props => {
  const { title, items, index, initial, hasSlider, onDropDownChange } = props;

  const onViewAll = () => {
    let t_items = items.map(d => d.code);
    if (JSON.stringify(initial.sort()) == JSON.stringify(t_items.sort())) {
      //deselect all
      onDropDownChange(actions[index], []);
    } else {
      onDropDownChange(actions[index], t_items);
    }
  };

  return (
    <div className="dropdown" style={{width: '100%'}}>
      <div className="navbar-item has-dropdown is-hoverable" style={{margin: '1px', width: '250px'}}>
        <a
          className="box navbar-link has-text-centered has-text-weight-bold has-text-grey"
          style={{ width: '250px', marginBottom: '0.3rem' }}
        >
          {title}
        </a>
        <div className="navbar-dropdown is-boxed" id="dropdown-menu" role="menu" style={{ padding: '0px' }}>
          <div
            className="dropdown-content"
            style={{ width: '250px', height: '250px', overflowY: 'scroll', overflowX: 'hidden', paddingTop:'20px' }}
          >
            <button className="button is-small pull-right has-margin-right-xs" onClick={() => onViewAll()}>
              {JSON.stringify(initial.sort()) == JSON.stringify(items.map(d => d.code).sort())
                ? 'Deselect all'
                : 'Select all'}
            </button>
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
