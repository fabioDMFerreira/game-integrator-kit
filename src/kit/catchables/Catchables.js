import { setNumberCatchables, decrementNumberCatchables, enableCatchables } from './actions';

export default class Catchables {
	constructor(Kit) {
		this.store = Kit.store;
	}

	/**
     * Set on state number of catchable objects
	 * @param {string} gameName
     * @param {number} n
     */
	set(gameName, n) {
		this.store.dispatch(setNumberCatchables(gameName, n));
	}

	/**
     * Decrease value one in number of catchable objects. This method should be called
     * when a catchable element is catched.
	 * @param {string} gameName
     */
	decrease(gameName) {
		this.store.dispatch(decrementNumberCatchables(gameName));
	}

	/**
	 * @param {string} gameName
	 */
	enable(gameName) {
		this.store.dispatch(enableCatchables(gameName));
	}
}
