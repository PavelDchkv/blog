import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import logo from '../../img/logo.svg';
import like from '../../img/like.svg';
import likeActive from '../../img/likeActive.svg';
import { likeArticle } from '../../services/realworld-api';

import classes from './article.module.scss';

const Article = (props) => {
  const { title, tagList, description, author, createdAt, favoritesCount, slug, favorited } = props.article;

  const [isFavorited, setFavorited] = useState(favorited);
  const [countLikes, setCountLikes] = useState(favoritesCount);

  const tagsList = tagList.map((tag, index) => {
    return (
      <li key={index} className={classes.contentTag}>
        {tag}
      </li>
    );
  });

  const urlImg = author.image ? author.image : logo;

  const onLike = () => {
    if (!props?.user) return;
    const method = isFavorited ? 'DELETE' : 'POST';
    likeArticle(slug, props.user?.token, method).then(() => {
      setCountLikes((prev) => (isFavorited ? prev - 1 : prev + 1));
      setFavorited((prev) => !prev);
    });
  };

  return (
    <article className={classes.article}>
      <section className={classes.content}>
        <div className={classes.contentTopLine}>
          <Link className={classes.contentTitle} to={`/articles/${slug}`}>
            {title}
          </Link>
          <button className={classes.contentLikeBtn} type="button" onClick={onLike} disabled={!props?.user}>
            <img src={isFavorited ? likeActive : like} alt="like" className={classes.contentLike} />
          </button>
          <span className={classes.contentLikeCount}>{countLikes}</span>
        </div>
        <ul className={classes.contentTagsList}>{tagsList}</ul>
        <p className={classes.contentDescription}>{description}</p>
      </section>
      <section className={classes.infoWrapper}>
        <div className={classes.info}>
          <p className={classes.infoName}>{author.username}</p>
          <p className={classes.infoDate}>{format(new Date(createdAt), 'MMMM d, y')}</p>
        </div>
        <img src={urlImg} alt="avatar" className={classes.avatar} />
      </section>
    </article>
  );
};

export default Article;
