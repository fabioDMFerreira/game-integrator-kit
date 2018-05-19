import { Map } from 'immutable';

const START_COUNTDOWN = 'START_COUNTDOWN',
	STOP_COUNTDOWN = 'STOP_COUNTDOWN',
	CONTINUE_COUNTDOWN = 'CONTINUE_COUNTDOWN',
	SET_COUNTDOWN_TIME = 'SET_COUNTDOWN_TIME',
	DECREMENT_COUNTDOWN_TIME = 'DECREMENT_COUNTDOWN_TIME';

export function startCountdown() {
	return {
		type: START_COUNTDOWN,
	};
}

export function stopCountdown() {
	return {
		type: STOP_COUNTDOWN,
	};
}

export function continueCountdown() {
	return {
		type: CONTINUE_COUNTDOWN,
	};
}

export function setCountdownTime(time) {
	return {
		type: SET_COUNTDOWN_TIME,
		time,
	};
}

export function decrementCountdownTime() {
	return {
		type: DECREMENT_COUNTDOWN_TIME,
	};
}

export default function (state = new Map(), action) {
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
		if (action.time && !Number.isNaN(action.time)) {
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
