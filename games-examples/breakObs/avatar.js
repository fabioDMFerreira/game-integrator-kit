export default {
	collision(obj) {
		if (obj) {
			if (obj.id === lastCollisionObject) {
				return;
			}
			lastCollisionObject = obj.id;
		}

		utils.playSound('glass-breaking.mp3');
		const oldVelocity = game.velocity;
		game.setVelocity(0.1);
		new TWEEN.Tween(game)
			.to({
				velocity: oldVelocity - accelerationPenalty,
			}, 1000)
			.onUpdate(() => {
				if (game.velocity < 0) {
					game.setVelocity(0.1);
				}
				game.setVelocity(game.velocity);
				if (obstacles.distance < 3000) {
					obstacles.distance += 100;
				}
			})
			.onComplete(() => {
				obstacles.collisions++;
			})
			.start();
		nextCollision = null;
	},
	detectCollision() {
		let raycaster = new THREE.Raycaster(),
			intersect;
		raycaster.set(ball.position, new THREE.Vector3(0, 0, -1));
		for (let i = optionsPlatforms.number; i > 0; i--) {
			intersect = raycaster.intersectObjects(obstacles.platforms[i]);
			if (intersect.length) {
				break;
			}
		}
		// intersect=raycaster.intersectObjects(obstacles.platforms[game.platform]);
		if (intersect.length > 0 && intersect[0].distance < ballRadius) {
			this.collision(intersect[0].object);
		} else if (intersect.length && intersect[0].distance < ballRadius + game.velocity) {
			nextCollision = game.platform;
		} else if (nextCollision === game.platform) {
			this.collision();
		}
	},
};
