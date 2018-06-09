import {
	SHOW_MENU,
	SHOW_CONTROLS,
	HIDE_MENU,
	HIDE_CONTROLS,
} from './constants';

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
