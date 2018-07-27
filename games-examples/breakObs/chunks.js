export default {
	obsByChunk: 25,
	list: [],
	obstacles: [],
	progress: 0,
	moves: [],
	movesBuffer: [], // saved moves, automatic pilot game
	obstaclesBuffer: [],
	nextMoveBuffer: null,
	drawObstacles() {
		for (let i = this.obstaclesBuffer.length - 1; i >= 0; i--) {
			const obsArray = this.obstaclesBuffer[i];
			for (let j = obsArray.length - 1; j >= 0; j--) {
				if (obsArray[j].progress) {
					const cube = builder.cube(4 * ballRadius, 4 * ballRadius, 0.5);
					cube.position.set(game.getPlatformPosition(obsArray[j].platform), optionsPlatforms.thin, obsArray[j].progress);
					obstacles.add(cube);
					scene.add(cube);
				}
			}
		}
	},
	nextMove() {
		const nextMoveBuffer = this.nextMoveBuffer;
		if (nextMoveBuffer) {
			if (nextMoveBuffer.progress < this.progress) {
				keyboard[nextMoveBuffer.key] = 'pressed';
				this.nextMoveBuffer = null;
			}
			return 1;
		} else if (this.movesBuffer && this.movesBuffer.length) {
			this.nextMoveBuffer = this.movesBuffer.splice(0, 1)[0];
			return 1;
		}

		return 0;
	},
	addMove(value) {
		/* this.moves.push({
      key:value,
      progress:this.progress,
    }); */
	},
	generateObstacles() {
		/* if(this.list.length){ //this code saves every scenario of the game
      this.list[this.list.length-1].moves=this.moves;
      this.list[this.list.length-1].obstacles=this.obstaclesBuffer;
      this.moves=[];
      this.obstaclesBuffer=[];
      this.progress=0;
    } */
		const obs = [];
		for (let i = this.obsByChunk; i > 0; i--) {
			let nObs = utils.randomNumberObstacles();
			const pl = platformsAux.slice(0);
			const m = [];
			while (nObs-- > 0) {
				var index = utils.randomFromArray(pl);
				const ob = {
					platform: pl[index],
				};
				m.push(ob);
			}
			obs.push(m);
			pl.splice(index, 1);
		}
		return obs;
	},
	generateChunk() {
		const chunk = {};
		chunk.velocity = game.velocity;
		chunk.obstacles = this.generateObstacles();
		this.obstacles = chunk.obstacles.slice(0);
		this.list.push(chunk);
		return chunk;
	},
};
