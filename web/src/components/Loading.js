import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faSpinner);

const Loading = ({ marginTop }) => (
  <div
    className="columns is-mobile"
    style={{ justifyContent: 'center', marginTop: `${marginTop ? marginTop : '0px'}` }}
  >
    <FontAwesomeIcon icon="spinner" spin data-testid="spinner" />
  </div>
);

Loading.propTypes = {
  marginTop: PropTypes.string
};

export default Loading;