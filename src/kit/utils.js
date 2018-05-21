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
	if (fn instanceof Function) {
		fn();
		return 1;
	}
	console.warn('fn is not a funtion');
	return 0;
}
