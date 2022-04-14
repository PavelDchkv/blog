import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from 'antd';

import Article from '../article';
import Spinner from '../spinner';
import { getArticles, setCurrentPage } from '../../store/actions/articlesAction';

import classes from './articles-list.module.scss';

const ArticlesList = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles);
  const user = useSelector((state) => state.currentUser);
  const totalPages = useSelector((state) => state.totalPages);
  const currentPage = useSelector((state) => state.page);

  const isCheckingUser = useSelector((state) => state.isCheckingUser);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCheckingUser) {
      setLoading(true);
      dispatch(getArticles(currentPage, user?.token)).then(() => setLoading(false));
    }
  }, [currentPage, isCheckingUser, user?.token]);

  if (isCheckingUser || isLoading) return <Spinner />;

  const listOfArticles = articles.map((article) => {
    return (
      <li key={article.slug}>
        <Article article={article} user={user} />
      </li>
    );
  });

  const onChange = (page) => {
    window.scroll(0, 0);
    dispatch(setCurrentPage(page));
  };

  return (
    <>
      <ul className={classes.list}>{listOfArticles}</ul>
      <div className={classes.paginationWrapper}>
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={1}
          onChange={onChange}
          showSizeChanger={false}
          hideOnSinglePage
        />
      </div>
    </>
  );
};

export default ArticlesList;
