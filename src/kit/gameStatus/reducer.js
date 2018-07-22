import { Map } from 'immutable';

import {
	START_GAME,
	STOP_GAME,
	CONTINUE_GAME,
	GAME_WON,
	GAME_LOST,
	SET_CONTROLS_DESCRIPTION,
	SET_GAME_SELECTED,
} from './constants';

export default (state = new Map(), action) => {
	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
	case START_GAME:
		return state.merge({
			gameStarted: true,
			gameStopped: false,
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
		if (!action.description || action.description instanceof Object) {
			return state.set('controlsDescription', action.description);
		}
		return state;
	case SET_GAME_SELECTED:
		if (typeof (action.name) === 'string') {
			return state.set('game', action.name);
		}

		return state.set('game', null);

	default:
		return state;
	}
};
