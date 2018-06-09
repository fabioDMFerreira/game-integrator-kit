import { Map } from 'immutable';

import { START_COUNTDOWN, STOP_COUNTDOWN, SET_COUNTDOWN_TIME, CONTINUE_COUNTDOWN, DECREMENT_COUNTDOWN_TIME } from './constants';

export default function (state = new Map(), action) {
	if (!action || !action.type) {
		return state;
	}

	switch (action.type) {
	case START_COUNTDOWN:
		return state.merge({
			countdownStarted: true,
			countdownStopped: false,
		});
	case STOP_COUNTDOWN:
		return state.set('countdownStopped', true);
	case CONTINUE_COUNTDOWN:
		return state.set('countdownStopped', false);
	case SET_COUNTDOWN_TIME:
		if (action.time && !Number.isNaN(Number(action.time))) {
			return state.set('countdownTime', Number(action.time));
		}
		console.warn('Countdown time should be a number');
		return state;
	case DECREMENT_COUNTDOWN_TIME: {
		const time = state.get('countdownTime');
		if (time) {
			return state.set('countdownTime', time - 1);
		}
		return state;
	}
	default:
		return state;
	}
}
