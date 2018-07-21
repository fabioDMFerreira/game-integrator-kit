import { Map } from 'immutable';

import { START_COUNTDOWN, STOP_COUNTDOWN, SET_COUNTDOWN_TIME, CONTINUE_COUNTDOWN, DECREMENT_COUNTDOWN_TIME, ENABLE_COUNTDOWN } from './constants';

export default function (state = new Map(), action) {
	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
	case START_COUNTDOWN:
		if (action.gameName && typeof action.gameName === 'string') {
			return state.mergeIn(['gameState', action.gameName], {
				countdownStarted: true,
				countdownStopped: false,
			});
		}
		return state;
	case STOP_COUNTDOWN:
		if (action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'countdownStopped'], true);
		}
		return state;
	case CONTINUE_COUNTDOWN:
		if (action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'countdownStopped'], false);
		}
		return state;
	case SET_COUNTDOWN_TIME:
		if (action.time && !Number.isNaN(Number(action.time)) && action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'countdownTime'], Number(action.time));
		}
		console.warn('Countdown game name must be a string and time must be a number');
		return state;
	case DECREMENT_COUNTDOWN_TIME: {
		if (action.gameName && typeof action.gameName === 'string') {
			const time = state.getIn(['gameState', action.gameName, 'countdownTime']);
			if (time) {
				return state.setIn(['gameState', action.gameName, 'countdownTime'], time - 1);
			}
		}

		return state;
	}
	case ENABLE_COUNTDOWN: {
		if (action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'countdownEnabled'], true);
		}
		return state;
	}
	default:
		return state;
	}
}
