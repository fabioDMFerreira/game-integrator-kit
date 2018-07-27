let container = $('#gameContainer'),
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
	lastCollisionObject = null;


let	keyboard = [],
	platformsAux = [],
	usingMouse = false,
	numberCollisions = 0;


// Detecting events like keystrokes and window resize


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

const gv = new JustGage({
	id: 'gaugeVelocity',
	value: game.velocity,
	title: ' ',
	min: 0,
	max: 6,
	label: 'm/s',
});

// infoAnimation
const infoAnimation = {};
infoAnimation.mouseSlides = ['mouse', 'left_mouse', 'right_mouse'];
infoAnimation.keyboardSlides = ['keyboard', 'left_arrow', 'right_arrow'];
infoAnimation.counterSlides = 0;
infoAnimation.sliding = null;
infoAnimation.changeSlides = function () {
	let slides;
	if (usingMouse) {
		slides = this.mouseSlides;
	}
	else {
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

