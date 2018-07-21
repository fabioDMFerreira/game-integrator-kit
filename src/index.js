import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './sass/index.css';
import HOApp from './App';
import registerServiceWorker from './registerServiceWorker';
import Kit from './kit';
import getGames from './getGames';

const Games = getGames();

const kit = new Kit(),
	App = HOApp(kit);

kit.setGames(Games);

global.Kit = kit;

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
