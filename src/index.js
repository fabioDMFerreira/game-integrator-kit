import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import app from './App';
import registerServiceWorker from './registerServiceWorker';
import Kit from './kit';

const kit = new Kit(),
	App = app(kit);

ReactDOM.render(
	<Provider
		store={kit.store}
	>
		<App />
	</Provider>,
	document.getElementById('root'),
);

registerServiceWorker();

export default kit;
