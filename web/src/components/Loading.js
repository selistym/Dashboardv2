import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner);

const Loading = ({ style }) => (
  <div style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <FontAwesomeIcon icon="spinner" size="2x" spin data-testid="spinner" />
  </div>
);

Loading.propTypes = {
  style: PropTypes.object
};

export default Loading;