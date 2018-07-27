export default {
	counter: 0,
	collisions: 0,
	length: 0,
	list: [],
	platforms: {},
	add(obs) {
		this.counter++;
		obs.id = this.counter;
		obs.platform = game.platform;
		this.platforms[obs.platform].push(obs);
		// this.list.push(obs);
		this.length++;

		$('#valueObs').html(this.length);
	},
	remove(obs) {
		if (obs.platform) {
			const index = this.platforms[obs.platform].indexOf(obs);
			if (index > -1) {
				this.platforms[obs.platform].splice(index, 1);
				scene.remove(obs);
				this.length--;
				$('#valueObs').html(this.length);
				return 1;
			}

			return 0;
		}
	},
	distance: 2000,
	move() {
		let p,
			i;
		for (p in this.platforms) {
			i = 0;
			while (obs = obstacles.platforms[p][i]) {
				if (obs.position.z > -12) {
					obs.position.z -= game.velocity;
					i++;
				} else {
					obstacles.remove(obs);
				}
			}
		}
	},
};
