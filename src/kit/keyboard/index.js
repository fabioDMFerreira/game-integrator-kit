export default class Keyboard {
	// map = {
	//     37: "left arrow",
	//     38: "up arrow",
	//     39: "right arrow",
	//     40: "down arrow",
	//     87: "w",
	//     83: "s",
	//     65: "a",
	//     68: "d"
	// };

	constructor(toggleContinueStopGame, showMenu) {
		document.addEventListener('keydown', this.onKeyDown.bind(this), false);
		document.addEventListener('keyup', this.onKeyUp.bind(this), false);
		this.keysPressed = [];
		this.toggleContinueStopGame = toggleContinueStopGame;
		this.showMenu = showMenu;
	}

	onKeyDown(event) {
		if (event.keyCode === 27) {
			this.toggleContinueStopGame([], [this.showMenu]);
		} else {
			this.keysPressed[event.keyCode] = 'pressed';
		}
	}

	onKeyUp(event) {
		this.keysPressed[event.keyCode] = '';
	}
}
