import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { stores } from './stores';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider {...stores}>
      <App/>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
