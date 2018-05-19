import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime } from './state';

export default class Coundown {
	constructor(store, endOfGame) {
		this.store = store;
		this.endOfGame = endOfGame;
	}

	setTime(time) {
		this.store.dispatch(setCountdownTime(time));
	}

	decrement() {
		const state = this.store.getState(),
			countdownTime = state.get('countdownTime'),
			countdownStopped = state.get('countdownStopped');

		if (countdownStopped) {
			return;
		}

		this.store.dispatch(decrementCountdownTime());

		if (!countdownTime) {
			this.endOfGame();
		}

		setTimeout(() => {
			this.decrement();
		}, 1000);
	}

	start() {
		if (!this.store.getState().get('countdownTime')) {
			console.warn('Time of countdown should be set before its start');
		}
		this.store.dispatch(startCountdown());
		this.decrement();
	}

	continue() {
		this.store.dispatch(continueCountdown());
		this.decrement();
	}

	stop() {
		this.store.dispatch(stopCountdown());
	}
}
