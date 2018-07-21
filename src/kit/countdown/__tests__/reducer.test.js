import { Map, fromJS } from 'immutable';

import reducer from '../reducer.js';
import { startCountdown, stopCountdown, continueCountdown, setCountdownTime, decrementCountdownTime, enableCountdown } from '../actions';

describe('Countdown reducer', () => {
	it('setIn should update nested objects', () => {
		const state = fromJS({
				gameState: {
					game1: {
						catchablesEnabled: true,
					},
				},
			}),
			actual = state.setIn(['gameState', 'game1', 'time'], 100),
			expected = fromJS({
				gameState: {
					game1: {
						catchablesEnabled: true,
						time: 100,
					},
				},
			});

		expect(actual).toEqual(expected);
	});

	it('should return empty state if any action is passed', () => {
		let actual = reducer(),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, { type: 'DOES_NOT_EXIST' });
		expected = new Map();

		expect(actual).toEqual(expected);
	});

	it('on START_COUNTDOWN it should update countdownStarted and countdownStopped properties if a game name is passed', () => {
		let actual = reducer(undefined, startCountdown()),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, startCountdown('game1'));
		expected = fromJS({
			gameState: {
				game1: { countdownStarted: true, countdownStopped: false },
			},
		});

		expect(actual).toEqual(expected);
	});

	it('on STOP_COUNTDOWN it should update countdownStopped property if a game name is passed', () => {
		let actual = reducer(undefined, stopCountdown()),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, stopCountdown('game1'));
		expected = fromJS({ gameState: { game1: { countdownStopped: true } } });

		expect(actual).toEqual(expected);
	});

	it('on CONTINUE_COUNTDOWN it should update countdownStopped property if a game name is passed', () => {
		let actual = reducer(undefined, continueCountdown()),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, continueCountdown('game1'));
		expected = fromJS({ gameState: { game1: { countdownStopped: false } } });

		expect(actual).toEqual(expected);
	});

	it('on SET_COUNTDOWN_TIME it should set countdownTime if time is a number if a gameName is passed', () => {
		let actual,
			expected;

		actual = reducer(undefined, setCountdownTime(10));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('10'));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('game1', 10));
		expected = fromJS({ gameState: { game1: { countdownTime: 10 } } });
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('game1', '10'));
		expected = fromJS({ gameState: { game1: { countdownTime: 10 } } });
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime('test'));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(undefined, setCountdownTime({}));
		expected = new Map();
		expect(actual).toEqual(expected);
	});

	it('on SET_COUNTDOWN_TIME it should set countdownTime if time is a number and game name is a string', () => {
		let actual,
			expected;

		actual = reducer(undefined, decrementCountdownTime(10));
		expected = new Map();
		expect(actual).toEqual(expected);

		actual = reducer(new Map({ countdownTime: 0 }), decrementCountdownTime());
		expected = new Map({ countdownTime: 0 });
		expect(actual).toEqual(expected);

		actual = reducer(fromJS({ gameState: { game1: { countdownTime: 0 } } }), decrementCountdownTime('game1'));
		expected = fromJS({ gameState: { game1: { countdownTime: 0 } } });
		expect(actual).toEqual(expected);


		actual = reducer(fromJS({ gameState: { game1: { countdownTime: 10 } } }), decrementCountdownTime('game1'));
		expected = fromJS({ gameState: { game1: { countdownTime: 9 } } });
		expect(actual).toEqual(expected);
	});

	it('on ENABLE_COUNTDOWN it should set countdownEnabled as true', () => {
		let actual = reducer(new Map(), enableCountdown()),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(new Map(), enableCountdown('game1'));
		expected = fromJS({ gameState: { game1: { countdownEnabled: true } } });


		expect(actual).toEqual(expected);
	});
});
