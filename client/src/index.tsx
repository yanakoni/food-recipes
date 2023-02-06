import React from 'react';
import ReactDOM from 'react-dom/client';
import ReduxToastr from 'react-redux-toastr';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { TOAST_TIME_OUT_MS } from './utils/constants';
import './index.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'bootstrap/scss/bootstrap.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ReduxToastr timeOut={TOAST_TIME_OUT_MS} position="top-right" preventDuplicates />
    </Provider>
  </React.StrictMode>
);
