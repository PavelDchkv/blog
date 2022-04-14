import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getCurrentUser, logIn } from '../../../services/realworld-api';
import classes from '../auth-forms.module.scss';
import { setCurrentUser } from '../../../store/actions/articlesAction';

export const SignIn = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = (data) => {
    logIn(data).then((res) => {
      if (res.errors) {
        setError('invalidLogin', { type: 'api', message: 'Email or password is invalid' });
        return;
      }
      getCurrentUser(res.user.token).then(({ user }) => {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setCurrentUser(user));
        navigate('/', { replace: true });
      });
    });
  };

  const onSubmit = (data) => {
    clearErrors('invalidLogin');
    handleSubmit(signIn)(data);
  };

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <h1 className={classes.formTitle}>Sign In</h1>

      {errors?.invalidLogin && <p className={classes.formError}>Login or password is invalid</p>}

      <label>
        Email address
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.email ? classes.formInputTextError : '')}
          placeholder="Email address"
          {...register('email', {
            required: 'Enter email address',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          })}
          type="email"
        />
      </label>
      {errors?.email && <p className={classes.formError}>{errors.email.message}</p>}

      <label>
        Password
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.password ? classes.formInputTextError : '')}
          placeholder="Password"
          {...register('password', {
            required: 'Enter password',
            minLength: { value: 6, message: 'Your password needs to be at least 6 characters' },
            maxLength: { value: 40, message: 'Your password needs to be no more than 40 characters' },
          })}
          type="password"
          autoComplete="on"
        />
      </label>
      {errors?.password && <p className={classes.formError}>{errors.password.message}</p>}

      <button type="submit" className={classes.formButton}>
        Login
      </button>

      <p className={classes.formFooter}>
        Don’t have an account?
        <Link to="/sign-in" className={classes.formFooterLink}>
          Sign Up.
        </Link>
      </p>
    </form>
  );
};
