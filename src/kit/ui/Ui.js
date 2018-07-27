import { showMenu, showControls, hideMenu, hideControls, showPopup, hidePopup, setPopupContent, setPopupTitle, setPopupStatus } from './actions';

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

	setPopupTitle(title) {
		this.store.dispatch(setPopupTitle(title));
	}

	setPopupStatus(status) {
		this.store.dispatch(setPopupStatus(status));
	}

	/**
	 *
	 * @param {string} errorMessage
	 */
	showError(errorMessage) {
		if (errorMessage in popupElements) {
			this.setPopupContent(popupElements[errorMessage].content);
			this.setPopupTitle(popupElements[errorMessage].title);
			this.setPopupStatus(popupElements[errorMessage].status);
		} else {
			this.setPopupContent(errorMessage);
		}

		this.showPopup();
	}
}

