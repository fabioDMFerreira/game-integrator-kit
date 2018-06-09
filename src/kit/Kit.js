import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import reducer from './reducer';
import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';
import Graveball from './game/graveball';
import Ui from './ui';

import { executeFunction, parseArray } from './utils';
import GameStatus from './gameStatus';

export default class Kit {
	constructor() {
		if (process.env.NODE_ENV === 'development') {
			this.store = createStore(reducer, devToolsEnhancer());
		} else {
			this.store = createStore(reducer);
		}
		this.countdown = new Countdown(this);
		this.catchables = new Catchables(this);
		this.keyboard = new Keyboard(this);
		this.gameStatus = new GameStatus(this);
		this.ui = new Ui(this);

		this.game = new Graveball(this);

		this.init();
	}

	init() {
		// on click escape menu should be shown
		const showMenu = this.showMenu.bind(this),
			toggleStartGame = this.toggleStartGame.bind(this, [], showMenu);
		this.keyboard.subscribe(27, toggleStartGame);
	}

	setControlsDescription(description) {
		this.gameStatus.setControlsDescription(description);
	}

	endOfGame(result) {
		return result ? this.won() : this.lost();
	}

	load(element) {
		this.game.renderOn(element);
		this.start();
	}

	start() {
		this.ui.hideMenu();
		this.gameStatus.startGame();
		this.game.startRender();
		this.countdown.setTime(300);
		this.countdown.start();
	}

	stop() {
		this.gameStatus.stopGame();
		this.game.stopRender();
		this.countdown.stop();
	}

	continue() {
		this.ui.hideMenu();
		this.ui.hideControls();
		this.gameStatus.continueGame();
		this.game.startRender();
		this.countdown.continue();
	}

	/**
	 * Start and stop game.
	 * @param {Array.Function} cbContinue - functions to be called if game was continued
	 * @param {Array.Function} cbStop - functions to be called if game was stopped
	 */
	toggleStartGame(cbContinue = [], cbStop = []) {
		const gameStopped = this.store.getState().get('gameStopped');
		if (gameStopped) {
			this.continue();
			parseArray(cbContinue).forEach(executeFunction);
		} else {
			this.stop();
			cbContinue.forEach(executeFunction);
			parseArray(cbStop).forEach(executeFunction);
		}
	}

	showMenu() {
		this.stop();
		this.ui.showMenu();
	}

	showControls() {
		this.stop();
		this.ui.showControls();
	}

	won() {
		this.gameStatus.gameWon();
		this.showMenu();
	}

	lost() {
		this.gameStatus.gameLost();
		this.showMenu();
	}

	setGameContainerSize(width, height) {
		this.game.setSize(width, height);
	}
}

Kit.prototype.reload = () => window.location.reload();
