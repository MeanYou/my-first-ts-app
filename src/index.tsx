import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { createStores } from './stores';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider>
      <App/>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
