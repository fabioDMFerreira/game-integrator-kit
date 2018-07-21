import { Map, fromJS } from 'immutable';

import Countdown from '../Countdown';
import * as actions from '../actions';

class MockKit {
	constructor() {
		this.state = new Map();

		this.store = {
			dispatch: jest.fn(),
		};

		this.store.getState = function getState() {
			return this.state;
		}.bind(this);

		this.endOfGame = jest.fn();
	}
}

let mockKit,
	decrementCountdownTimeSpy;

function getCountdown(gameName, data) {
	mockKit.state = fromJS({
		gameState: {
			[gameName]: data,
		},
	});
	return new Countdown(mockKit);
}

function getCountdownWithTime(gameName, countdownTime) {
	mockKit.state = fromJS({
		gameState: {
			[gameName]: {
				countdownTime,
			},
		},
	});
	return new Countdown(mockKit);
}


function getCountdownWithStatusStopped(gameName, countdownStopped) {
	mockKit.state = fromJS({
		gameState: {
			[gameName]: {
				countdownStopped,
			},
		},
	});
	return new Countdown(mockKit);
}

describe('Countdown', () => {
	beforeAll(() => {
		decrementCountdownTimeSpy = jest.spyOn(actions, 'decrementCountdownTime', 'set');
	});

	beforeEach(() => {
		mockKit = new MockKit();
		decrementCountdownTimeSpy.mockReset();
	});

	it('setTime should dispatch an action that updates countdown time', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'setCountdownTime', 'set');

		countdown.setTime('game1', 300);

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
		expect(spy.mock.calls[0][0]).toBe('game1');
		expect(spy.mock.calls[0][1]).toBe(300);
	});

	it('stop should dispatch an action that updates countdown status', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'stopCountdown', 'set');

		countdown.stop('game1');

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls[0][0]).toBe('game1');
		expect(spy.mock.calls.length).toBe(1);
	});

	it('start should dispatch an action that updates countdown status and start to decrement countdown if countdown time was set', () => {
		mockKit.state = fromJS({ gameState: { game1: { countdownTime: 300 } } });
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'startCountdown', 'set');

		expect(countdown.store.getState()).toBe(mockKit.state);

		countdown.waitOneSecondAndDecrementTime = jest.fn();
		countdown.start('game1');

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
		expect(spy.mock.calls[0][0]).toBe('game1');
		expect(countdown.waitOneSecondAndDecrementTime.mock.calls.length).toBe(1);
		spy.mockReset();
		spy.mockRestore();
	});

	it('start should not dispatch an action that updates countdown status and start to decrement countdown if countdown time was not set', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'startCountdown', 'set');

		expect(countdown.store.getState()).toBe(mockKit.state);

		countdown.decrement = jest.fn();
		countdown.start('game1');

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(0);
		expect(spy.mock.calls.length).toBe(0);
		expect(countdown.decrement.mock.calls.length).toBe(0);

		spy.mockReset();
		spy.mockRestore();
	});

	it('continue should dispatch an action that updates countdown status and start to decrement countdown', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'continueCountdown', 'set');

		countdown.waitOneSecondAndDecrementTime = jest.fn();
		countdown.continue('game1');

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
		expect(spy.mock.calls[0][0]).toBe('game1');
		expect(countdown.waitOneSecondAndDecrementTime.mock.calls.length).toBe(1);
	});

	it('decrementTime should end the game if it was not set a time', () => {
		jest.useFakeTimers();
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(countdown, 'endOfGame');
		countdown.decrementTime('game1');

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('checkCountdownEnd should return true if countdown time does not exist or is zero', () => {
		const gameName = 'game1';

		let countdown;

		countdown = getCountdownWithTime(gameName, 0);
		expect(countdown.checkCountdownEnd(gameName)).toBe(true);

		countdown = getCountdownWithTime(gameName, null);
		expect(countdown.checkCountdownEnd(gameName)).toBe(true);

		countdown = getCountdownWithTime(gameName, undefined);
		expect(countdown.checkCountdownEnd(gameName)).toBe(true);

		countdown = getCountdownWithTime(gameName, 1);
		expect(countdown.checkCountdownEnd(gameName)).toBe(false);
	});

	it('checkCountdownIsStopped should return true if countdown is stopped', () => {
		const gameName = 'game1';

		let countdown;

		countdown = getCountdownWithStatusStopped(gameName, true);
		expect(countdown.checkCountdownIsStopped(gameName)).toBe(true);

		countdown = getCountdownWithStatusStopped(gameName, true);
		expect(countdown.checkCountdownIsStopped(gameName)).toBe(true);
	});

	it('decrementTime should return true if time was decremented and countdown should be decremented while countdown time is different from 0 in state', () => {
		const gameName = 'game1',
			spy = decrementCountdownTimeSpy;
		let countdown;

		countdown = getCountdownWithTime(gameName, 10);
		expect(countdown.decrementTime(gameName)).toBe(true);
		expect(spy.mock.calls.length).toBe(1);

		countdown = getCountdownWithTime(gameName, 5);
		expect(countdown.decrementTime(gameName)).toBe(true);
		expect(spy.mock.calls.length).toBe(2);

		countdown = getCountdownWithTime(gameName, 0);
		expect(countdown.decrementTime(gameName)).toBe(false);
		expect(spy.mock.calls.length).toBe(2);
	});

	it('decrementTime should not decrement time if countdown is stopped', () => {
		let countdown;
		const spy = decrementCountdownTimeSpy;

		countdown = getCountdown({ countdownTime: 10, countdownStopped: true });
		expect(countdown.decrementTime()).toBe(false);
		expect(spy.mock.calls.length).toBe(0);


		countdown = getCountdown({ countdownTime: 0, countdownStopped: true });
		expect(countdown.decrementTime()).toBe(false);
		expect(spy.mock.calls.length).toBe(0);
	});

	it('clearTimerOfTimeDecrementation should clear timeout of time decrementation if it exists', () => {
		const countdown = new Countdown(mockKit);

		jest.useFakeTimers();

		countdown.timer = setTimeout(() => { }, 1000);
		countdown.clearTimerOfTimeDecrementation();
		expect(clearTimeout).toHaveBeenCalledTimes(1);

		countdown.clearTimerAndDecrementTime();
		expect(clearTimeout).toHaveBeenCalledTimes(1);
	});

	it('clearTimerAndDecrementTime should call clearTimerOfTimeDecrementation and decrement time.', () => {
		const countdown = new Countdown(mockKit),
			spyClearTimer = jest.spyOn(countdown, 'clearTimerAndDecrementTime', 'set'),
			spyDecrementTime = jest.spyOn(countdown, 'decrementTime', 'set');

		countdown.clearTimerAndDecrementTime();

		expect(spyClearTimer).toHaveBeenCalled();
		expect(spyDecrementTime).toHaveBeenCalled();
	});

	it('clearTimerAndDecrementTime should call function that set timeout to decrement time if time was decremented.', () => {
		let countdown,
			spy;

		countdown = getCountdown();
		countdown.decrementTime = () => true;
		spy = jest.spyOn(countdown, 'waitOneSecondAndDecrementTime', 'set');
		countdown.clearTimerAndDecrementTime();
		expect(spy).toHaveBeenCalledTimes(1);

		countdown = getCountdown();
		countdown.decrementTime = () => false;
		spy = jest.spyOn(countdown, 'waitOneSecondAndDecrementTime', 'set');
		countdown.clearTimerAndDecrementTime();
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it('waitOneSecondAndDecrementTime should set a timeout to clear timer and decrement time if timer is not already running', () => {
		const countdown = getCountdown(),
			spy = jest.spyOn(countdown, 'clearTimerAndDecrementTime', 'set');

		jest.useFakeTimers();

		countdown.waitOneSecondAndDecrementTime();

		expect(setTimeout).toHaveBeenCalledTimes(1);

		countdown.waitOneSecondAndDecrementTime();

		expect(setTimeout).toHaveBeenCalledTimes(1);

		jest.runTimersToTime(1000);

		expect(spy).toHaveBeenCalledTimes(1);
	});
});
