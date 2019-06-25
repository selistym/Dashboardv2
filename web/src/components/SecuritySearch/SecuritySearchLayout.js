import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner);
library.add(faSearch);

import SecuritySearchSearchBarSection from './SecuritySearchSearchBarSection';
import SecuritySearchDropdownSection from './SecuritySearchDropdownSection';
import SuggestionsContainer from './SuggestionsContainer';

const SecuritySearchLayout = () => {
  return (
    <div>
      <SecuritySearchSearchBarSection />
      <SecuritySearchDropdownSection />
      <div className="columns is-mobile">
        <div className="column">
          <h3 className="subtitle is-6 has-text-centered" style={{ height: '20px', color: '#a9a9a9', paddingTop:'20px' }}>
            All stocks show an average rating score based on Dividend, Balance, Growth and Value.
          </h3>
        </div>
      </div>
      <SuggestionsContainer />
    </div>
  );
};

export default SecuritySearchLayout;
