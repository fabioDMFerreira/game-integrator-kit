import { Map, fromJS } from 'immutable';

import reducer from '../reducer';
import { setNumberCatchables, decrementNumberCatchables, enableCatchables } from '../actions';


describe('Catchables reducer', () => {
	it('should return a empty Map if no parameter is passed', () => {
		expect(reducer()).toEqual(new Map());
	});

	it('action SET_NUMBER_CATCHABLES should update number of catchables in state', () => {
		const expected = fromJS({ gameState: { game1: { numberOfCatchables: 10 } } }),
			actual = reducer(undefined, setNumberCatchables('game1', 10));

		expect(actual).toEqual(expected);
	});

	it('action SET_NUMBER_CATCHABLES should not update number of catchables in state if parameter passed is not a number', () => {
		let expected = new Map(),
			actual = reducer(undefined, setNumberCatchables('game1', 'hello'));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables('game1', '10'));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables('game1', undefined));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables('game1', {}));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables(1234, 10));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables({}, 10));

		expect(actual).toEqual(expected);

		expected = new Map();
		actual = reducer(undefined, setNumberCatchables(() => {}, 10));

		expect(actual).toEqual(expected);
	});

	it('action DECREMENT_NUMBER_CATCHABLES should decrement number of catchables in state if it is a number greater than 0', () => {
		let state = fromJS({ gameState: { game1: { numberOfCatchables: 10 } } }),
			expected = fromJS({ gameState: { game1: { numberOfCatchables: 9 } } }),
			actual = reducer(state, decrementNumberCatchables('game1'));

		expect(actual).toEqual(expected);

		state = new Map();
		expected = new Map();
		actual = reducer(state, decrementNumberCatchables());

		expect(actual).toBe(expected);

		state = new Map({ gameState: { game1: { numberOfCatchables: 0 } } });
		expected = new Map({ gameState: { game1: { numberOfCatchables: 0 } } });
		actual = reducer(state, decrementNumberCatchables('game1'));

		expect(actual).toEqual(expected);

		state = new Map({ gameState: { game1: { numberOfCatchables: 10 } } });
		expected = new Map({ gameState: { game1: { numberOfCatchables: 10 } } });
		actual = reducer(state, decrementNumberCatchables());

		expect(actual).toEqual(expected);

		state = new Map({ gameState: { game1: { numberOfCatchables: 10 } } });
		expected = new Map({ gameState: { game1: { numberOfCatchables: 10 } } });
		actual = reducer(state, decrementNumberCatchables('game2'));

		expect(actual).toEqual(expected);
	});

	it('action ENABLE_CATCHABLES should set catchablesEnabled as true', () => {
		const	expected = fromJS({ gameState: { game1: { catchablesEnabled: true } } }),
			actual = reducer(new Map(), enableCatchables('game1'));

		expect(actual).toEqual(expected);
	});
});
