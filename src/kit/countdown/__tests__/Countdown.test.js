import Countdown from '../Countdown';
import * as actions from '../actions';

let mockKit;

describe('Countdown', () => {
	beforeEach(() => {
		mockKit = {
			store: {
				dispatch: jest.fn(),
			},
		};
	});

	it('setTime should dispatch an action that updates countdown time', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'setCountdownTime', 'set');

		countdown.setTime(300);

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
		expect(spy.mock.calls[0][0]).toBe(300);
	});

	it('stop should dispatch an action that updates countdown status', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'stopCountdown', 'set');

		countdown.stop();

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
	});

	// it('start should dispatch an action that updates countdown status and start to decrement countdown', () => {
	// 	const countdown = new Countdown(mockKit),
	// 		spy = jest.spyOn(actions, 'startCountdown', 'set');

	// 	countdown.decrement = jest.fn();
	// 	countdown.start();

	// 	expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
	// 	expect(spy.mock.calls.length).toBe(1);
	// 	expect(countdown.decrement.mock.calls.length).toBe(1);
	// });

	it('continue should dispatch an action that updates countdown status and start to decrement countdown', () => {
		const countdown = new Countdown(mockKit),
			spy = jest.spyOn(actions, 'continueCountdown', 'set');

		countdown.decrement = jest.fn();
		countdown.continue();

		expect(countdown.store.dispatch).toHaveBeenCalledTimes(1);
		expect(spy.mock.calls.length).toBe(1);
		expect(countdown.decrement.mock.calls.length).toBe(1);
	});
});
