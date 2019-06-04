import React, { useContext, useEffect, useRef } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { AppContext } from '../AppContext';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import '../../styles/main.sass';

library.add(faSpinner);
library.add(faSearch);

const SecuritySearchSearchBarSection = () => {
  const { store, dispatch } = useContext(AppContext);
  const inputEl = useRef(store.securityFilterText);

  useEffect(() => inputEl.current && inputEl.current.focus && inputEl.current.focus());

  const asyncDispatchFunction = () => {
    dispatch({ type: 'CHANGE_FILTER_TEXT', text: inputEl.current.value });
  };
  const asyncDispatchDebounced = AwesomeDebouncePromise(asyncDispatchFunction, 500);

  return (
    <div className="columns is-mobile" style={{ justifyContent: 'center' }}>
      <div
        className="column is-three-quarters-mobile is-two-thirds-tablet is-two-thirds-desktop is-two-thirds-widescreen is-two-thirds-fullhd"
        style={{ display: 'flex', justifyContent: 'center' }}
        data-testid="test-input"
      >
        <p className="control has-icons-left" style={{ width: 'inherit', paddingRight: 'inherit' }}>
          <input
            className="inputText"
            type="text"
            onChange={() => asyncDispatchDebounced()}
            ref={inputEl}
            placeholder="Search a specific security... "
          />
        </p>
        <button className="button" style={{ backgroundColor: '#b9b9b9', color: 'white', fontStyle: 'italic' }}>
          Use VEB-filter
        </button>
      </div>
    </div>
  );
};

export default SecuritySearchSearchBarSection;
