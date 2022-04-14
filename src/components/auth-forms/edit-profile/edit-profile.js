import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';

import classes from '../auth-forms.module.scss';
import { updateUser } from '../../../services/realworld-api';
import { setCurrentUser } from '../../../store/actions/articlesAction';
import Spinner from '../../spinner';

export const EditProfile = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const user = useSelector((state) => state.currentUser);
  const isCheckingUser = useSelector((state) => state.isCheckingUser);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  if (isCheckingUser) return <Spinner />;

  const onSubmit = (data) => {
    const newData = {};
    Object.entries(data).forEach((arr) => {
      if (arr[1]) newData[arr[0]] = arr[1];
    });

    updateUser(newData, user.token).then((res) => {
      if (res.errors) {
        console.log(res.errors);
        return;
      }
      localStorage.setItem('user', JSON.stringify(res.user));
      dispatch(setCurrentUser(res.user));
      message.success('The user was successfully updated');
      navigate('/', { replace: true });
    });
  };

  if (!user) return <Navigate to="/sign-in" replace />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <h1 className={classes.formTitle}>Edit Profile</h1>

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
          autoComplete="off"
          defaultValue={user.username}
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
          autoComplete="off"
          defaultValue={user.email}
        />
      </label>
      {errors?.email && <p className={classes.formError}>{errors.email.message}</p>}

      <label>
        New Password
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.password ? classes.formInputTextError : '')}
          placeholder="Password"
          {...register('password', {
            minLength: { value: 6, message: 'Your password needs to be at least 6 characters' },
            maxLength: { value: 40, message: 'Your password needs to be no more than 40 characters' },
          })}
          type="password"
          autoComplete="off"
        />
      </label>
      {errors?.password && <p className={classes.formError}>{errors.password.message}</p>}

      <label>
        Avatar image (url)
        <br />
        <input
          className={classes.formInputText + ' ' + (errors?.repeatPassword ? classes.formInputTextError : '')}
          placeholder="Avatar image"
          {...register('image', {
            pattern: {
              value: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i,
              message: 'URL is invalid',
            },
          })}
          type="url"
          autoComplete="off"
          defaultValue={user.image}
        />
      </label>
      {errors?.image && <p className={classes.formError}>{errors.image.message}</p>}

      <button type="submit" className={classes.formButton}>
        Save
      </button>
    </form>
  );
};
