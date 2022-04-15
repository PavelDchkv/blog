import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../../../services/realworld-api';
import classes from '../auth-forms.module.scss';

export const SignUp = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    mode: 'onBlur',
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    registerUser(data).then((res) => {
      if (res.errors) {
        if (res.errors.email) {
          setError('email', { type: 'api', message: `Email ${res.errors.email}` });
          return;
        }

        if (res.errors.username) {
          setError('username', { type: 'api', message: `Username ${res.errors.username}` });
          return;
        }

        console.log(res.errors);
        return;
      }
      navigate('/Sign-In', { replace: true });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <h1 className={classes.formTitle}>Create new account</h1>

      <label>
        Username
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.username ? classes.formInputTextError : '')}
          placeholder="Username"
          {...register('username', {
            required: 'Enter username',
            minLength: { value: 3, message: 'Your username needs to be at least 3 characters' },
            maxLength: { value: 40, message: 'Your username needs to be no more than 40 characters' },
          })}
        />
      </label>
      {errors?.username && <p className={classes.formError}>{errors.username.message}</p>}

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

      <label>
        Repeat password
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.repeatPassword ? classes.formInputTextError : '')}
          placeholder="Password"
          {...register('repeatPassword', {
            required: 'Repeat password',
            validate: (value) => value === watch('password'),
          })}
          type="password"
          autoComplete="off"
        />
      </label>
      {errors?.repeatPassword && <p className={classes.formError}>Passwords must match</p>}

      <label className={classes.formCheckbox}>
        <input
          className={classes.formCheckboxInput}
          type="checkbox"
          defaultChecked
          {...register('privacy', {
            validate: (bool) => bool,
          })}
        />
        <span className={classes.formCheckboxText}>I agree to the processing of my personal information</span>
      </label>
      {errors?.privacy && <p className={classes.formError}>The checkbox must be clicked)))</p>}

      <button type="submit" className={classes.formButton}>
        Create
      </button>

      <p className={classes.formFooter}>
        Already have an account?
        <Link to="/sign-in" className={classes.formFooterLink}>
          Sign In.
        </Link>
      </p>
    </form>
  );
};
