import * as THREE from 'three';

const rays = {};

rays.up = [new THREE.Vector3(0, 1, 0),
	new THREE.Vector3(1, 1, 0),
	new THREE.Vector3(-1, 1, 0),
	new THREE.Vector3(0, 1, 1),
	new THREE.Vector3(0, 1, -1),
	new THREE.Vector3(-1, 1, -1),
	new THREE.Vector3(-1, 1, 1),
	new THREE.Vector3(1, 1, -1),
	new THREE.Vector3(1, 1, 1),
];
rays.down = [new THREE.Vector3(0, -1, 0),
	new THREE.Vector3(1, -1, 0),
	new THREE.Vector3(-1, -1, 0),
	new THREE.Vector3(0, -1, 1),
	new THREE.Vector3(0, -1, -1),
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(-1, -1, 1),
	new THREE.Vector3(1, -1, -1),
	new THREE.Vector3(1, -1, 1),
];
rays.a = [new THREE.Vector3(0, 1, 0),
	new THREE.Vector3(1, 0, 0), // diretamente para a esquerda
	// new THREE.Vector3(1,1,0),
	// new THREE.Vector3(1,-1,0),

	new THREE.Vector3(1, 0, 1), // esquerda frente
	// new THREE.Vector3(1,1,1),
	// new THREE.Vector3(1,-1,1),

	new THREE.Vector3(1, 0, -1), // esquerda tras
	// new THREE.Vector3(1,1,-1),
	// new THREE.Vector3(1,-1,-1)
];
rays.d = [new THREE.Vector3(0, 1, 0),
	new THREE.Vector3(-1, 0, 0), // diretamente para a direita
	// new THREE.Vector3(-1,1,0),
	// new THREE.Vector3(-1,-1,0),

	new THREE.Vector3(-1, 0, 1), // direita frente
	// new THREE.Vector3(-1,1,1),
	// new THREE.Vector3(-1,-1,1),

	new THREE.Vector3(-1, 0, -1), // direita tras
	// new THREE.Vector3(-1,1,-1),
	// new THREE.Vector3(-1,-1,-1)
];
rays.w = [new THREE.Vector3(0, 1, 0),
	new THREE.Vector3(0, 0, 1), // diretamente para a frente
	// new THREE.Vector3(0,1,1),
	// new THREE.Vector3(0,-1,1),

	new THREE.Vector3(-1, 0, 1), // direita frente
	// new THREE.Vector3(-1,1,1),
	// new THREE.Vector3(-1,-1,1),

	new THREE.Vector3(1, 0, 1), // esquerda frente
	// new THREE.Vector3(1,1,1),
	// new THREE.Vector3(1,-1,1),
];
rays.s = [new THREE.Vector3(0, 1, 0),
	new THREE.Vector3(0, 0, -1), // diretamente para tras
	// new THREE.Vector3(0,1,-1),
	// new THREE.Vector3(0,-1,-1),

	new THREE.Vector3(-1, 0, -1), // direita tras
	// new THREE.Vector3(-1,1,-1),
	// new THREE.Vector3(-1,-1,-1),

	new THREE.Vector3(1, 0, -1), // esquerda tras
	// new THREE.Vector3(1,1,-1),
	// new THREE.Vector3(1,-1,-1)
];


export default function (obj, Radius, maxVel, rot, objMovable, platform, objCatchable, scene, catchables) {
	obj.Radius = Radius;
	obj.translation = {};
	obj.translation.z = new THREE.Vector3(0, 0, 1);
	obj.translation.x = new THREE.Vector3(1, 0, 0);
	obj.Velocity = new THREE.Vector3(0, 0, 0);
	obj.Falling = false;
	obj.inclination = {};
	obj.inclination.x = -1;
	obj.inclination.z = -1;
	obj.MaxVelocity = maxVel;
	obj.moveFlag = {};
	obj.moveFlag.w = true;
	obj.moveFlag.s = true;
	obj.moveFlag.a = true;
	obj.moveFlag.d = true;
	obj.RotationFlag = rot;
	obj.atrito = 0;
	obj.aplicaAtrito = 0.2;
	obj.caster = new THREE.Raycaster();

	// Aplicar forcas
	obj.addAccelaration = function (axe, value) {
		if (value !== 0 && obj.Velocity[axe] + value <= obj.MaxVelocity && obj.Velocity[axe] + value >= -obj.MaxVelocity) {
			obj.Velocity[axe] = obj.Velocity[axe] + value;
		}
	};
	obj.addAccelarationX = function (value) {
		obj.addAccelaration('x', value);
	};
	obj.addAccelarationZ = function (value) {
		obj.addAccelaration('z', value);
	};
	obj.addAccelarationY = function (value) {
		obj.addAccelaration('y', value);
	};

	// aplicar diretamente velocidades (!warning)
	obj.setVelocity = function (axe, value) {
		obj.Velocity.axe = value;
	};
	obj.setVelocityX = function (value) {
		obj.setVelocity('x', value);
	};
	obj.setVelocityZ = function (value) {
		obj.setVelocity('z', value);
	};
	obj.setVelocityY = function (value) {
		obj.setVelocity('y', value);
	};

	obj.removeCatchable = function (object) {
		scene.remove(object);
		objCatchable = objCatchable.filter(value => value !== object);
		catchables.decrease();
	};

	// detectar colisões
	obj.detectCollisionUp = function () {
		if (!(objCatchable instanceof Array)) {
			return;
		}

		for (const id in rays.up) {
			obj.caster.set(obj.position, rays.up[id]);
			const intersect = obj.caster.intersectObjects(objCatchable);
			if (intersect.length > 0 && intersect[0].distance < obj.Radius + obj.Velocity.y + 15) {
				obj.removeCatchable(intersect[0].object);
			}
		}

		let auxIntersect = [];// onde vai ficar informacao da colisao
		auxIntersect[0] = {};
		auxIntersect[0].distance = 100000;
		let auxRaio;


		for (const id in rays.up) {
			obj.caster.set(obj.position, rays.up[id]);
			const intersect = obj.caster.intersectObjects(platform);

			if (intersect.length !== 0 && intersect[0].distance < obj.Radius + obj.Velocity.y) {
				obj.setVelocityY((intersect[0].distance - obj.Radius) * -1);
			}

			if (intersect.length !== 0 && intersect[0].distance < obj.Radius && intersect[0].distance < auxIntersect[0].distance) {
				auxIntersect = intersect;
				auxRaio = rays.up[id];
			}
		}


		if (auxIntersect[0].distance !== 100000) {
			if (auxIntersect[0].distance < obj.Velocity.y) {
				obj.setVelocityY(auxIntersect[0].distance);
			}
			obj.position.add(auxRaio.clone().multiplyScalar(-(obj.Radius - auxIntersect[0].distance + 10)));
			// obj.position.y-=obj.Radius-auxIntersect[0].distance;
			return 1;
		}
		return 0;
	};

	obj.detectCollisionDown = function () {
		// var count=0;
		for (const id in rays.down) {
			obj.caster.set(obj.position, rays.down[id]);
			const intersect = obj.caster.intersectObjects(objCatchable);
			if (intersect.length > 0 && intersect[0].distance < obj.Radius + obj.Velocity.y + 15) {
				obj.removeCatchable(intersect[0].object);
			}
		}

		let auxIntersect = [];// onde vai ficar informacao da colisao
		auxIntersect[0] = {};
		auxIntersect[0].distance = 100000;
		let auxRaio;

		for (const id in rays.down) {
			obj.caster.set(obj.position, rays.down[id]);
			const intersect = obj.caster.intersectObjects(platform);

			if (intersect.length !== 0 && intersect[0].distance < obj.Radius + obj.Velocity.y) {
				obj.setVelocityY(intersect[0].distance - obj.Radius);
			}

			if (intersect.length !== 0 && intersect[0].distance < obj.Radius && intersect[0].distance < auxIntersect[0].distance) {
				auxIntersect = intersect;
				auxRaio = rays.down[id];
			}
			/* if((intersect.length===0)||(intersect.length>0 && intersect[0].distance > obj.Radius)){
				count++;
			}

			else{
				obj.Falling=false;
				obj.updateInclinationTranslation(intersect[0]);
				//obj.position.y-=obj.Radius-intersect[0].distance;
				return 1
			} */
		}

		if (auxIntersect[0].distance !== 100000) {
			obj.Falling = false;
			obj.updateInclinationTranslation(auxIntersect[0], auxRaio);
			return 1;
		}

		obj.Falling = true;
		obj.translation.x.y = 0;
		obj.translation.z.y = 0;// a bola deixa de poder andar no eixo dos yy porque nao ha plano que a ajude a subir
		return 0;
	};

	obj.collision = function (tecla, eixo) {
		// detectar objectos que se apanham
		for (const id in rays[tecla]) {
			obj.caster.set(obj.position, rays[tecla][id]);
			const intersect = obj.caster.intersectObjects(objCatchable);
			if (intersect.length > 0 && intersect[0].distance < obj.Radius + obj.Velocity[eixo] + 15) {
				obj.removeCatchable(intersect[0].object);
			}
		}
		// detectar objectos que se podem mover
		for (const id in rays[tecla]) {
			obj.caster.set(obj.position, rays[tecla][id]); // atribui ponto de referencia e direcçao
			const intersect = obj.caster.intersectObjects(objMovable);// procura numa lista de objectos os que intersecta
			if (intersect.length > 0 && intersect[0].distance < obj.Radius + obj.Velocity[eixo] + 15) { // se ha algum objecto intersectado faz determinada acção
				intersect[0].object.Velocity[eixo] = obj.Velocity[eixo];
			}
		}
		// detectar objectos inamoviveis
		for (const id in rays[tecla]) {
			obj.caster.set(obj.position, rays[tecla][id]);
			const intersect = obj.caster.intersectObjects(platform);
			if (intersect.length > 0 && intersect[0].distance < obj.Radius + obj.Velocity[eixo]) {
				if (tecla === 'a' || tecla === 'w') { obj.position[eixo] -= obj.Radius - intersect[0].distance + obj.Velocity[eixo]; } else { obj.position[eixo] += obj.Radius - intersect[0].distance + obj.Velocity[eixo]; }
				obj.moveFlag[tecla] = false;
				return 1;
			}
		}
		return 0;
	};


	obj.detectCollisionX = function () {
		if (this.Velocity.x > 0) {
			if (obj.collision('a', 'x')) { return 1; }
		} else if (this.Velocity.x < 0) {
			if (obj.collision('d', 'x')) { return 1; }
		}
		return 0;
	};

	obj.detectCollisionZ = function () {
		if (this.Velocity.z > 0) {
			if (obj.collision('w', 'z')) { return 1; }
		} else if (this.Velocity.z < 0) {
			if (obj.collision('s', 'z')) { return 1; }
		}
		return 0;
	};


	obj.detectCollision = function () {
		// console.log(obj.Velocity.y);
		if (obj.detectCollisionUp() && obj.Velocity.y < 0) {
			obj.setVelocityY(0);
		}
		if (obj.detectCollisionDown() && obj.Velocity.y > 0) {
			obj.setVelocityY(0);
		}
		if (obj.detectCollisionZ()) {
			obj.setVelocityZ(0);
		}
		if (obj.detectCollisionX()) {
			obj.setVelocityX(0);
		}
	};

	// update
	obj.updateRotationOrder = function (order) { // order tem de receber uma string que tenha os caracters X,Y e Z
		obj.rotation.order = order;
	};

	obj.updateInclinationTranslation = function (objPlatform, raio) {
		// console.log(objPlatform.object.rotation);

		if (objPlatform.object.rotation.z) {
			obj.translation.x.set(Math.cos(objPlatform.object.rotation.z), Math.sin(objPlatform.object.rotation.z), 0);
		} else {
			obj.translation.x.set(1, 0, 0);
		}

		if (objPlatform.object.rotation.x) {
			obj.translation.z.set(0, Math.sin(objPlatform.object.rotation.x), Math.cos(objPlatform.object.rotation.x));
		} else {
			obj.translation.z.set(0, 0, 1);
		}

		obj.inclination.x = objPlatform.object.rotation.x;
		obj.inclination.z = objPlatform.object.rotation.z;

		if (!obj.RotationFlag) { // se for um cubo, ao passar por cima de alguma rampa, ele inclina-se
			obj.rotation.x = objPlatform.object.rotation.x;
			obj.rotation.z = objPlatform.object.rotation.z;
		}

		if (objPlatform.distance <= obj.Radius) {
			obj.position.add(raio.clone().multiplyScalar(-(obj.Radius - objPlatform.distance + 10)));
		}

		obj.atrito = objPlatform.object.aplicaAtrito;
	};

	obj.updatePosition = function () {
		obj.detectCollision();

		if (obj.Velocity.z && !obj.Falling) {
			if (obj.Velocity.z > 0) {
				if (obj.Velocity.z - obj.atrito < 0) { obj.Velocity.z = 0; }// força de obj.atrito
				else { obj.addAccelarationZ(-obj.atrito); }
			} else if (obj.Velocity.z < 0) {
				if (obj.Velocity.z + obj.atrito > 0) { obj.Velocity.z = 0; }// força de obj.atrito
				else { obj.addAccelarationZ(obj.atrito); }
			}
		}
		obj.position.add(obj.translation.z.clone().multiplyScalar(obj.Velocity.z));


		if (obj.Velocity.x && !obj.Falling) {
			if (obj.Velocity.x > 0) {
				if (obj.Velocity.x - obj.atrito < 0) { obj.Velocity.x = 0; }// força de obj.atrito
				else { obj.addAccelarationX(-obj.atrito); }
			} else if (obj.Velocity.x < 0) {
				if (obj.Velocity.x + obj.atrito > 0) { obj.Velocity.x = 0; }// força de obj.atrito
				else { obj.addAccelarationX(obj.atrito); }
			}
		}

		obj.position.add(obj.translation.x.clone().multiplyScalar(obj.Velocity.x));

		obj.position.add(new THREE.Vector3(0, -1, 0).clone().multiplyScalar(obj.Velocity.y));

		if (obj.RotationFlag) { // interessa fazer rotacao se for uma bola
			obj.rotation.x += (2 * obj.Velocity.z) / (obj.Radius * Math.PI);
			obj.rotation.z -= (2 * obj.Velocity.x) / (obj.Radius * Math.PI);
		}
	};
}
