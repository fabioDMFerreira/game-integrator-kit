export default class Game {
	render() {
		throw new Error('render should be implemented.');
	}

	stopRender() {
		throw new Error('stopRender should be implemented.');
	}

	setSize() {
		throw new Error('setSize should be implemented.');
	}

	/**
     * Should set html element where game will be rendered
     */
	renderOn() {
		throw new Error('renderOn should be implemented. This method should set html element where game will be rendered');
	}
}
