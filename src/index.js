import React from 'react';
import { render }from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
import createStore from './reducks/store/store';
import * as serviceWorker from './serviceWorker';
import {ErrorBoundary} from "./components/UIkit";
import './assets/reset.css'
import './assets/style.css'
import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from './assets/theme'
import App from './App';

const history = History.createBrowserHistory();
export const store = createStore(history);
// createStore関数を実行。これによりstoreが作られる。storeは別の場所でも使うのでexportをつけておく。

render(
  <Provider　store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
); // Providerでラップしたコンポーネントはstoreの情報を参照できるようになる。
//MuiThemeProvider useStyleのthemeを使うために必要。
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.register();
