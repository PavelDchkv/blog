import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../header';

import classes from './layout.module.scss';

export const Layout = () => {
  return (
    <>
      <Header />
      <main className={classes.main}>
        <Outlet />
      </main>
    </>
  );
};
