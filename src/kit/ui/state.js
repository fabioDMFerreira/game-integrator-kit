import { Map } from 'immutable';

const SHOW_MENU = 'SHOW_MENU',
	SHOW_CONTROLS = 'SHOW_CONTROLS',
	HIDE_MENU = 'HIDE_MENU',
	HIDE_CONTROLS = 'HIDE_CONTROLS';

export function showMenu() {
	return {
		type: SHOW_MENU,
	};
}

export function showControls() {
	return {
		type: SHOW_CONTROLS,
	};
}

export function hideMenu() {
	return {
		type: HIDE_MENU,
	};
}

export function hideControls() {
	return {
		type: HIDE_CONTROLS,
	};
}

export default function (state = new Map(), action = {}) {
	if (state === null) {
		throw new Error('state should not be null');
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
