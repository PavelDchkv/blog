import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { Popconfirm, message } from 'antd';

import Spinner from '../spinner';
import { getArticleBySlug, deleteArticle } from '../../services/realworld-api';
import classes from '../article/article.module.scss';
import logo from '../../img/logo.svg';
import like from '../../img/like.svg';
import likeActive from '../../img/likeActive.svg';

import newClasses from './artical-page.module.scss';

export const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [article, setArticle] = useState();

  const user = useSelector((state) => state.currentUser);
  const isCheckingUser = useSelector((state) => state.isCheckingUser);

  useEffect(() => {
    if (!isCheckingUser) {
      setLoading(true);
      getArticleBySlug(slug, user?.token).then((currentArticle) => {
        setArticle(currentArticle);
        setLoading(false);
      });
    }
  }, [user, isCheckingUser]);

  if (isLoading || isCheckingUser) return <Spinner />;

  const { title, tagList, description, author, createdAt, favoritesCount, body, favorited } = article;

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

  return (
    <article className={classes.article}>
      <section className={classes.content}>
        <div className={classes.contentTopLine}>
          <div className={classes.contentTitle}>{title}</div>
          <button className={classes.contentLikeBtn} type="button">
            <img src={favorited ? likeActive : like} alt="like" className={classes.contentLike} />
          </button>
          <span className={classes.contentLikeCount}>{favoritesCount}</span>
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
              onCancel={() => message.error('Error')}
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
