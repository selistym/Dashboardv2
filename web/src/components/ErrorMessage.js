import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => <pre>{JSON.stringify(message, null, 2)}</pre>;

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
