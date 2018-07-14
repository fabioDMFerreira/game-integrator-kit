import { showMenu, showControls, hideMenu, hideControls, showPopup, hidePopup, setPopupContent } from './actions';

import popupElements from './errorMessages/popupElements';

export default class GameStatus {
	constructor(Kit) {
		this.store = Kit.store;
	}

	showMenu() {
		this.store.dispatch(showMenu());
	}

	showControls() {
		this.store.dispatch(showControls());
	}

	hideMenu() {
		this.store.dispatch(hideMenu());
	}

	hideControls() {
		this.store.dispatch(hideControls());
	}

	showPopup() {
		this.store.dispatch(showPopup());
	}

	hidePopup() {
		this.store.dispatch(hidePopup());
	}

	/**
	 *
	 * @param {element} content
	 */
	setPopupContent(content) {
		this.store.dispatch(setPopupContent(content));
	}

	/**
	 *
	 * @param {string} errorMessage
	 */
	showError(errorMessage) {
		if (errorMessage in popupElements) {
			this.setPopupContent(popupElements[errorMessage]);
		} else {
			this.setPopupContent(errorMessage);
		}

		this.showPopup();
	}
}

