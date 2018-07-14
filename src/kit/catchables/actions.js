import { SET_NUMBER_CATCHABLES, DECREMENT_NUMBER_CATCHABLES, ENABLE_CATCHABLES } from './constants';

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

export function enableCatchables() {
	return {
		type: ENABLE_CATCHABLES,
	};
}
