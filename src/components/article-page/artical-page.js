import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { Popconfirm, message } from 'antd';

import Spinner from '../spinner';
import { getArticleBySlug, deleteArticle, likeArticle } from '../../services/realworld-api';
import classes from '../article/article.module.scss';
import logo from '../../img/logo.svg';
import like from '../../img/like.svg';
import likeActive from '../../img/likeActive.svg';

import newClasses from './artical-page.module.scss';

export const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [articleState, setArticleState] = useState({ article: {}, isLoading: true });

  const [favoriteState, setFavoriteState] = useState({ isFavorited: false, countLikes: 0 });

  const user = useSelector((state) => state.currentUser);
  const isCheckingUser = useSelector((state) => state.isCheckingUser);

  useEffect(() => {
    if (!isCheckingUser) {
      setArticleState({ article: articleState.article, isLoading: true });
      getArticleBySlug(slug, user?.token).then((currentArticle) => {
        setArticleState({ article: currentArticle, isLoading: false });
        setFavoriteState({ isFavorited: currentArticle.favorited, countLikes: currentArticle.favoritesCount });
      });
    }
  }, [user, isCheckingUser]);

  if (articleState.isLoading) return <Spinner />; // || isCheckingUser

  const { title, tagList, description, author, createdAt, body } = articleState.article;

  const tagsList = tagList.map((tag, index) => {
    return (
      <li key={index} className={classes.contentTag}>
        {tag}
      </li>
    );
  });
  const urlImg = author.image ? author.image : logo;

  const onDelete = () => {
    deleteArticle(slug, user.token).then((res) => {
      if (res.ok) {
        message.success('The article was successfully deleted');
        navigate('/', { replace: true });
      }
    });
  };

  const onLike = () => {
    if (!user) return;
    const method = favoriteState.isFavorited ? 'DELETE' : 'POST';
    likeArticle(slug, user?.token, method).then(() => {
      setFavoriteState((prev) => ({
        countLikes: prev.isFavorited ? prev.countLikes - 1 : prev.countLikes + 1,
        isFavorited: !prev.isFavorited,
      }));
    });
  };

  return (
    <article className={classes.article}>
      <section className={classes.content}>
        <div className={classes.contentTopLine}>
          <div className={classes.contentTitle}>{title}</div>
          <button className={classes.contentLikeBtn} type="button" onClick={onLike}>
            <img src={favoriteState.isFavorited ? likeActive : like} alt="like" className={classes.contentLike} />
          </button>
          <span className={classes.contentLikeCount}>{favoriteState.countLikes}</span>
        </div>
        <ul className={classes.contentTagsList}>{tagsList}</ul>
        <p className={classes.contentDescription}>{description}</p>
      </section>
      <section className={newClasses.userInfo}>
        <div className={classes.infoWrapper}>
          <div className={classes.info}>
            <p className={classes.infoName}>{author.username}</p>
            <p className={classes.infoDate}>{format(new Date(createdAt), 'MMMM d, y')}</p>
          </div>
          <img src={urlImg} alt="avatar" className={classes.avatar} />
        </div>
        {author.username === user?.username && (
          <div className={newClasses.btnsWrapper}>
            <Popconfirm
              title="Are you sure to delete this article?"
              okText="Yes"
              cancelText="No"
              onConfirm={onDelete}
              className={newClasses.buttonDel}
            >
              Delete
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`} className={newClasses.buttonEdit}>
              Edit
            </Link>
          </div>
        )}
      </section>
      <ReactMarkdown className={newClasses.articleBody}>{body}</ReactMarkdown>
    </article>
  );
};
