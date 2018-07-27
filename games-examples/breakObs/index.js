import ThreeEngine from './threeEngine';

import { init, render } from './breakObs';

class BreakObs extends ThreeEngine {
	constructor() {
		super();

		this.subscribeRender(render);
	}

	loadKit(kit) {
		if (this.kitLoaded) {
			return;
		}
		this.kitLoaded = true;
		this.keyboard = kit.keyboard.keysPressed;

		// generate world
		this.load();
	}

	load() {
		init(this);
	}
}

const breakobs = new BreakObs();

export default {
	renderOn: breakobs.renderOn.bind(breakobs),
	startRender: breakobs.startRender.bind(breakobs),
	stopRender: breakobs.stopRender.bind(breakobs),
	setSize: breakobs.setSize.bind(breakobs),
	loadKit: breakobs.loadKit.bind(breakobs),
	controls: {
		'LEFT ARROW ': ' move ball to left',
		'RIGHT ARROW ': ' move ball to right',
	},
};

