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

export default function (state = new Map(), action) {
	switch (action.type) {
	case SET_NUMBER_CATCHABLES: {
		if (action.number && !Number.isNaN(action.number)) {
			return state.set('numberOfCatchables', action.number);
		}
		console.warn('setNumberCatchables first parameter should be a number');
		return state;
	}
	case DECREMENT_NUMBER_CATCHABLES: {
		const numberOfCatchables = state.get('numberOfCatchables');
		if (numberOfCatchables === 0) {
			console.warn('numberOfCatchables is 0 in state');
		} else if (!numberOfCatchables) {
			console.warn('numberOfCatchables should be set');
		} else {
			return state.set('numberOfCatchables', numberOfCatchables - 1);
		}
		return state;
	}
	default: {
		return state;
	}
	}
}
