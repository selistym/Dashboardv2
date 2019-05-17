import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner);

export default () => {
  return (
    <div className="columns is-mobile" style={{ justifyContent: 'center' }}>
      <FontAwesomeIcon icon="spinner" spin data-testid="spinner" />
    </div>
  );
};
