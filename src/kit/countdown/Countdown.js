import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime } from './actions';

export default class Countdown {
	constructor(Kit) {
		this.store = Kit.store;
		this.endOfGame = Kit.endOfGame;
		this.timer = null;
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

		// set a timeout to decrement counter only if there isn't already a timeout defined
		if (!this.timer) {
			this.timer = setTimeout(() => {
				this.timer = null;
				this.decrement();
			}, 1000);
		}
	}

	start() {
		if (!this.store.getState().get('countdownTime')) {
			console.warn('Time of countdown should be set before its start');
			return;
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
