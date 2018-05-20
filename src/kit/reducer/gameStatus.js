import { Map } from 'immutable';

const START_GAME = 'START_GAME',
	STOP_GAME = 'STOP_GAME',
	CONTINUE_GAME = 'CONTINUE_GAME',
	GAME_WON = 'GAME_WON',
	GAME_LOST = 'GAME_LOST',
	SET_CONTROLS_DESCRIPTION = 'SET_CONTROLS_DESCRIPTION';

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

/**
 * Set description of controls that must be used in game.
 * @param {class} description - must be a react component or a function
 */
export function setControlsDescription(description) {
	return {
		type: SET_CONTROLS_DESCRIPTION,
		description,
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
		});
	case CONTINUE_GAME:
		return state.merge({
			gameStopped: false,
		});
	case GAME_LOST:
		return state.merge({
			gameLost: true,
		});
	case GAME_WON:
		return state.merge({
			gameWon: true,
		});
	case SET_CONTROLS_DESCRIPTION:
		if (action.description) {
			return state.set('controlsDescription', action.description);
		}
		console.warn('description is undefined');
		return state;
	default:
		return state;
	}
};
