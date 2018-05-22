import { executeFunction, parseArray } from './utils';

describe('kit.utils', () => {
	it('executeFunction should call a function', () => {
		const fn = jest.fn();
		executeFunction(fn);
		expect(fn.mock.calls.length).toBe(1);
	});

	it('executeFunction should throw an error if a function is not passed', () => {
		expect(() => executeFunction()).toThrow();
		expect(() => executeFunction(1)).toThrow();
		expect(() => executeFunction('hello world')).toThrow();
		expect(() => executeFunction({})).toThrow();
		expect(() => executeFunction([])).toThrow();
	});

	it('parseArray should return an array with element passed by parameter', () => {
		let expected = [1],
			actual = parseArray(1);
		expect(actual).toEqual(expected);

		expected = ['hello'];
		actual = parseArray('hello');
		expect(actual).toEqual(expected);

		expected = [{}];
		actual = parseArray({});
		expect(actual).toEqual(expected);
	});

	it('parseArray should return the first parameter if it is an array', () => {
		let expected = [1],
			actual = parseArray([1]);
		expect(actual).toEqual(expected);

		expected = ['hello'];
		actual = parseArray(['hello']);
		expect(actual).toEqual(expected);

		expected = [{}];
		actual = parseArray([{}]);
		expect(actual).toEqual(expected);
	});
});
