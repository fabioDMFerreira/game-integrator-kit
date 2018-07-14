import { Map } from 'immutable';
import { SET_NUMBER_CATCHABLES, DECREMENT_NUMBER_CATCHABLES, ENABLE_CATCHABLES } from './constants';

export default function (state = new Map(), action = {}) {
	switch (action.type) {
	case SET_NUMBER_CATCHABLES: {
		if (action.number && typeof action.number === 'number') {
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
	case ENABLE_CATCHABLES: {
		return state.set('catchablesEnabled', true);
	}
	default: {
		return state;
	}
	}
}
