import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import reducer from './reducer';
import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';
import Ui from './ui';

import { GAMES_NOT_FOUND } from './ui/errorMessages/constants';

import { executeFunction, parseArray } from './utils';
import GameStatus from './gameStatus';

export default class Kit {
	constructor(Games) {
		if (process.env.NODE_ENV === 'development') {
			this.store = createStore(reducer, devToolsEnhancer());
		} else {
			this.store = createStore(reducer);
		}
		this.keyboard = new Keyboard(this);
		this.gameStatus = new GameStatus(this);
		this.ui = new Ui(this);

		this.games = Games;

		if (!Games || typeof Games !== 'object' || !Object.keys(Games).length) {
			this.ui.showError(GAMES_NOT_FOUND);
		} else if (Object.keys(Games).length === 1) {
			const Game = this.selectGame();
			this.init(Game);
		} else {
			this.ui.showError('Support to multiple games are not available at the moment');
		}
	}

	enableCountdown() {
		this.countdown = new Countdown(this);
	}

	enableCatchables() {
		this.catchables = new Catchables(this);
	}

	init([GameName, Game]) {
		this.game = new Game(this);
		this.gameStatus.setGameName(GameName);


		// on click escape show menu if game is running
		this.keyboard.subscribe(27, () => {
			const state = this.store.getState(),
				gameStopped = state.get('gameStopped');

			if (!gameStopped) {
				this.showMenu();
			}
		});
	}

	/**
	 * Returns game description and gameClass
	 * @param {string} game
	 * @returns {(string|class)[]} game - [0] Name of the game and [1] Class of the game
	 */
	selectGame(game) {
		const descriptionOfGame = game || Object.keys(this.games)[0];

		return [descriptionOfGame, this.games[descriptionOfGame]];
	}

	setControlsDescription(description) {
		this.gameStatus.setControlsDescription(description);
	}

	endOfGame(result) {
		return result ? this.won() : this.lost();
	}

	load(element) {
		if (this.game) {
			this.game.renderOn(element);
			this.start();
		} else {
			console.warn('load::game not found');
		}
	}

	start() {
		this.gameStatus.startGame();
		this.game.startRender();

		if (this.countdown) {
			this.countdown.setTime(300);
			this.countdown.start();
		}
	}

	stop() {
		this.gameStatus.stopGame();
		this.game.stopRender();

		if (this.countdown) {
			this.countdown.stop();
		}
	}

	continue() {
		this.gameStatus.continueGame();
		this.game.startRender();
		if (this.countdown) {
			this.countdown.continue();
		}
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

	hideMenu() {
		this.ui.hideMenu();
		this.continue();
	}

	showControls() {
		this.stop();
		this.ui.showControls();
	}

	hideControls() {
		this.ui.hideControls();
		this.continue();
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
		if (this.game) {
			this.game.setSize(width, height);
		} else {
			console.warn('setGameContainerSize::game not found');
		}
	}

	showPopup() {
		this.stop();
		this.ui.showPopup();
	}

	hidePopup() {
		this.ui.hidePopup();
		this.continue();
	}
}

Kit.prototype.reload = () => window.location.reload();
