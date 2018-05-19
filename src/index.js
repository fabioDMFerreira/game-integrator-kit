import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Kit from './kit';

export const kit = new Kit();

ReactDOM.render(
<Provider store={kit.store}>
<App kit={kit}/>
</Provider>, document.getElementById('root'));
registerServiceWorker();
