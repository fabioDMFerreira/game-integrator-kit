import { Map } from 'immutable';

const START_GAME = 'START_GAME',
	STOP_GAME = 'STOP_GAME',
	CONTINUE_GAME = 'CONTINUE_GAME',
	GAME_WON = 'GAME_WON',
	GAME_LOST = 'GAME_LOST';

export function startGame() {
	return {
		type: START_GAME,
	};
}

export function stopGame() {
	return {
		type: STOP_GAME,
	};
}

export function continueGame() {
	return {
		type: CONTINUE_GAME,
	};
}

export function gameWon() {
	return {
		type: GAME_WON,
	};
}

export function gameLost() {
	return {
		type: GAME_LOST,
	};
}

export default (state = new Map(), action) => {
	switch (action.type) {
	case START_GAME:
		return state.merge({
			gameStarted: true,
			gameWon: false,
			gameLost: false,
		});
	case STOP_GAME:
		return state.merge({
			gameStopped: true,
			showMenu: true,
		});
	case CONTINUE_GAME:
		return state.merge({
			gameStopped: false,
			showMenu: false,
		});
	case GAME_LOST:
		return state.merge({
			gameLost: true,
			showMenu: true,
		});
	case GAME_WON:
		return state.merge({
			gameWon: true,
			showMenu: true,
		});
	default:
		return state;
	}
};
