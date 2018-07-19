import * as THREE from 'three';

import threeEngine from './threeEngine';
import buildWorldObjects from './buildWorldObjects';
import ControlsDescription from './ControlsDescription';

import {
	//  CubeObj,
	BallObj,
} from './factory';
import ballTexture from './images/ball.jpg';
import World from './World';

let anguloCamera = 3 / 2 * Math.PI,
	distanciaCamera = 500,
	keyboardStatus = true;

export default class Graveball extends threeEngine {
	constructor(kit) {
		super();
		// kit.enableCountdown();
		this.platform = [];
		this.objMovable = [];
		this.gifts = [];
		this.keyboard = kit.keyboard.keysPressed;
		this.finishGame = kit.endOfGame.bind(kit);
		this.catchablesInterface = kit.enableCatchables();
		this.setControlsDescription = kit.setControlsDescription.bind(kit);

		this.load();
		this.subscribeRender(this.applyControls.bind(this));
	}

	generateGifts() {
		const ray = new THREE.Raycaster();

		for (let i = 0; i < 1; i++) {
			const material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
			const gift = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), material);
			gift.position.z = Math.floor((10000 * Math.random()) - 5000);
			gift.position.x = Math.floor((10000 * Math.random()) - 5000);
			gift.position.y = 3000;

			ray.set(gift.position, new THREE.Vector3(0, -1, 0));
			const intersect = ray.intersectObjects(this.platform);

			if (intersect.length > 0) {
				gift.position.y = gift.position.y - intersect[0].distance + 100;
				if (intersect.length > 1) {
					console.log(intersect);
					console.log(gift.position);
				}
				// console.log(gift.position);
			}

			this.scene.add(gift);
			this.gifts.push(gift);
		}

		this.catchablesInterface.set(this.gifts.length);
	}

	load() {
		this.objects = buildWorldObjects(this.platform);
		const ball = new BallObj(50, this.objMovable, this.platform, this.gifts, this.scene, this.catchablesInterface);
		ball.position.set(0, 500, 0);

		this.objects.push(ball);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(-200, 1300, 200);
		directionalLight.castShadow = true;
		this.objects.push(directionalLight);

		// Skybox
		const skyboxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
		const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x6698FF, side: THREE.BackSide });
		const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
		this.objects.push(skybox);

		// var cube = new CubeObj(200, 200, 200);
		// this.scene.add(cube);
		// this.platform.push(cube);
		// objMovable.push(cube);
		// cube.position.set(500, 500, 500);
		// world.setObject(cube);

		// add catchable objects
		this.generateGifts();


		this.world = new World(keyboardStatus, anguloCamera, this.objMovable, this.keyboard, this.finishGame, this.gifts, this.catchables);
		this.world.setObject(ball);

		this.objects.forEach(element => this.scene.add(element));

		this.setControlsDescription(ControlsDescription);
	}

	applyControls() {
		if (!this.world) {
			return;
		}
		this.world.moves(this.keyboard);

		if (this.gifts.length === 0) {
			this.finishGame(1);
			this.stopRender();
		}

		if (this.camera) {
			if (this.keyboard[39]) {
				anguloCamera -= 1 / 100 * Math.PI;
				this.world.setCameraAngle(anguloCamera);
			}

			if (this.keyboard[37]) {
				anguloCamera += 1 / 100 * Math.PI;
				this.world.setCameraAngle(anguloCamera);
			}

			if (this.keyboard[38]) {
				distanciaCamera -= 5;
			}

			if (this.keyboard[40]) {
				distanciaCamera += 5;
			}
			this.camera.position.set(-distanciaCamera * Math.cos(anguloCamera), 200, distanciaCamera * Math.sin(anguloCamera));
			this.camera.position.add(this.world.Obj.position);
			this.camera.lookAt(this.world.Obj.position);
		}
	}
}
