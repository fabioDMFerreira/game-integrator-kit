import { createStore, Store } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import reducer from './reducer';
import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';
import Ui from './ui';

import { GAMES_NOT_FOUND } from './ui/errorMessages/constants';

import { executeFunction, parseArray } from './utils';
import GameStatus from './gameStatus';
import Game from './Game';

interface Controls {
	[key: string]: string;
}

interface GameValidation {
	errorMessage: string;
}

interface Games {
	[key: string]: Game | GameValidation;
}

interface ExtendedGameStatus extends GameStatus {
	setGameSelected(name?: string): void;
}

interface ExtendedKeyboard extends Keyboard {
	subscribe(keyCode: string | undefined, callback: (e: Event) => void): void;
}

interface ExtendedGame extends Game {
	loadKit(kit: Kit): void;
	controls?: Controls;
}

export default class Kit {
	private _store: Store;
	private keyboard: ExtendedKeyboard;
	private gameStatus: ExtendedGameStatus;
	private ui: Ui;
	private games: Games = {};
	private catchables?: Catchables;
	private countdown?: Countdown;
	private game?: ExtendedGame;
	private gameName?: string;

	constructor() {
		if (process.env.NODE_ENV === 'development') {
			this._store = createStore(reducer, devToolsEnhancer({}));
		} else {
			this._store = createStore(reducer);
		}
		this.keyboard = new Keyboard() as ExtendedKeyboard;
		this.gameStatus = new GameStatus(this) as ExtendedGameStatus;
		this.ui = new Ui(this);

		this.init();
	}

	get store(): Store {
		return this._store;
	}

	private isGameValidation(game: Game | GameValidation): game is GameValidation {
		return 'errorMessage' in game;
	}

	validateGame(game: Game): Game | GameValidation {
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
			} else if (!(game[mustHaveMethods[i] as keyof Game] instanceof Function)) {
				return {
					errorMessage: `${mustHaveMethods[i]} must be a function`,
				};
			}
		}

		return game;
	}

	setGames(games: Game[]): void {
		if (!games || !games.length) {
			return this.ui.showError(GAMES_NOT_FOUND);
		}

		const GamesValidated = games.reduce((gamesList: Games, game, index) => {
			const gameName = `game${index + 1}`;
			gamesList[gameName] = this.validateGame(game);
			return gamesList;
		}, {});

		this.games = GamesValidated;
	}

	init(): void {
		const preventBubble = (e: Event): void => {
			e.preventDefault();
			e.stopPropagation();
		};

		// do not allow focused buttons to be clicked on tapping space or enter
		this.keyboard.subscribe('32', preventBubble); // Space
		this.keyboard.subscribe('13', preventBubble); // Enter
	}

	getGamesStatus(): Record<string, string> {
		if (!this.games) {
			return {};
		}
		return Object.keys(this.games).reduce(
			(gamesStatusList, gameName) => {
				const game = this.games[gameName];
				return {
					...gamesStatusList,
					[gameName]: this.isGameValidation(game) ? game.errorMessage : 'success',
				};
			},
			{} as Record<string, string>,
		);
	}

	getGameByName(gameName: string): [string, ExtendedGame | GameValidation] {
		if (!gameName || !this.games || !Object.keys(this.games).length) {
			return ['', {} as ExtendedGame];
		}
		return [gameName, this.games[gameName] as ExtendedGame];
	}

	selectGame(gameName: string): void {
		if (!gameName) return;

		const [GameName, Game] = this.getGameByName(gameName);
		if (!GameName || !Game || this.isGameValidation(Game)) return;

		this.game = Game;
		this.gameName = gameName;

		// on click escape show menu if game is running
		this.keyboard.subscribe('27', () => { // Escape
			const state = this._store.getState();
			const gameStopped = state.get('gameStopped');

			if (!gameStopped) {
				this.showMenu();
			}
		});

		// add methods of kit into game
		Game.loadKit(this);

		// update controls help accessible through infoOptions component
		if (Game.controls) {
			this.setControlsDescription(Game.controls);
		}

		this.gameStatus.setGameSelected(GameName);
	}

	setControlsDescription(controls: Controls): void {
		this.gameStatus.setControlsDescription(controls);
	}

	enableCountdown(): { setTime: (time?: number) => void; stop: () => void; continue: () => void } {
		this.countdown = new Countdown(this);
		this.countdown.enable(this.gameName || '');
		return {
			setTime: this.countdown.setTime.bind(this.countdown, this.gameName || ''),
			stop: this.countdown.stop.bind(this.countdown, this.gameName || ''),
			continue: this.countdown.stop.bind(this.countdown, this.gameName || ''),
		};
	}

	enableCatchables(): { set: (n: number) => void; decrease: () => void } {
		this.catchables = new Catchables(this);
		this.catchables.enable(this.gameName || '');
		return {
			set: this.catchables.set.bind(this.catchables, this.gameName || ''),
			decrease: this.catchables.decrease.bind(this.catchables, this.gameName || ''),
		};
	}

	load(element: HTMLElement): void {
		if (this.game) {
			this.game.renderOn(element);
			this.start();
		} else {
			// eslint-disable-next-line no-console
			console.warn('load::game not found');
		}
	}

	start(): void {
		if (!this.game) {
			return;
		}

		this.gameStatus.startGame();
		this.game.startRender();

		if (this.countdown) {
			this.countdown.start(this.gameName || '');
		}
	}

	stop(): void {
		if (!this.game) {
			return;
		}

		this.gameStatus.stopGame();
		this.game.stopRender();

		if (this.countdown) {
			this.countdown.stop(this.gameName || '');
		}
	}

	continue(): void {
		if (!this.game) {
			return;
		}

		this.gameStatus.continueGame();
		this.game.startRender();
		if (this.countdown) {
			this.countdown.continue(this.gameName || '');
		}
	}

	toggleStartGame(cbContinue: (() => void)[] = [], cbStop: (() => void)[] = []): void {
		const gameStopped = this._store.getState().get('gameStopped');
		if (gameStopped) {
			this.continue();
			parseArray(cbContinue).forEach(executeFunction);
		} else {
			this.stop();
			cbContinue.forEach(executeFunction);
			parseArray(cbStop).forEach(executeFunction);
		}
	}

	showMenu(): void {
		this.stop();
		this.ui.showMenu();
	}

	hideMenu(): void {
		this.ui.hideMenu();
	}

	pauseGameAndShowGamesList(): void {
		this.stop();
		this.gameStatus.setGameSelected(); // Clear game selection
		this.ui.hideMenu();
		if (this.game) {
			this.game.stopRender();
		}
		this.game = undefined;
		this.gameName = undefined;
	}

	showControls(): void {
		this.ui.showControls();
	}

	hideControls(): void {
		this.ui.hideControls();
	}

	won(): void {
		this.gameStatus.gameWon();
	}

	lost(): void {
		this.gameStatus.gameLost();
	}

	setGameContainerSize(width: number, height: number): void {
		if (this.game) {
			this.game.setSize(width, height);
		} else {
			// eslint-disable-next-line no-console
			console.warn('setGameContainerSize::game not found');
		}
	}

	showPopup(): void {
		this.ui.showPopup();
	}

	hidePopup(): void {
		this.ui.hidePopup();
	}

	reload(): void {
		window.location.reload();
	}

	endOfGame(result: boolean): void {
		return result ? this.won() : this.lost();
	}
}
