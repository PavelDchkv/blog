import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

import { articles } from './store/reducers/articlesReducer';
import 'antd/dist/antd.min.css';
import './styles/style.scss';
import App from './components/app';

const store = createStore(articles, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
