export const SET_NUMBER_CATCHABLES = 'SET_NUMBER_CATCHABLES',
	DECREMENT_NUMBER_CATCHABLES = 'DECREMENT_NUMBER_CATCHABLES';

export function setNumberCatchables(number) {
	return {
		type: SET_NUMBER_CATCHABLES,
		number,
	};
}

export function decrementNumberCatchables() {
	return {
		type: DECREMENT_NUMBER_CATCHABLES,
	};
}
