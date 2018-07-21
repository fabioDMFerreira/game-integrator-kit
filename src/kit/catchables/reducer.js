import { Map } from 'immutable';
import { SET_NUMBER_CATCHABLES, DECREMENT_NUMBER_CATCHABLES, ENABLE_CATCHABLES } from './constants';

export default function (state = new Map(), action = {}) {
	switch (action.type) {
	case SET_NUMBER_CATCHABLES: {
		if (action.number && typeof action.number === 'number' && action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'numberOfCatchables'], action.number);
		}
		console.warn('setNumberCatchables first parameter must be the game name and the second parameter must be a number');
		return state;
	}
	case DECREMENT_NUMBER_CATCHABLES: {
		if (action.gameName && typeof action.gameName === 'string') {
			const numberOfCatchables = state.getIn(['gameState', action.gameName, 'numberOfCatchables']);
			if (numberOfCatchables === 0) {
				console.warn('numberOfCatchables is 0 in state');
			} else if (!numberOfCatchables) {
				console.warn('numberOfCatchables should be set');
			} else {
				return state.setIn(['gameState', action.gameName, 'numberOfCatchables'], numberOfCatchables - 1);
			}
		}

		return state;
	}
	case ENABLE_CATCHABLES: {
		if (action.gameName && typeof action.gameName === 'string') {
			return state.setIn(['gameState', action.gameName, 'catchablesEnabled'], true);
		}

		return state;
	}
	default: {
		return state;
	}
	}
}
