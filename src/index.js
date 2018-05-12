import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Game from './game/index';

export const game = new Game();

ReactDOM.render(
<Provider store={game.store}>
<App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
