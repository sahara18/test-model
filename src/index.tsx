import React from 'react';
import ReactDOM from 'react-dom';
import Todos from './components/Todos';
import reportWebVitals from './reportWebVitals';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Todos />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
