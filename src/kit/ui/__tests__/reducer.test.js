import { Map } from 'immutable';

import { showMenu, showControls, hideMenu, hideControls, setPopupTitle, setPopupStatus } from '../actions';
import reducer from '../reducer';

describe('ui.state', () => {
	it('should return a empty Map if no parameter is passed', () => {
		expect(reducer()).toBe(new Map());
		expect(reducer(undefined, { type: 'DOES_NOT_EXIST' })).toBe(new Map());
	});

	it('should return state as it is passed by parameter if no action is passed', () => {
		let expected = new Map({ a: 1 }),
			actual = reducer(expected);
		expect(actual).toBe(expected);

		expected = { a: 1 };
		actual = reducer(expected);
		expect(actual).toBe(expected);
	});

	it('should add showMenu value true to state', () => {
		const expected = new Map({ showMenu: true }),
			actual = reducer(undefined, showMenu());
		expect(actual).toEqual(expected);
	});

	it('should add showControls value true to state', () => {
		const expected = new Map({ showControls: true }),
			actual = reducer(undefined, showControls());
		expect(actual).toEqual(expected);
	});

	it('should add showMenu value false to state', () => {
		const expected = new Map({ showMenu: false }),
			actual = reducer(undefined, hideMenu());
		expect(actual).toEqual(expected);
	});

	it('should add showControls value false to state', () => {
		const expected = new Map({ showControls: false }),
			actual = reducer(undefined, hideControls());
		expect(actual).toEqual(expected);
	});

	it('should throw an error if state is null', () => {
		expect(() => reducer(null, showMenu())).toThrow();
	});

	it('should set popup title', () => {
		const expected = new Map({ popupTitle: 'hello' }),
			actual = reducer(new Map(), setPopupTitle('hello'));

		expect(actual).toEqual(expected);
	});

	it('should set popup status', () => {
		const expected = new Map({ popupStatus: 'fatal' }),
			actual = reducer(new Map(), setPopupStatus('fatal'));

		expect(actual).toEqual(expected);
	});
});
