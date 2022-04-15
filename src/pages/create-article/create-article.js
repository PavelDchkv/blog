import React from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';

import { createArticle } from '../../services/realworld-api';
import ArticleForm from '../../components/article-form';
import Spinner from '../../components/spinner';

export const CreateArticle = () => {
  const isCheckingUser = useSelector((state) => state.isCheckingUser);
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();

  if (isCheckingUser) return <Spinner />;
  if (!user) return <Navigate to="/sign-in" />;

  const onSubmit = (data) => {
    createArticle(
      {
        article: {
          title: data.title,
          description: data.description,
          body: data.text,
          tagList: data.tags.map((tag) => tag.value),
        },
      },
      user.token
    )
      .then(() => {
        message.success('The article was successfully created');
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.log(err);
        message.error('Unlucky =(');
      });
  };

  return <ArticleForm onSubmit={onSubmit} />;
};
