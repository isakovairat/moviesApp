import React from 'react';
import { Alert } from 'antd';

const ErrorIndicator = () => {
  return (
    <>
      <Alert
        message="Error"
        description="Boom! It's a crash. Please reload the page :)"
        type="error"
        className="alert"
        showIcon
      />
      <div className="crash" />
    </>
  );
};

export default ErrorIndicator;
