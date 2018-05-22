import { Map } from 'immutable';

import state, { showMenu, showControls, hideMenu, hideControls } from './state';

describe('ui.state', () => {
	it('should return a empty Map if no parameter is passed', () => {
		expect(state()).toBe(new Map());
	});

	it('should return state as it is passed by parameter if no action is passed', () => {
		let expected = new Map({ a: 1 }),
			actual = state(expected);
		expect(actual).toBe(expected);

		expected = { a: 1 };
		actual = state(expected);
		expect(actual).toBe(expected);
	});

	it('should add showMenu value true to state', () => {
		const expected = new Map({ showMenu: true }),
			actual = state(undefined, showMenu());
		expect(actual).toEqual(expected);
	});

	it('should add showControls value true to state', () => {
		const expected = new Map({ showControls: true }),
			actual = state(undefined, showControls());
		expect(actual).toEqual(expected);
	});

	it('should add showMenu value false to state', () => {
		const expected = new Map({ showMenu: false }),
			actual = state(undefined, hideMenu());
		expect(actual).toEqual(expected);
	});

	it('should add showControls value false to state', () => {
		const expected = new Map({ showControls: false }),
			actual = state(undefined, hideControls());
		expect(actual).toEqual(expected);
	});

	it('should throw an error if state is null', () => {
		expect(() => state(null, showMenu())).toThrow();
	});
});
