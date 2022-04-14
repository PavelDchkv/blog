import React from 'react';
import { Spin } from 'antd';

import classes from './spinner.module.css';

const Spinner = () => {
  return (
    <div className={classes.spinner}>
      <Spin className="spinner" />;
    </div>
  );
};

export default Spinner;
