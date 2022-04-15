import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

import classes from './article-form.module.scss';

export const ArticleForm = ({ onSubmit, article }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      title: article?.title,
      description: article?.description,
      text: article?.text,
      tags: article?.tagList ? article?.tagList.map((tag) => ({ value: tag })) : null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  const tagsArr = fields.map((field, index) => (
    <div className={classes.tag} key={field.id}>
      <input className={classes.tagInput} {...register(`tags.${index}.value`)} placeholder="Tag" />
      <button type="button" className={classes.tagBtn} onClick={() => remove(index)}>
        Delete
      </button>
    </div>
  ));

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={classes.formTitle}>{article ? 'Edit article' : 'Create new article'}</h1>

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
