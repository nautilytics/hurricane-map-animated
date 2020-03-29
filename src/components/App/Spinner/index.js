import React from 'react';
import { CircularProgress } from '@material-ui/core';
import './index.scss';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <CircularProgress />
    </div>
  );
};

export default Spinner;
