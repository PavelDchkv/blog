import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';

import Spinner from '../spinner';
import { createArticle, getArticleBySlug, updateArticle } from '../../services/realworld-api';

import classes from './article-form.module.scss';

export const ArticleForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const user = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  const { slug } = useParams();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getArticleBySlug(slug, user?.token).then((currentArticle) => {
        if (currentArticle.author.username !== user.username) navigate('/', { replace: true });
        reset({
          title: currentArticle.title,
          description: currentArticle.description,
          text: currentArticle.body,
          tags: currentArticle.tagList ? currentArticle.tagList.map((tag) => ({ value: tag })) : null,
        });
        setLoading(false);
      });
    }
  }, []);

  if (isLoading) return <Spinner />;

  const tagsArr = fields.map((field, index) => (
    <div className={classes.tag} key={field.id}>
      <input className={classes.tagInput} {...register(`tags.${index}.value`)} placeholder="Tag" />
      <button type="button" className={classes.tagBtn} onClick={() => remove(index)}>
        Delete
      </button>
    </div>
  ));

  const onSubmit = (data) => {
    if (slug) onEdit(data);
    else onCreate(data);
  };

  const onEdit = (data) => {
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

  const onCreate = (data) => {
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

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={classes.formTitle}>{slug ? 'Edit article' : 'Create new article'}</h1>

      <label className={classes.formLabel}>
        <span className={classes.formLabelText}>Title</span>
        <input
          className={classes.formInput + ' ' + (errors?.title ? classes.formInputError : '')}
          placeholder="Title"
          {...register('title', {
            required: 'Enter the title',
          })}
        />
      </label>
      {errors?.title && <p className={classes.formError}>{errors.title.message}</p>}

      <label className={classes.formLabel}>
        <span className={classes.formLabelText}>Short description</span>
        <input
          className={classes.formInput + ' ' + (errors?.description ? classes.formInputError : '')}
          placeholder="Short description"
          {...register('description', {
            required: 'Enter the description',
          })}
        />
      </label>
      {errors?.description && <p className={classes.formError}>{errors.description.message}</p>}

      <label className={classes.formLabel}>
        <span className={classes.formLabelText}>Text</span>
        <textarea
          className={classes.formTextarea + ' ' + (errors?.text ? classes.formInputError : '')}
          placeholder="Text"
          {...register('text', {
            required: 'Enter the text',
          })}
        />
      </label>
      {errors?.text && <p className={classes.formError}>{errors.text.message}</p>}

      <label className={classes.formLabel}>
        <span className={classes.formLabelText}>Tags</span>
        <div className={classes.tags}>
          <div className={classes.tagsWrapper}>{tagsArr}</div>
          <button type="button" onClick={() => append('')} className={classes.tagsBtn}>
            Add tag
          </button>
        </div>
      </label>

      <button type="submit" className={classes.formButton}>
        Send
      </button>
    </form>
  );
};
