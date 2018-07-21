import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime, enableCountdown } from './actions';

export default class Countdown {
	constructor(Kit) {
		this.store = Kit.store;
		this.endOfGame = Kit.endOfGame.bind(Kit);
		this.timer = null;
	}

	setTime(gameName, time) {
		this.store.dispatch(setCountdownTime(gameName, time));
	}

	checkCountdownEnd(gameName) {
		const state = this.store.getState(),
			countdownTime = state.getIn(['gameState', gameName, 'countdownTime']);

		return !countdownTime;
	}

	checkCountdownIsStopped(gameName) {
		const state = this.store.getState(),
			countdownStopped = state.getIn(['gameState', gameName, 'countdownStopped']);

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
	decrementTime(gameName) {
		if (this.checkCountdownEnd(gameName)) {
			this.endOfGame();
			return false;
		} else if (this.checkCountdownIsStopped(gameName)) {
			return false;
		}

		this.store.dispatch(decrementCountdownTime(gameName));
		return true;
	}

	clearTimerAndDecrementTime(gameName) {
		this.clearTimerOfTimeDecrementation(gameName);
		if (this.decrementTime(gameName)) {
			this.waitOneSecondAndDecrementTime(gameName);
		}
	}

	waitOneSecondAndDecrementTime(gameName) {
		if (this.timer) {
			return;
		}
		this.timer = setTimeout(this.clearTimerAndDecrementTime.bind(this, gameName), 1000);
	}

	start(gameName) {
		if (!this.store.getState().getIn(['gameState', gameName, 'countdownTime'])) {
			console.warn('Time of countdown should be set before its start');
			return;
		}
		this.store.dispatch(startCountdown(gameName));
		this.waitOneSecondAndDecrementTime(gameName);
	}

	continue(gameName) {
		this.store.dispatch(continueCountdown(gameName));
		this.waitOneSecondAndDecrementTime(gameName);
	}

	stop(gameName) {
		this.store.dispatch(stopCountdown(gameName));
	}

	enable(gameName) {
		this.store.dispatch(enableCountdown(gameName));
	}
}
