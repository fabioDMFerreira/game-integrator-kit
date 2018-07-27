import {
	SHOW_MENU,
	SHOW_CONTROLS,
	HIDE_MENU,
	HIDE_CONTROLS,
	SHOW_POPUP,
	HIDE_POPUP,
	SET_POPUP_CONTENT,
	SET_POPUP_TITLE,
	SET_POPUP_STATUS,
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

export function showPopup() {
	return {
		type: SHOW_POPUP,
	};
}

export function hidePopup() {
	return {
		type: HIDE_POPUP,
	};
}

export function setPopupContent(content) {
	return {
		type: SET_POPUP_CONTENT,
		content,
	};
}

export function setPopupTitle(title) {
	return {
		type: SET_POPUP_TITLE,
		title,
	};
}

export function setPopupStatus(status) {
	return {
		type: SET_POPUP_STATUS,
		status,
	};
}
