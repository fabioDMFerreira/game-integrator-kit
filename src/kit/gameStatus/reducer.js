import { Map } from 'immutable';

import {
	START_GAME,
	STOP_GAME,
	CONTINUE_GAME,
	GAME_WON,
	GAME_LOST,
	SET_CONTROLS_DESCRIPTION,
} from './constants';

export default (state = new Map(), action) => {
	if (!action || !action.type) {
		return state;
	}

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
			gameWon: false,
		});
	case GAME_WON:
		return state.merge({
			gameWon: true,
			gameLost: false,
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
