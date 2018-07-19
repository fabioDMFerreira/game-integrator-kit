import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime, enableCountdown } from './actions';

export default class Countdown {
	constructor(Kit) {
		this.store = Kit.store;
		this.endOfGame = Kit.endOfGame;
		this.timer = null;
	}

	setTime(time) {
		this.store.dispatch(setCountdownTime(time));
	}

	checkCountdownEnd() {
		const state = this.store.getState(),
			countdownTime = state.get('countdownTime');

		return !countdownTime;
	}

	checkCountdownIsStopped() {
		const state = this.store.getState(),
			countdownStopped = state.get('countdownStopped');

		return !!countdownStopped;
	}

	clearTimerOfTimeDecrementation() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	/**
	 * Returns true if time was decremented
	 */
	decrementTime() {
		if (this.checkCountdownEnd()) {
			this.endOfGame();
			return false;
		} else if (this.checkCountdownIsStopped()) {
			return false;
		}

		this.store.dispatch(decrementCountdownTime());
		return true;
	}

	clearTimerAndDecrementTime() {
		this.clearTimerOfTimeDecrementation();
		if (this.decrementTime()) {
			this.waitOneSecondAndDecrementTime();
		}
	}

	waitOneSecondAndDecrementTime() {
		if (this.timer) {
			return;
		}
		this.timer = setTimeout(this.clearTimerAndDecrementTime.bind(this), 1000);
	}

	start() {
		if (!this.store.getState().get('countdownTime')) {
			console.warn('Time of countdown should be set before its start');
			return;
		}
		this.store.dispatch(startCountdown());
		this.waitOneSecondAndDecrementTime();
	}

	continue() {
		this.store.dispatch(continueCountdown());
		this.waitOneSecondAndDecrementTime();
	}

	stop() {
		this.store.dispatch(stopCountdown());
	}

	enable() {
		this.store.dispatch(enableCountdown());
	}
}
