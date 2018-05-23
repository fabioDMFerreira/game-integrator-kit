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
