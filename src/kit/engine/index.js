import * as THREE from 'three';

export default class GameEngine {

	constructor(game) {
		this.game = game;
	}

	load(element) {
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0xEEEEEE, 1.0);
		this.renderer.clear();
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.antialias = true;
		this.renderer.shadowMapAutoUpdate = true;
		element.append(this.renderer.domElement);
	
		this.scene = new THREE.Scene(); //onde se insere a lista de objetos a mostrar
        this.game.setScene(this.scene);		
	}

	render() {
		this.game.onRender();
		if(this.camera){
			this.renderer.render(this.scene, this.camera);		
		}
		this.requestAnimationId = requestAnimationFrame(this.render.bind(this));
	}

	stopRender() {
		cancelAnimationFrame(this.requestAnimationId);
	}

	setSize(width, height) {
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
		this.game.setCamera(this.camera);
	}
};
