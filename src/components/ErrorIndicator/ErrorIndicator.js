import React from 'react';
import { Alert } from 'antd';

import './ErrorIndicator.css';

const ErrorIndicator = () => {
  return (
    <Alert
      message="Error"
      description="Boom! It's a crash. Please reload the page :)"
      type="error"
      className="errorIndicator"
      showIcon
    />
  );
};

export default ErrorIndicator;
