import {
	START_COUNTDOWN,
	STOP_COUNTDOWN,
	CONTINUE_COUNTDOWN,
	SET_COUNTDOWN_TIME,
	DECREMENT_COUNTDOWN_TIME,
	ENABLE_COUNTDOWN,
} from './constants';

export function startCountdown(gameName) {
	return {
		type: START_COUNTDOWN,
		gameName,
	};
}

export function stopCountdown(gameName) {
	return {
		type: STOP_COUNTDOWN,
		gameName,
	};
}

export function continueCountdown(gameName) {
	return {
		type: CONTINUE_COUNTDOWN,
		gameName,
	};
}

export function setCountdownTime(gameName, time) {
	return {
		type: SET_COUNTDOWN_TIME,
		time,
		gameName,
	};
}

export function decrementCountdownTime(gameName) {
	return {
		type: DECREMENT_COUNTDOWN_TIME,
		gameName,
	};
}

export function enableCountdown(gameName) {
	return {
		type: ENABLE_COUNTDOWN,
		gameName,
	};
}
