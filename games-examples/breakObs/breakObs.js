import * as THREE from 'three';
import TWEEN from './js/Tween.js';

import cloudsImage from './imagens/clouds2.jpg';
import grassImage from './imagens/grasslight-big.jpg';
import ballImage from './imagens/ball.jpg';

let ball,
	nextCollision,
	ground,
	timeCollision = null,
	// save the pause status context, this flag indicates that the keyboard is active
	// keyboardStatus = true,
	lastCollisionObject = null,
	Game;


const ballRadius = 1,
	sourceZ = 500,
	accelerationPenalty = 0.2,
	acceleration = 0.001,
	velocity = 0.05,
	optionsPlatforms = {
		number: 3,
		thin: 0.5,
		distance: 5,
	},
	builder = {
		getImageMaterial(imagem, repeat) {
			const material = new THREE.TextureLoader().load(imagem);// dimensions of the image should be potences of 2
			if (repeat && repeat.x && repeat.z) {
				material.wrapS = material.wrapT = THREE.MirroredRepeatWrapping;
				material.repeat.set(repeat.x, repeat.z);
			}
			const mesh = { map: material };
			return new THREE.MeshLambertMaterial(mesh);
		},
		getColorMaterial(color) {
			return new THREE.MeshPhongMaterial({
				// light
				// specular: '#a9fcff',
				// intermediate
				color,
				// dark
				// emissive: '#006063',
				shininess: 100,
			});
		},
		getMaterial(material) {
			if (!material) {
				material = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5 });
			} else {
				material = new THREE.MeshPhongMaterial({
					// light
					specular: '#a9fcff',
					// intermediate
					color: '#00abb1',
					// dark
					emissive: '#006063',
					shininess: 100,
				});
			}
			return material;
		},
		sphere(radius, material) {
			radius = radius || 1;
			material = (material instanceof Object) ? material : this.getMaterial(material);
			const geometry = new THREE.SphereGeometry(radius, 30, 30);
			const obj = new THREE.Mesh(geometry, material);
			obj.castShadow = true;
			return obj;
		},
		cube(x, y, z, material) {
			x = x || 1;
			y = y || 1;
			z = z || 1;
			material = (material instanceof Object) ? material : this.getMaterial(material);
			const geometry = new THREE.CubeGeometry(x, y, z);
			const obj = new THREE.Mesh(geometry, material);
			obj.castShadow = true;
			return obj;
		},
	},
	chunks = {
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
						Game.scene.add(cube);
					}
				}
			}
		},
		nextMove() {
			const nextMoveBuffer = this.nextMoveBuffer;
			if (nextMoveBuffer) {
				if (nextMoveBuffer.progress < this.progress) {
					Game.keyboard[nextMoveBuffer.key] = 'pressed';
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
	},
	obstacles = {
		counter: 0,
		collisions: 0,
		length: 0,
		list: [],
		platforms: {},
		add(obs) {
			this.counter = this.counter + 1;
			// obs.id = this.counter;
			obs.platform = game.platform;
			this.platforms[obs.platform].push(obs);

			// this.list.push(obs);
			this.length = this.length + 1;

			// $('#valueObs').html(this.length);
		},
		remove(obs) {
			if (obs.platform) {
				const index = this.platforms[obs.platform].indexOf(obs);
				if (index > -1) {
					this.platforms[obs.platform].splice(index, 1);
					Game.scene.remove(obs);
					this.length = this.length - 1;
					// $('#valueObs').html(this.length);
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
				let obs;
				while (obstacles.platforms[p][i]) {
					obs = obstacles.platforms[p][i];
					if (obs.position.z > -12) {
						obs.position.z -= game.velocity;
						i++;
					} else {
						obstacles.remove(obs);
					}
				}
			}
		},
	},
	game = {
		stop: 10,
		velocity,
		move() {
			obstacles.move();
			ground.position.z -= this.velocity;
			chunks.progress += this.velocity;
		},
		platform: null,
		setVelocity(v) {
			v = (v < velocity) ? velocity : v;
			this.velocity = v;
			// const velAux = Math.round(v * 100) / 100;
			// $('#valueVelocity').html(velAux);
			// gv.refresh(velAux);
		},
		accelerate(value) {
			this.setVelocity(this.velocity + (value || acceleration));
		},
		setPlatform(p) {
			p = p || Math.round(optionsPlatforms.number / 2);
			this.platform = p;
			// $('#valueActivePlatform').html(p);
		},
		validatePlatform(p) {
			if (p == null) {
				p = Math.round(optionsPlatforms.number / 2);
			} else if (p > optionsPlatforms.number) {
				p = optionsPlatforms.number;
			} else if (p < 1) {
				p = 1;
			}
			return p;
		},
		getPlatformPosition(p) { // return position.x of the p platform
			p = this.validatePlatform(p);
			return optionsPlatforms.distance * (p - 1);
		},
		setPlatformPosition(p) {
			p = this.validatePlatform(p);
			const position = this.getPlatformPosition(p);
			this.setPlatform(p);
			return position;
		},
		leftPlatformPosition() {
			return this.setPlatformPosition(this.platform + 1);
		},
		rightPlatformPosition() {
			return this.setPlatformPosition(this.platform - 1);
		},
	},

	avatar = {
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
				if (obstacles.platforms[i].length) {
					intersect = raycaster.intersectObjects(obstacles.platforms[i]);
				} else {
					intersect = { length: 0 };
				}
				if (intersect.length) {
					break;
				}
			}

			if (intersect.length > 0 && intersect[0].distance < ballRadius) {
				this.collision(intersect[0].object);
			} else if (intersect.length && intersect[0].distance < ballRadius + game.velocity) {
				nextCollision = game.platform;
			} else if (nextCollision === game.platform) {
				this.collision();
			}
		},
	},
	utils = {
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
			// if (Audio) {
			// 	const snd = new Audio(`sounds/${file}`);
			// 	snd.play();
			// }
		},
	};

var platformsAux = [];
// usingMouse = false;


// Detecting events like keystrokes and window resize

// let mouseTimeout;
// function onMouseMove() {
// 	clearTimeout(mouseTimeout);
// 	// usingMouse = true;
// 	mouseTimeout = setTimeout(() => {
// 		// usingMouse = false;
// 	}, 10000);
// }

// function onMouseDown(event) {
// 	if (obstacles.collisions >= game.stop) {
// 		infoAnimation.animate();
// 	}
// 	obstacles.collisions = 0;
// 	onMouseMove();
// 	event.preventDefault();
// 	if (Game && Game.keyboard) {
// 		switch (event.which) {
// 			case 1: Game.keyboard[37] = 'pressed'; break;
// 			case 3: Game.keyboard[39] = 'pressed'; break;
// 			default:
// 		}
// 	}

// }

// function onDocumentKeyDown(event) {
// 	if (obstacles.collisions >= game.stop) {
// 		infoAnimation.animate();
// 	}
// 	obstacles.collisions = 0;

// 	if (keyboardStatus) {
// 		if (event.keyCode != 37 && event.keyCode != 39) {
// 			infoAnimation.animate();
// 		}
// 		Game.keyboard[event.keyCode] = 'pressed';
// 		usingMouse = false;
// 	}
// }

// function onDocumentKeyUp(event) {
// 	Game.keyboard[event.keyCode] = '';
// }


// document.addEventListener('keydown', onDocumentKeyDown, false);
// document.addEventListener('keyup', onDocumentKeyUp, false);
// document.addEventListener('mousedown', onMouseDown, false);
// document.addEventListener('mousemove', onMouseMove, false);


// include stats about fps
// stats = new Stats();
/* stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    $('#velocityContainer').append( stats.domElement );

    $('#stats').append(
      '<div id="variables">'+
        'Vel: <span id="valueVelocity">'+game.velocity+'</span><br />'+
        'Plat: <span id="valueActivePlatform"></span><br/>'+
        'Obs: <span id="valueObs"></span>'+
      '</div>'
    ); */

// var gv = new JustGage({
// 	id: 'gaugeVelocity',
// 	value: game.velocity,
// 	title: ' ',
// 	min: 0,
// 	max: 6,
// 	label: 'm/s',
// });

// infoAnimation
const infoAnimation = {};
infoAnimation.mouseSlides = ['mouse', 'left_mouse', 'right_mouse'];
infoAnimation.keyboardSlides = ['keyboard', 'left_arrow', 'right_arrow'];
infoAnimation.counterSlides = 0;
infoAnimation.sliding = null;
infoAnimation.changeSlides = function () {
	// let slides = usingMouse ? this.mouseSlides:this.keyboardSlides;
	// if (usingMouse) {
	// 	slides = this.mouseSlides;
	// } else {
	// 	slides = this.keyboardSlides;
	// }

	// $('.info img').hide();
	// $(`#${slides[this.counterSlides]}`).show();

	this.counterSlides++;
	this.counterSlides = this.counterSlides % 3;

	this.sliding = setTimeout(() => {
		infoAnimation.changeSlides();
	}, 1000);
};
infoAnimation.animate = function () {
	// $('.info img').hide();
	// $('#infoContainer').show();
	this.changeSlides();
	setTimeout(() => {
		clearTimeout(infoAnimation.sliding);
		// $('.info img').hide();
		// $('#infoContainer').hide();
	}, 20000);
};

infoAnimation.animate();

// Game functions
function moveBall() {
	let newPos = null;
	if (Game.keyboard[37]) {
		newPos = game.leftPlatformPosition();
		Game.keyboard[37] = null;
		chunks.addMove(37);
	} else if (Game.keyboard[39]) {
		newPos = game.rightPlatformPosition();
		Game.keyboard[39] = null;
		chunks.addMove(39);
	}
	if (newPos != null) {
		if (newPos !== ball.position.x) {
			utils.playSound('flyby.mp3');
			new TWEEN.Tween(ball.position)
				.to({
					x: newPos,
				}, optionsPlatforms.distance / game.velocity * 100).start();
		} else {
			const oldPosition = ball.position.x;
			const move = (game.platform === 1) ? -optionsPlatforms.distance : optionsPlatforms.distance;
			// keyboardStatus = false;
			const startTween = new TWEEN.Tween(ball.position)
				.to({
					x: oldPosition + move,
				}, optionsPlatforms.distance / game.velocity * 100)
				.onComplete(() => {
					utils.playSound('sharp-pounch.mp3');
				});

			const endTween = new TWEEN.Tween(ball.position)
				.to({
					x: oldPosition,
				}, optionsPlatforms.distance / game.velocity * 100)
				.onComplete(() => {
					// keyboardStatus = true;
				});
			startTween.chain(endTween);

			startTween.start();
		}
	}
}


function createScenario() {
	// lights
	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(40, 50, -50);
	// spotLight.castShadow = true;
	// spotLight.shadowCameraVisible = true;
	// spotLight.shadowDarkness = 0.5;
	// spotLight.intensity = 100;
	spotLight.shadow.camera.fov = 150;
	// must enable shadow casting ability for the light
	Game.scene.add(spotLight);

	// add subtle ambient lighting
	/* var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight); */

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 500, 0);
	directionalLight.castShadow = true;
	Game.scene.add(directionalLight);


	// skybox
	const skyboxGeometry = new THREE.CubeGeometry(100000, 100000, 100000);
	const skyboxMaterial = new THREE.MeshBasicMaterial({
		color: 0x6698FF, // color of sky
		// color:0x000000,
		side: THREE.BackSide,
	});
	const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	Game.scene.add(skybox);

	// ground
	const groundWidth = ((optionsPlatforms.number + 2) * 2 * ballRadius) + (3 * optionsPlatforms.distance);
	const groundHeight = 100000;
	let texture = builder.getImageMaterial(grassImage, { x: optionsPlatforms.number, z: groundHeight / (groundWidth / optionsPlatforms.number) });

	// var texture=builder.getColorMaterial('#047527')
	ground = builder.cube(groundWidth, optionsPlatforms.thin, groundHeight, texture);
	ground.position.set(ball.position.x, 0 - ballRadius - optionsPlatforms.thin, ball.position.z);
	ground.receiveShadow = true;
	Game.scene.add(ground);

	// walls
	let wallLeft,
		wallRight;

	texture = new THREE.MeshLambertMaterial({
		color: 'white',
	});

	wallLeft = builder.cube(optionsPlatforms.thin, 3 * ballRadius, 100000, texture);
	wallLeft.position.set(game.getPlatformPosition(optionsPlatforms.number) + optionsPlatforms.distance + optionsPlatforms.thin + ballRadius, 0, ball.position.z);
	wallLeft.receiveShadow = true;
	Game.scene.add(wallLeft);

	wallRight = builder.cube(optionsPlatforms.thin, 3 * ballRadius, 100000, texture);
	wallRight.position.set(game.getPlatformPosition(1) - optionsPlatforms.distance - optionsPlatforms.thin - ballRadius, 0, ball.position.z);
	wallRight.receiveShadow = true;
	Game.scene.add(wallRight);
}

function createObstacles() {
	/* if(!chunks.obstacles.length){
    chunks.generateChunk();
  }
  var obs=chunks.obstacles.splice(-1)[0];
  var nObs=obs.length;
  while(nObs-->0){
    obs[nObs].progress=chunks.progress;
    var cube=builder.cube(4*ballRadius,4*ballRadius,0.5);
    cube.position.set(game.getPlatformPosition(obs[nObs].platform),optionsPlatforms.thin,sourceZ);
    obstacles.add(cube);
    scene.add(cube);
  } */
	const nObs = utils.randomNumberObstacles();
	const pl = platformsAux.slice(0);// copy array
	for (let i = nObs - 1; i >= 0; i--) {
		const index = utils.randomFromArray(pl);
		const cube = builder.cube(4 * ballRadius, 4 * ballRadius, 0.5);
		cube.position.set(game.getPlatformPosition(pl[index]), optionsPlatforms.thin, sourceZ);
		obstacles.add(cube);
		Game.scene.add(cube);
		pl.splice(index, 1);
	}
}

function initPlatforms() {
	for (let i = optionsPlatforms.number; i > 0; i--) {
		obstacles.platforms[i] = [];
		platformsAux.push(i);
	}
}

// Initialize and animate
function render() {
	ball.rotation.x += game.velocity;

	const middlePosition = (optionsPlatforms.distance * (optionsPlatforms.number - 1)) / 2;
	if (Game.camera) {
		Game.camera.position.set(middlePosition, 2, -12);
		Game.camera.lookAt(ball.position);
	}

	moveBall();
	game.move();
	if (obstacles.collisions < game.stop) {
		game.accelerate();
		avatar.detectCollision();
		const date = new Date().getTime();
		if (!timeCollision || (date - timeCollision) > (obstacles.distance / game.velocity)) {
			createObstacles();
			timeCollision = date;
			if (obstacles.distance > 1000) {
				obstacles.distance -= 50;
			}
		}
	}

	// stats.update();
	TWEEN.update();
}


function init(BreakObs) {
	Game = BreakObs;

	// ball=builder.sphere(ballRadius,builder.getColorMaterial('#F47620'));
	ball = builder.sphere(ballRadius, builder.getImageMaterial(ballImage));
	ball.position.set(game.setPlatformPosition(), 0, 0);
	Game.scene.add(ball);


	/* var urlPrefix = "imagens/envMap/";
  var urls = [ urlPrefix + "px.png", urlPrefix + "nx.png",
      urlPrefix + "py.png", urlPrefix + "ny.png",
      urlPrefix + "pz.png", urlPrefix + "nz.png" ]; */
	const url = cloudsImage;
	const urls = [url, url, url, url, url, url];
	const textureCube = new THREE.CubeTextureLoader().load(urls);

	// Skybox

	const shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = textureCube;

	const material = new THREE.ShaderMaterial({

		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide,

	});

	const skySize = 10000;
	const mesh = new THREE.Mesh(new THREE.CubeGeometry(skySize, skySize, skySize), material);
	mesh.position.set(ball.position.x, 0 - ballRadius - optionsPlatforms.thin, ball.position.z);
	Game.scene.add(mesh);


	initPlatforms();
	createScenario();
}

export { init, render };
