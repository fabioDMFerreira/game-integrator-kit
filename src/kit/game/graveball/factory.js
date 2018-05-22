import * as THREE from 'three';

import applyPhysicsRules from './applyPhysicsRules';

import ballTexture from './images/ball.jpg';
import boxTexture from './images/box.jpg';

export class Plate {
	constructor(Z, Y, X, atrito, texture) {
		const z = Z || 100;
		const y = Y || 100;
		const x = X || 100;

		const obj = new THREE.Mesh(new THREE.BoxGeometry(z, y, x), new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(texture) }));
		obj.receiveShadow = true;
		obj.aplicaAtrito = atrito;
		return obj;
	}
}

export class BallObj {
	constructor(radius, objMovable, platform, objCatchable, scene, catchablesInterface) {
		const material = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(ballTexture) });
		const obj = new THREE.Mesh(new THREE.SphereGeometry(radius, 50, 50), material);
		obj.castShadow = true;
		obj.structure = 'ball';
		applyPhysicsRules(obj, radius, 1000, true, objMovable, platform, objCatchable, scene, catchablesInterface);// obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se

		return obj;
	}
}

export class CubeObj {
	constructor(x, y, z) {
		const obj = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(boxTexture) }));
		obj.castShadow = true;
		obj.structure = 'cube';

		applyPhysicsRules(obj, x / 2, 30, false);// obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se

		return obj;
	}
}
