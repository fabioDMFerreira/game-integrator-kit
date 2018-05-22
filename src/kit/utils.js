/**
 * Returns an array with someObject if it isn't an array
 * @param {Array} someObject
 * @returns {Array}
 */
export function parseArray(someObject) {
	if (someObject instanceof Array) {
		return someObject;
	}
	return [someObject];
}

export function executeFunction(fn) {
	if (typeof (fn) === 'function') {
		return fn();
	}
	throw new Error('fn is not a function');
}
