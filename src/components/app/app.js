import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Layout from '../layout';
import ArticlesList from '../articles-list';
import ArticlePage from '../article-page';
import EditArticle from '../../pages/edit-article';
import CreateArticle from '../../pages/create-article';
import SignUp from '../auth-forms/sign-up';
import SignIn from '../auth-forms/sign-in';
import EditProfile from '../auth-forms/edit-profile';
import { setCurrentUser, stopCheckingUser } from '../../store/actions/articlesAction';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) dispatch(setCurrentUser(JSON.parse(user)));
    dispatch(stopCheckingUser);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ArticlesList />} />
          <Route path="articles" element={<ArticlesList />} />
          <Route path="articles/:slug" element={<ArticlePage />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="new-article" element={<CreateArticle />} />
          <Route path="articles/:slug/edit" element={<EditArticle />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
