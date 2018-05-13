import * as THREE from 'three';
import jQuery from 'jquery';

import { Plate, CubeObj, BallObj } from './factory';

import ballTexture from './images/ball.jpg';
import boxTexture from './images/box.jpg';
import streetTexture from './images/street.jpg';
import brickTexture from './images/brick.jpg';
import brightSquaresTexture from './images/bright_squares256.png';
import World from './World';

var camera,
	game,
	scene,
	renderer,
	keyboard = [],
	keyboardStatus = true,
	platform = [],
	objMovable = [],
	objCatchable = [],
	requestAnimationId,
	anguloCamera = 3 / 2 * Math.PI,
	distanciaCamera = 500,
	world,
	ball;

export default class GameEngine {

	constructor(keysPressed, instanceGame) {
		game = instanceGame;
		keyboard = keysPressed;
	}

	init(element) {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0xEEEEEE, 1.0);
		renderer.clear();
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.antialias = true;
		renderer.shadowMapAutoUpdate = true;
		element.append(renderer.domElement);
	
		scene = new THREE.Scene(); //onde se insere a lista de objetos a mostrar
	
		ball = new BallObj(50, objMovable, platform, objCatchable, scene);
		scene.add(ball);
		ball.position.set(0, 500, 0);
	
		//platform.push(ball);
		//objMovable.push(ball);
	
	
		var plane = new Plate(10000, 10, 10000, 0, brightSquaresTexture);
		plane.receiveShadow = true;
		platform.push(plane);
		scene.add(plane);
		plane.position.set(0, 0, 0);
	
		var wall = new Plate(100, 1000, 10000, 0.05, brickTexture);
		wall.receiveShadow = true;
		platform.push(wall);
		scene.add(wall);
		wall.position.set(5000, 0, 0);
	
		var wall2 = new Plate(10000, 1000, 100, 0.05, brickTexture);
		wall2.receiveShadow = true;
		platform.push(wall2);
		scene.add(wall2);
		wall2.position.set(0, 0, 5000);
	
		var tower = new Plate(500, 500, 500, 0.05, streetTexture);
		tower.receiveShadow = true;
		platform.push(tower);
		scene.add(tower);
		tower.position.set(0, 150, 0);
	
		var r1 = new Plate(500, 100, 1500, 0.05, streetTexture);
		r1.rotation.x = -1 / 9 * Math.PI;
		r1.receiveShadow = true;
		platform.push(r1);
		scene.add(r1);
		r1.position.set(0, 50, -900);
	
		var r2 = new Plate(500, 100, 1500, 0.05, streetTexture);
		r2.rotation.x = 1 / 9 * Math.PI;
		r2.receiveShadow = true;
		platform.push(r2);
		scene.add(r2);
		r2.position.set(0, 50, 900);
	
		var r3 = new Plate(1500, 100, 500, 0.05, streetTexture);
		r3.rotation.z = 1 / 9 * Math.PI;
		r3.receiveShadow = true;
		platform.push(r3);
		scene.add(r3);
		r3.position.set(-900, 50, 0);
	
		var r4 = new Plate(1500, 100, 500, 0.05, streetTexture);
		r4.rotation.z = -1 / 9 * Math.PI;
		r4.receiveShadow = true;
		platform.push(r4);
		scene.add(r4);
		r4.position.set(900, 50, 0);
	
		var tower2 = new Plate(2000, 800, 3000, 0.05, streetTexture);
		tower2.receiveShadow = true;
		platform.push(tower2);
		scene.add(tower2);
		tower2.position.set(-2000, 0, 2000);
	
	
		//platform.push(gift);
		//world.setObject(gift);
	
		var ray = new THREE.Raycaster();
	
	
		// add catchable objects
		for (var i = 0; i < 1; i++) {
			var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
			var gift = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), material);
			gift.position.z = Math.floor((10000 * Math.random()) - 5000);
			gift.position.x = Math.floor((10000 * Math.random()) - 5000);
			gift.position.y = 3000;
	
			ray.set(gift.position, new THREE.Vector3(0, -1, 0));
			var intersect = ray.intersectObjects(platform);
	
			if (intersect.length > 0) {
				gift.position.y = gift.position.y - intersect[0].distance + 100;
				if (intersect.length > 1) {
					console.log(intersect);
					console.log(gift.position);
				}
				//console.log(gift.position);
			}
	
			scene.add(gift);
			objCatchable.push(gift);
		}
	
		jQuery(".pontuacao").html(objCatchable.length);
	
		var cube = new CubeObj(200, 200, 200);
		scene.add(cube);
		platform.push(cube);
		objMovable.push(cube);
		cube.position.set(new THREE.Vector3(700, 1500, 700));
		//world.setObject(cube);
	
	
		//point light
		//light = new THREE.PointLight(0xffffff);
		//light.position.set(2000, 2000, -2000);
		//scene.add(light);
		// var spotlight=new THREE.SpotLight(0xffffff);
		// spotlight.position.set(-200,2000,200);
		// //spotlight.shadowCameraVisible = true;
		// // spotlight.shadowDarkness = 0.3;
		// // spotlight.onlyShadow=true;
		// spotlight.intensity = 100;
		// //  spotlight.shadowCameraFov =150;
		// // must enable shadow casting ability for the light
		// spotlight.castShadow = true;
		// scene.add(spotlight);
	
		//var light = new THREE.AmbientLight( 0x6f6f6f ); // soft white light 
		//scene.add( light );
	
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(-200, 1300, 200);
		directionalLight.castShadow = true;
		scene.add(directionalLight);
	
		// var hemisphere= new THREE.HemisphereLight(0xf6f6f6);
		//scene.add(hemisphere);
	
		//Skybox
		var skyboxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
		var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x6698FF, side: THREE.BackSide });
		var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	
		scene.add(skybox);
	}

	load(element) {
		this.init(element);
		world = new World(keyboardStatus, anguloCamera, objMovable, keyboard, game.endOfGame.bind(game), objCatchable);
		world.setObject(ball);
		game.start();
	}

	render() {
		world.moves(keyboard);
		if (camera) {
			if (keyboard[39]) {
				anguloCamera -= 1 / 100 * Math.PI;
				world.setCameraAngle(anguloCamera);
			}

			if (keyboard[37]) {
				anguloCamera += 1 / 100 * Math.PI;
				world.setCameraAngle(anguloCamera);
			}

			if (keyboard[38]) {
				distanciaCamera -= 5;
			}

			if (keyboard[40]) {
				distanciaCamera += 5;
			}
			camera.position.set(-distanciaCamera * Math.cos(anguloCamera), 200, distanciaCamera * Math.sin(anguloCamera));
			camera.position.add(world.Obj.position);
			camera.lookAt(world.Obj.position);
			renderer.render(scene, camera);
		}
		requestAnimationId = requestAnimationFrame(this.render.bind(this));
	}

	stopRender() {
		cancelAnimationFrame(requestAnimationId);
	}

	setSize(width, height) {
		camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}
};
