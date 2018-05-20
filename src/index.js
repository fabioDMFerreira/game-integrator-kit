import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import HOApp from './HOApp';
import registerServiceWorker from './registerServiceWorker';
import Kit from './kit';

const kit = new Kit(),
	App = HOApp(kit);

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
