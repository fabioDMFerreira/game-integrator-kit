import { Map } from 'immutable';

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
	case SHOW_POPUP:
		return state.set('showPopup', true);
	case HIDE_POPUP:
		return state.set('showPopup', false);
	case SET_POPUP_CONTENT:
		return state.set('popupContent', action.content);
	case SET_POPUP_TITLE:
		return state.set('popupTitle', action.title);
	case SET_POPUP_STATUS:
		return state.set('popupStatus', action.status);
	default:
		return state;
	}
}
