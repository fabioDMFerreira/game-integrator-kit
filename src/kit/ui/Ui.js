import { showMenu, showControls, hideMenu, hideControls } from './actions';

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
}

