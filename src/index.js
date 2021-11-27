import React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// https://create-react-app.dev/docs/making-a-progressive-web-app/
serviceWorker.unregister();
