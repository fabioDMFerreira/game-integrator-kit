var container = $('#gameContainer'),
	width = window.innerWidth,
	height = window.innerHeight,
	scene = null,
	renderer = null,
	camera = null,
	ball = null,
	ballRadius = 1,
	stats = null,
	sourceZ = 500,
	accelerationPenalty = 0.2,
	acceleration = 0.001,
	velocity = 0.5,
	nextCollision = null,
	ground = null,
	timeCollision = null,
	keyboardStatus = true, // save the pause status context, this flag indicates that the keyboard is active
	optionsPlatforms = {
		number: 3,
		thin: 0.5,
		distance: 5,
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
			const velAux = Math.round(v * 100) / 100;
			$('#valueVelocity').html(velAux);
			gv.refresh(velAux);
		},
		accelerate(value) {
			value = value || acceleration;
			this.setVelocity(this.velocity + value);
		},
		setPlatform(p) {
			p = p || Math.round(optionsPlatforms.number / 2);
			this.platform = p;
			$('#valueActivePlatform').html(p);
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
	lastCollisionObject = null,
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
			if (Audio) {
				const snd = new Audio(`sounds/${file}`);
				snd.play();
			}
		},
	};

var obstacles = null,
	keyboard = [],
	platformsAux = [],
	obstacles = {
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
	},
	usingMouse = false,
	numberCollisions = 0,
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

// Detecting events like keystrokes and window resize

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousedown', onMouseDown, false);
document.oncontextmenu = document.body.oncontextmenu = function () { return false; };
document.addEventListener('mousemove', onMouseMove, false);

let mouseTimeout;
function onMouseMove() {
	clearTimeout(mouseTimeout);
	usingMouse = true;
	mouseTimeout = setTimeout(() => {
		usingMouse = false;
	}, 10000);
}

function onMouseDown(event) {
	if (obstacles.collisions >= game.stop) {
		infoAnimation.animate();
	}
	obstacles.collisions = 0;
	onMouseMove();
	event.preventDefault();
	switch (event.which) {
	case 1: keyboard[37] = 'pressed'; break;
	case 3: keyboard[39] = 'pressed'; break;
	}
}

function onDocumentKeyDown(event) {
	if (obstacles.collisions >= game.stop) {
		infoAnimation.animate();
	}
	obstacles.collisions = 0;
	if (event.keyCode == 27) { // detect keystroke of "Esc" to open or close the menu
		keyboardStatus = !keyboardStatus;
		if (keyboardStatus) {
			// esconderMenu();
			$('#gameContainer').css({ cursor: 'default' });
			render();
		} else {
			cancelAnimationFrame(requestAnimationId);
			$('#gameContainer').css({ cursor: 'none' });
			// mostrarMenu();
		}
	}
	if (keyboardStatus) {
		if (event.keyCode != 37 && event.keyCode != 39) {
			infoAnimation.animate();
		}
		keyboard[event.keyCode] = 'pressed';
		usingMouse = false;
	}
}

function onDocumentKeyUp(event) {
	keyboard[event.keyCode] = '';
}

function onWindowResize() {
	if (camera) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}


// include stats about fps
stats = new Stats();
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

var gv = new JustGage({
	id: 'gaugeVelocity',
	value: game.velocity,
	title: ' ',
	min: 0,
	max: 6,
	label: 'm/s',
});

// infoAnimation
var infoAnimation = {};
infoAnimation.mouseSlides = ['mouse', 'left_mouse', 'right_mouse'];
infoAnimation.keyboardSlides = ['keyboard', 'left_arrow', 'right_arrow'];
infoAnimation.counterSlides = 0;
infoAnimation.sliding = null;
infoAnimation.changeSlides = function () {
	let slides;
	if (usingMouse) {
		slides = this.mouseSlides;
	} else {
		slides = this.keyboardSlides;
	}

	$('.info img').hide();
	$(`#${slides[this.counterSlides]}`).show();

	this.counterSlides++;
	this.counterSlides = this.counterSlides % 3;

	this.sliding = setTimeout(() => {
		infoAnimation.changeSlides();
	}, 1000);
};
infoAnimation.animate = function () {
	$('.info img').hide();
	$('#infoContainer').show();
	this.changeSlides();
	setTimeout(() => {
		clearTimeout(infoAnimation.sliding);
		$('.info img').hide();
		$('#infoContainer').hide();
	}, 20000);
};

infoAnimation.animate();

// builder object
var builder = {
	getImageMaterial(imagem, repeat) {
		const path = 'imagens/';
		const material = THREE.ImageUtils.loadTexture(path + imagem);// dimensions of the image should be potences of 2
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
		var material = (material instanceof Object) ? material : this.getMaterial(material);
		const geometry = new THREE.SphereGeometry(radius, 30, 30);
		const obj = new THREE.Mesh(geometry, material);
		obj.castShadow = true;
		return obj;
	},
	cube(x, y, z, material) {
		x = x || 1;
		y = y || 1;
		z = z || 1;
		var material = (material instanceof Object) ? material : this.getMaterial(material);
		const geometry = new THREE.CubeGeometry(x, y, z);
		const obj = new THREE.Mesh(geometry, material);
		obj.castShadow = true;
		return obj;
	},
};

// Game functions
function moveBall() {
	let newPos = null;
	if (keyboard[37]) {
		newPos = game.leftPlatformPosition();
		keyboard[37] = null;
		chunks.addMove(37);
	} else if (keyboard[39]) {
		newPos = game.rightPlatformPosition();
		keyboard[39] = null;
		chunks.addMove(39);
	}
	if (newPos != null) {
		if (newPos != ball.position.x) {
			utils.playSound('flyby.mp3');
			new TWEEN.Tween(ball.position)
				.to({
					x: newPos,
				}, optionsPlatforms.distance / game.velocity * 100).start();
		} else {
			const oldPosition = ball.position.x;
			const move = (game.platform === 1) ? -optionsPlatforms.distance : optionsPlatforms.distance;
			keyboardStatus = false;
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
					keyboardStatus = true;
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
	spotLight.onlyShadow = true;
	// spotLight.intensity = 100;
	spotLight.shadowCameraFov = 150;
	// must enable shadow casting ability for the light
	scene.add(spotLight);

	// add subtle ambient lighting
	/* var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight); */

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 500, 0);
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	const startPosition = 0;

	// skybox
	const skyboxGeometry = new THREE.CubeGeometry(100000, 100000, 100000);
	const skyboxMaterial = new THREE.MeshBasicMaterial({
		color: 0x6698FF, // color of sky
		// color:0x000000,
		side: THREE.BackSide,
	});
	const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);

	// ground
	const groundWidth = ((optionsPlatforms.number + 2) * 2 * ballRadius) + (3 * optionsPlatforms.distance);
	const groundHeight = 100000;
	let texture = builder.getImageMaterial('grasslight-big.jpg', { x: optionsPlatforms.number, z: groundHeight / (groundWidth / optionsPlatforms.number) });

	// var texture=builder.getColorMaterial('#047527')
	ground = builder.cube(groundWidth, optionsPlatforms.thin, groundHeight, texture);
	ground.position.set(ball.position.x, 0 - ballRadius - optionsPlatforms.thin, ball.position.z);
	ground.receiveShadow = true;
	scene.add(ground);

	// walls
	let wallLeft,
		wallRight;

	texture = new THREE.MeshLambertMaterial({
		color: 'white',
	});

	wallLeft = builder.cube(optionsPlatforms.thin, 3 * ballRadius, 100000, texture);
	wallLeft.position.set(game.getPlatformPosition(optionsPlatforms.number) + optionsPlatforms.distance + optionsPlatforms.thin + ballRadius, 0, ball.position.z);
	wallLeft.receiveShadow = true;
	scene.add(wallLeft);

	wallRight = builder.cube(optionsPlatforms.thin, 3 * ballRadius, 100000, texture);
	wallRight.position.set(game.getPlatformPosition(1) - optionsPlatforms.distance - optionsPlatforms.thin - ballRadius, 0, ball.position.z);
	wallRight.receiveShadow = true;
	scene.add(wallRight);
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
		scene.add(cube);
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


	renderer.render(scene, camera);
	requestAnimationId = requestAnimationFrame(render);
	stats.update();
	TWEEN.update();
}


function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.setSize(width, height);
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapAutoUpdate = true;
	container.append(renderer.domElement);

	scene = new THREE.Scene();

	const middlePosition = (optionsPlatforms.distance * (optionsPlatforms.number - 1)) / 2;

	camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
	camera.position.set(middlePosition, 5, -12);


	// ball=builder.sphere(ballRadius,builder.getColorMaterial('#F47620'));
	ball = builder.sphere(ballRadius, builder.getImageMaterial('ball.jpg'));
	ball.position.set(game.setPlatformPosition(), 0, 0);
	scene.add(ball);


	camera.lookAt(ball.position);

	/* var urlPrefix = "imagens/envMap/";
  var urls = [ urlPrefix + "px.png", urlPrefix + "nx.png",
      urlPrefix + "py.png", urlPrefix + "ny.png",
      urlPrefix + "pz.png", urlPrefix + "nz.png" ]; */
	const url = 'imagens/clouds2.jpg';
	const urls = [url, url, url, url, url, url];
	const textureCube = THREE.ImageUtils.loadTextureCube(urls);

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
	scene.add(mesh);


	initPlatforms();
	createScenario();


	render();
}

init();
