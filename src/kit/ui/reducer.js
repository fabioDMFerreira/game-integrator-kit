import { Map } from 'immutable';

import { SHOW_MENU, SHOW_CONTROLS, HIDE_MENU, HIDE_CONTROLS } from './constants';

export default function (state = new Map(), action = {}) {
	if (state === null) {
		throw new Error('state should not be null');
	} else if (!action.type) {
		return state;
	}

	switch (action.type) {
	case SHOW_MENU:
		return state.set('showMenu', true);
	case SHOW_CONTROLS:
		return state.set('showControls', true);
	case HIDE_MENU:
		return state.set('showMenu', false);
	case HIDE_CONTROLS:
		return state.set('showControls', false);
	default:
		return state;
	}
}
