import { SET_NUMBER_CATCHABLES, DECREMENT_NUMBER_CATCHABLES, ENABLE_CATCHABLES } from './constants';

export function setNumberCatchables(gameName, number) {
	return {
		type: SET_NUMBER_CATCHABLES,
		number,
		gameName,
	};
}

export function decrementNumberCatchables(gameName) {
	return {
		type: DECREMENT_NUMBER_CATCHABLES,
		gameName,
	};
}

export function enableCatchables(gameName) {
	return {
		type: ENABLE_CATCHABLES,
		gameName,
	};
}
