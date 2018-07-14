import { Map } from 'immutable';

import reducer from '../reducer.js';
import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime, enableCountdown } from '../actions';

describe('Countdown reducer', () => {
	it('should return empty state if any action is passed', () => {
		let actual = reducer(),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, { type: 'DOES_NOT_EXIST' });
		expected = new Map();

		expect(actual).toEqual(expected);
	});

	it('on START_COUNTDOWN it should update countdownStarted and countdownStopped properties', () => {
		const actual = reducer(undefined, startCountdown()),
			expected = new Map({ countdownStarted: true, countdownStopped: false });

		expect(actual).toEqual(expected);
	});

	it('on STOP_COUNTDOWN it should update countdownStopped property', () => {
		const actual = reducer(undefined, stopCountdown()),
			expected = new Map({ countdownStopped: true });

		expect(actual).toEqual(expected);
	});

	it('on CONTINUE_COUNTDOWN it should update countdownStopped property', () => {
		const actual = reducer(undefined, continueCountdown()),
			expected = new Map({ countdownStopped: false });

		expect(actual).toEqual(expected);
	});

	it('on SET_COUNTDOWN_TIME it should set countdownTime if time is a number', () => {
		let actual,
			expected;

		actual = reducer(undefined, setCountdownTime(10));
		expected = new Map({ countdownTime: 10 });
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('10'));
		expected = new Map({ countdownTime: 10 });
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('test'));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime({}));
		expected = new Map();
		expect(actual).toEqual(expected);
	});

	it('on SET_COUNTDOWN_TIME it should set countdownTime if time is a number', () => {
		let actual,
			expected;

		actual = reducer(undefined, decrementCountdownTime(10));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(new Map({ countdownTime: 0 }), decrementCountdownTime());
		expected = new Map({ countdownTime: 0 });
		expect(actual).toEqual(expected);

		actual = reducer(new Map({ countdownTime: 10 }), decrementCountdownTime());
		expected = new Map({ countdownTime: 9 });
		expect(actual).toEqual(expected);
	});

	it('on ENABLE_COUNTDOWN it should set countdownEnabled as true', () => {
		const actual = reducer(new Map(), enableCountdown()),
			expected = new Map({ countdownEnabled: true });

		expect(actual).toEqual(expected);
	});
});
