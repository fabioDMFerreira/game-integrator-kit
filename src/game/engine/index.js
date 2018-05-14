import * as THREE from 'three';

import { CubeObj, BallObj } from './factory';

import ballTexture from './images/ball.jpg';
import World from './World';
import buildWorld from './buildWorld';

var keyboard = [],
	keyboardStatus = true,
	objMovable = [],
	requestAnimationId,
	anguloCamera = 3 / 2 * Math.PI,
	distanciaCamera = 500,
	world,
	ball;

export default class GameEngine {

	constructor(keysPressed, finishGame,catchables) {
		this.finishGame = finishGame;
		this.catchables = catchables;
		keyboard = keysPressed;
	}

	generateGifts(){
		var ray = new THREE.Raycaster();

		for (var i = 0; i < 1; i++) {
			var material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
			var gift = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), material);
			gift.position.z = Math.floor((10000 * Math.random()) - 5000);
			gift.position.x = Math.floor((10000 * Math.random()) - 5000);
			gift.position.y = 3000;
	
			ray.set(gift.position, new THREE.Vector3(0, -1, 0));
			var intersect = ray.intersectObjects(this.platform);
	
			if (intersect.length > 0) {
				gift.position.y = gift.position.y - intersect[0].distance + 100;
				if (intersect.length > 1) {
					console.log(intersect);
					console.log(gift.position);
				}
				//console.log(gift.position);
			}
	
			this.scene.add(gift);
			this.gifts.push(gift);
		}

		this.catchables.set(this.gifts.length);
	
	}

	init(element) {
		this.platform = [];
		this.gifts=[];

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0xEEEEEE, 1.0);
		this.renderer.clear();
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.antialias = true;
		this.renderer.shadowMapAutoUpdate = true;
		element.append(this.renderer.domElement);
	
		this.scene = new THREE.Scene(); //onde se insere a lista de objetos a mostrar
	
		ball = new BallObj(50, objMovable, this.platform, this.gifts, this.scene);
		this.scene.add(ball);
		ball.position.set(0, 500, 0);
		
		buildWorld(this.platform).forEach(element=>this.scene.add(element));
		
		// add catchable objects
		this.generateGifts();
	
		var cube = new CubeObj(200, 200, 200);
		this.scene.add(cube);
		this.platform.push(cube);
		objMovable.push(cube);
		cube.position.set(500, 500, 500);
		//world.setObject(cube);
	
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(-200, 1300, 200);
		directionalLight.castShadow = true;
		this.scene.add(directionalLight);
		
		//Skybox
		var skyboxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
		var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x6698FF, side: THREE.BackSide });
		var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
		this.scene.add(skybox);
	}

	load(element) {
		this.init(element);
		world = new World(keyboardStatus, anguloCamera, objMovable, keyboard, this.finishGame, this.gifts);
		world.setObject(ball);
	}

	render() {
		world.moves(keyboard);
		if (this.camera) {
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
			this.camera.position.set(-distanciaCamera * Math.cos(anguloCamera), 200, distanciaCamera * Math.sin(anguloCamera));
			this.camera.position.add(world.Obj.position);
			this.camera.lookAt(world.Obj.position);
			this.renderer.render(this.scene, this.camera);
		}
		requestAnimationId = requestAnimationFrame(this.render.bind(this));
	}

	stopRender() {
		cancelAnimationFrame(requestAnimationId);
	}

	setSize(width, height) {
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
};
