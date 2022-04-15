import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Navigate } from 'react-router-dom';

import { updateArticle, getArticleBySlug } from '../../services/realworld-api';
import ArticleForm from '../../components/article-form';
import Spinner from '../../components/spinner';

export const EditArticle = () => {
  const isCheckingUser = useSelector((state) => state.isCheckingUser);
  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();

  const { slug } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [article, setArticle] = useState();

  useEffect(() => {
    if (!isCheckingUser && slug) {
      setLoading(true);
      getArticleBySlug(slug, user?.token).then((currentArticle) => {
        if (currentArticle.author.username !== user.username) navigate('/', { replace: true });
        setArticle({
          title: currentArticle.title,
          description: currentArticle.description,
          text: currentArticle.body,
          tags: currentArticle.tagList ? currentArticle.tagList.map((tag) => ({ value: tag })) : null,
        });
        setLoading(false);
      });
    }
  }, [isCheckingUser]);

  if (isCheckingUser || isLoading) return <Spinner />;
  if (!user) return <Navigate to="/sign-in" />;

  const onSubmit = (data) => {
    updateArticle(slug, user.token, {
      article: {
        title: data.title,
        description: data.description,
        body: data.text,
        tagList: data.tags.map((tag) => tag.value),
      },
    })
      .then(() => {
        message.success('The article was successfully created');
        navigate(`/articles/${slug}`, { replace: true });
      })
      .catch((err) => {
        console.log(err);
        message.error('Unlucky =(');
      });
  };

  return <ArticleForm onSubmit={onSubmit} article={article} />;
};
