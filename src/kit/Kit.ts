import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import generateGameInterface from './generateGameInterface';
import reducer from './reducer';
import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';
import Ui from './ui';

import { GAMES_NOT_FOUND } from './ui/errorMessages/constants';

import { executeFunction, parseArray } from './utils';
import GameStatus from './gameStatus';

export default class Kit {
	store: any;
	keyboard: any;
	gameStatus: any;
	ui: any;
	games: any;
	catchables?: any;
	countdown?: any;
	game: any;
	gameName?: string;

	constructor() {
		if (process.env.NODE_ENV === 'development') {
			this.store = createStore(reducer, devToolsEnhancer({}));
		} else {
			this.store = createStore(reducer);
		}
		this.keyboard = new Keyboard();
		this.gameStatus = new GameStatus(this);
		this.ui = new Ui(this);

		this.init();
	}

	validateGame(game: any) {
		const mustHaveMethods = ['renderOn', 'startRender', 'setSize', 'loadKit', 'stopRender'];

		if (!game) {
			return {
				errorMessage: '"index.js" file must expose an object with methods: \'renderOn\', \'startRender\', \'setSize\', \'loadKit\'',
			};
		}

		for (let i = 0; i < mustHaveMethods.length; i++) {
			if (!(mustHaveMethods[i] in game)) {
				return {
					errorMessage: `${mustHaveMethods[i]} must be exposed in index.js of your game directory`,
				};
			} else if (!(game[mustHaveMethods[i]] instanceof Function)) {
				return {
					errorMessage: `${mustHaveMethods[i]} must be a function`,
				};
			}
		}

		return game;
	}

	setGames(games: any) {
		if (!games || typeof games !== 'object' || !Object.keys(games).length) {
			return this.ui.showError(GAMES_NOT_FOUND);
		}

		const GamesValidated = Object.keys(games).reduce((gamesList: any, gameName) => {
			gamesList[gameName] = this.validateGame(games[gameName]);
			return gamesList;
		}, {});

		this.games = GamesValidated;
	}

	pauseGameAndShowGamesList() {
		this.ui.hideMenu();

		this.game = null;
		this.gameName = "";

		this.gameStatus.setGameSelected();
	}

	init() {
		function preventBubble(e: any) {
			e.preventDefault();
			e.stopPropagation();
		}

		// do not allow focused buttons to be clicked on tapping space or enter
		this.keyboard.subscribe(32, preventBubble);
		this.keyboard.subscribe(13, preventBubble);
	}


	enableCountdown() {
		this.countdown = new Countdown(this);
		this.countdown.enable(this.gameName);
		return {
			setTime: this.countdown.setTime.bind(this.countdown, this.gameName),
			stop: this.countdown.stop.bind(this.countdown, this.gameName),
			continue: this.countdown.stop.bind(this.countdown, this.gameName),
		};
	}

	enableCatchables() {
		this.catchables = new Catchables(this);
		this.catchables.enable(this.gameName);
		return {
			set: this.catchables.set.bind(this.catchables, this.gameName),
			decrease: this.catchables.decrease.bind(this.catchables, this.gameName),
		};
	}

	/**
	 * @returns {array.<string>} GamesStatus
	 */
	getGamesStatus() {
		if (!this.games) {
			return {};
		}
		return Object.keys(this.games).reduce(
			(gamesStatusList, gameName) => ({
				...gamesStatusList,
				[gameName]: this.games[gameName].errorMessage || 'success',
			})
			, {},
		);
	}


	selectGame(gameName: string) {
		const [GameName, Game] = this.getGameByName(gameName);


		this.game = Game;
		this.gameName = gameName;

		// on click escape show menu if game is running
		this.keyboard.subscribe(27, () => {
			const state = this.store.getState(),
				gameStopped = state.get('gameStopped');

			if (!gameStopped) {
				this.showMenu();
			}
		});

		// add methods of kit into game
		Game.loadKit(generateGameInterface(this, gameName));

		// update controls help accessible through infoOptions component
		this.setControlsDescription(Game.controls);

		this.gameStatus.setGameSelected(GameName);
	}

	/**
	 * Returns game description and gameClass
	 * @param {string} game
	 * @returns {(string|class)[]} game - [0] Name of the game and [1] Class of the game
	 */
	getGameByName(game: any) {
		const descriptionOfGame = game || Object.keys(this.games)[0];

		return [descriptionOfGame, this.games[descriptionOfGame]];
	}

	setControlsDescription(description: string) {
		this.gameStatus.setControlsDescription(description);
	}

	endOfGame(result: boolean) {
		return result ? this.won() : this.lost();
	}

	load(element: any) {
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
			this.countdown.start(this.gameName);
		}
	}

	stop() {
		this.gameStatus.stopGame();
		this.game.stopRender();

		if (this.countdown) {
			this.countdown.stop(this.gameName);
		}
	}

	continue() {
		this.gameStatus.continueGame();
		this.game.startRender();
		if (this.countdown) {
			this.countdown.continue(this.gameName);
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

	setGameContainerSize(width: any, height: any) {
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

	reload() {
		window.location.reload();
	}
};
