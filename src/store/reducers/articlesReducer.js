import {
  START_CHECKING_USER,
  STOP_CHECKING_USER,
  ADD_ARTICLES,
  SET_TOTAL_PAGES,
  SET_CURRENT_PAGE,
  SET_CURRENT_USER,
} from '../actions/articlesAction';

const initialState = {
  articles: [],
  isCheckingUser: true,
  page: 1,
  totalPages: 1,
  currentUser: null,
};

export const articles = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLES:
      return {
        ...state,
        articles: action.articles,
      };
    case SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages,
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        page: action.page,
      };
    case START_CHECKING_USER:
      return {
        ...state,
        isCheckingUser: true,
      };
    case STOP_CHECKING_USER:
      return {
        ...state,
        isCheckingUser: false,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.user,
      };
    default:
      return state;
  }
};
