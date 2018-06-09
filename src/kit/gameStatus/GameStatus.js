import { startGame, stopGame, continueGame, gameWon, gameLost, setControlsDescription } from './actions';

export default class GameStatus {
	constructor(Kit) {
		this.store = Kit.store;
	}

	startGame() {
		this.store.dispatch(startGame());
	}

	stopGame() {
		this.store.dispatch(stopGame());
	}

	continueGame() {
		this.store.dispatch(continueGame());
	}

	gameWon() {
		this.store.dispatch(gameWon());
	}

	gameLost() {
		this.store.dispatch(gameLost());
	}

	/**
 * Set description of controls that must be used in game.
 * @param {class} description - must be a react component or a function
 */
	setControlsDescription(description) {
		this.store.dispatch(setControlsDescription(description));
	}
}

