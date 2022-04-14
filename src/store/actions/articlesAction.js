import { apiBase } from '../../services/realworld-api';

export const ADD_ARTICLES = 'ADD_ARTICLES';
export const START_CHECKING_USER = 'START_CHECKING_USER';
export const STOP_CHECKING_USER = 'STOP_CHECKING_USER';
export const SET_TOTAL_PAGES = 'SET_TOTAL_PAGES';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const startCheckingUser = {
  type: START_CHECKING_USER,
};

export const stopCheckingUser = {
  type: STOP_CHECKING_USER,
};

const addArticles = (articles, page = 1) => {
  return {
    type: ADD_ARTICLES,
    articles,
    page,
  };
};

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    user,
  };
};

const setTotalPages = (totalPages) => {
  return {
    type: SET_TOTAL_PAGES,
    totalPages,
  };
};

export const setCurrentPage = (page) => {
  return {
    type: SET_CURRENT_PAGE,
    page,
  };
};

const countArticles = 5;

export const getArticles = (page, token) => async (dispatch) => {
  try {
    const headers = token ? { headers: { Authorization: `Token ${token}` } } : null;

    const res = await fetch(`${apiBase}/articles?limit=${countArticles}&offset=${(page - 1) * countArticles}`, headers);

    if (!res.ok) throw new Error('Something went wrong in getArticles(), received ${res.status}');

    const { articles, articlesCount } = await res.json();
    const total = Math.ceil(articlesCount / countArticles);

    dispatch(setTotalPages(total));
    dispatch(addArticles(articles));
  } catch (err) {
    console.log(err);
  }
};
