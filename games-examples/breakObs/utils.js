export default {
	randomNumberObstacles() {
		return Math.floor((Math.random() * (optionsPlatforms.number - 3)) + 1);
	},
	randomFromArray(arr) {
		if (arr instanceof Array) {
			return Math.floor((Math.random() * (arr.length)));
		}

		return -1;
	},
	playSound(file) {
		if (Audio) {
			const snd = new Audio(`sounds/${file}`);
			snd.play();
		}
	},
};
