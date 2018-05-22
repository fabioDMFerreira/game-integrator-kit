import { executeFunction, parseArray } from './utils';

describe('kit.utils', () => {
	it('executeFunction should call a function', () => {
		expect(executeFunction(() => {})).toBe(1);
	});

	it('parseArray should return an array with element passed by parameter', () => {
		const expected = [1],
			actual = parseArray(1);
		expect(actual).toEqual(expected);
	});
});
