import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setCurrentUser } from '../../store/actions/articlesAction';
import avatar from '../../img/logo.svg';

import classes from './header.module.scss';

const Header = () => {
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem('user');
  };

  const authDiv = (
    <div className={classes.authorization}>
      {user ? (
        <>
          <Link to="/new-article" className={classes.createBtn}>
            Create article
          </Link>
          <Link to="/profile" className={classes.profileLink}>
            <span className={classes.name}>{user.username}</span>
            <img className={classes.logo} src={user.image ? user.image : avatar} alt="avatar" />
          </Link>

          <button type="button" className={classes.logoutBtn} onClick={onLogout}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link to="/sign-in" className={classes.signIn}>
            Sign In
          </Link>
          <Link to="/sign-up" className={classes.signUp}>
            Sign Up
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className={classes.header}>
      <Link className={classes.headline} to="/">
        Realworld Blog
      </Link>
      {authDiv}
    </header>
  );
};
export default Header;
