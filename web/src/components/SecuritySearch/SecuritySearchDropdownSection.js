import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import CustomDropdown from '../CustomDropdown';
import SingleSlider from '../SingleSlider';

const SecuritySearchDropdownSection = () => {
  let { store, dispatch } = useContext(AppContext);

  //for security filter checkboxs
  const securityFilterCheckboxes = [
    [
      { code: 'LARGE', name: 'Large Caps' },
      { code: 'MEDIUM', name: 'Medium Caps' },
      { code: 'SMALL', name: 'Small Caps' }
    ],
    [{ code: 'B0', name: 'B0' }, { code: 'B1', name: 'B1' }, { code: 'B2', name: 'B2' }, { code: 'B3', name: 'B3' }],
    [
      { code: 'Dividend', name: 'Dividend' },
      { code: 'Balance', name: 'Balance' },
      { code: 'Growth', name: 'Growth' },
      { code: 'Value', name: 'Value' }
    ],
    store.allSectors
  ];

  const titles = ['Market Size', 'Values', 'Areas', 'Sectors'];
  const years = [2013, 2014, 2015, 2016, 2017, 2018];

  const handleFilterYearChange = async year => {
    await dispatch({ type: 'CHANGE_FILTER_YEAR', year: year });
  };
  const handleDropDownItemChange = (filterAction, checkedItem) => {
    dispatch({ type: filterAction, filter: checkedItem });
  };

  return (
    <div className="columns is-mobile" style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }}>
      <div className="column" style={{ paddingTop: '25px' }}>
        <CustomDropdown
          key={0}
          title={titles[0]}
          items={securityFilterCheckboxes[0]}
          index={0}
          hasSlider={false}
          initial={store.securityFilterMarketSize}
          onDropDownChange={(e, b) => handleDropDownItemChange(e, b)}
        />
      </div>
      <div className="column" style={{ paddingTop: '25px' }}>
        <CustomDropdown
          key={1}
          title={titles[1]}
          items={securityFilterCheckboxes[1]}
          index={1}
          hasSlider={false}
          initial={store.securityFilterValue}
          onDropDownChange={(e, b) => handleDropDownItemChange(e, b)}
        />
      </div>
      <div className="column" style={{ paddingTop: '25px' }}>
        <CustomDropdown
          key={2}
          title={titles[2]}
          items={securityFilterCheckboxes[2]}
          index={2}
          hasSlider={true}
          initial={store.securityFilterArea}
          onDropDownChange={(e, b) => handleDropDownItemChange(e, b)}
        />
      </div>
      <div className="column" style={{ paddingTop: '25px' }}>
        <CustomDropdown
          key={3}
          title={titles[3]}
          items={securityFilterCheckboxes[3]}
          index={3}
          hasSlider={false}
          initial={store.securityFilterSector}
          onDropDownChange={handleDropDownItemChange}
        />
      </div>
      <div className="column">
        <SingleSlider
          onChangeYear={handleFilterYearChange}
          initYear={store.securityFilterYear}
          width={270}
          height={70}
          years={years}
        />
      </div>
    </div>
  );
};

export default SecuritySearchDropdownSection;
