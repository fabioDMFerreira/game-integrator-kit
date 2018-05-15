import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Kit from './kit/index';

export const kit = new Kit();

ReactDOM.render(
<Provider store={kit.store}>
<App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
