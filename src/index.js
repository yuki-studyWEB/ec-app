import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './reducks/store/store'
import {ConnectedRouter} from "connected-react-router";
import * as History from "history";
import App from './App';
import reportWebVitals from './reportWebVitals';

const history = History.createBrowserHistory();
export const store = createStore(history);
// createStore関数を実行。これによりstoreが作られる。storeは別の場所でも使うのでexportをつけておく。

ReactDOM.render(
  <Provider　store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
); // Providerでラップしたコンポーネントはstoreの情報を参照できるようになる。

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
