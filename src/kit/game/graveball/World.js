export default class World {
	constructor(keyboardStatus, anguloCamera, objMovable, keyboard, endOfGame, objCatchable) {
		this.app = 'GraveBall :)';
		this.gravity = 0.5;

		this.keyboardStatus = keyboardStatus;
		this.anguloCamera = anguloCamera;
		this.objMovable = objMovable;
		this.keyboard = keyboard;
		this.endOfGame = endOfGame;
		this.objCatchable = objCatchable;

		this.orderRotation = 'XYZ';
	}

	setCameraAngle(angle) {
		this.anguloCamera = angle;
	}

	setObject(obj) {
		this.Obj = obj;
	}

	updateVelocity() {
		if (this.Obj.Falling) {
			this.Obj.addAccelarationY(this.gravity);
		} else {
			if (this.Obj.inclination.z) {
				this.Obj.addAccelarationX(-this.gravity * Math.sin(this.Obj.inclination.z));
			}
			if (this.Obj.inclination.x) {
				this.Obj.addAccelarationZ(this.gravity * Math.sin(this.Obj.inclination.x));
			}
		}

		this.Obj.updatePosition();

		for (let i = 0; i < this.objMovable.length; i++) {
			if (this.objMovable[i].Falling) {
				this.objMovable[i].addAccelarationY(this.gravity);
			} else {
				if (this.objMovable[i].inclination.z) {
					this.objMovable[i].addAccelarationX(-this.gravity * Math.sin(this.objMovable[i].inclination.z));
				}
				if (this.objMovable[i].inclination.x) {
					this.objMovable[i].addAccelarationZ(this.gravity * Math.sin(this.objMovable[i].inclination.x));
				}
			}
			this.objMovable[i].updatePosition();
		}
	}

	cleanKeyboardKey(id) {
		const idSpl = id.split('');
		for (const x in idSpl) {
			if (this.keyboard[parseInt(idSpl[x].charCodeAt(0), 10)]) {
				this.keyboard[parseInt(idSpl[x].charCodeAt(0), 10)] = '';
			}
		}
	}

	fimJogo() {
		if (this.Obj.position.y < -100) {
			this.endOfGame();
		}
		if (this.objCatchable.length === 0) {
			this.endOfGame(1);
		}
	}

	moves(keyboard) {
		if (!this.Obj.Falling && this.keyboardStatus) {
			if (this.keyboard[87] && this.Obj.moveFlag.w) { // W
				// this.Obj.addAccelarationZ(0.4);
				this.Obj.addAccelarationZ(Math.sin(Math.PI + this.anguloCamera) * 0.4);
				this.Obj.addAccelarationX(-Math.cos(Math.PI + this.anguloCamera) * 0.4);
				this.orderRotation = 'XYZ';
				this.Obj.moveFlag.d = true;
				this.Obj.moveFlag.s = true;
				this.Obj.moveFlag.a = true;
			}
			if (this.keyboard[83] && this.Obj.moveFlag.s) { // S
				// this.Obj.addAccelarationZ(-0.4);
				this.Obj.addAccelarationZ(-Math.sin(Math.PI + this.anguloCamera) * 0.4);
				this.Obj.addAccelarationX(Math.cos(Math.PI + this.anguloCamera) * 0.4);
				this.orderRotation = 'XYZ';
				this.Obj.moveFlag.w = true;
				this.Obj.moveFlag.d = true;
				this.Obj.moveFlag.a = true;
			}
			if (this.keyboard[65] && this.Obj.moveFlag.a) { // A
				// this.Obj.addAccelarationX(0.4);
				this.Obj.addAccelarationZ(-Math.sin(Math.PI / 2 + this.anguloCamera) * 0.4);
				this.Obj.addAccelarationX(Math.cos(Math.PI / 2 + this.anguloCamera) * 0.4);
				this.orderRotation = 'ZYX';
				this.Obj.moveFlag.w = true;
				this.Obj.moveFlag.s = true;
				this.Obj.moveFlag.d = true;
			}
			if (this.keyboard[68] && this.Obj.moveFlag.d) { // D
				// this.Obj.addAccelarationX(-0.4);
				this.Obj.addAccelarationZ(Math.sin(Math.PI / 2 + this.anguloCamera) * 0.4);
				this.Obj.addAccelarationX(-Math.cos(Math.PI / 2 + this.anguloCamera) * 0.4);
				this.orderRotation = 'ZYX';
				this.Obj.moveFlag.w = true;
				this.Obj.moveFlag.s = true;
				this.Obj.moveFlag.a = true;
			}
			if (this.keyboard[32]) {
				this.Obj.addAccelarationY(-15);
			}
		}

		this.Obj.updateRotationOrder(this.orderRotation);

		this.updateVelocity();

		this.fimJogo();

		return 1;
	}
}
