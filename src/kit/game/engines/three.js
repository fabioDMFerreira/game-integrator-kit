import * as THREE from 'three';
import Game from '../index';

export default class ThreeEngine extends Game {
	constructor() {
		super();
		this.renderer = this.buildRender();
		this.scene = new THREE.Scene();
		this.camera = null;
		this.requestAnimationId = null;

		// array of functions that will be executed on render a frame
		this.onRender = [];
	}

	/**
	 * Add result of rendering to a html element. The game will be renderer in gameContainer html element.
	 * @param {Object} gameContainer - a html element where game will be rendered
	 */
	renderOn(gameContainer) {
		gameContainer.append(this.renderer.domElement);
	}


	/**
	 * Add a function to be executed on render
	 * @param {Function} callback - function that will subscribe to render event
	 * @returns {Boolean} it returns true if it was subscribed with success
	 */
	subscribeRender(callback) {
		if (callback instanceof Function) {
			this.onRender.push(callback);
			return true;
		}

		console.warn('callback should be a function');
		return false;
	}

	render() {
		// execute all functions that were subscribed on render
		this.onRender.forEach(callback => callback());

		if (this.camera) {
			this.renderer.render(this.scene, this.camera);
		}
		this.requestAnimationId = window.requestAnimationFrame(this.render.bind(this));
	}

	stopRender() {
		window.cancelAnimationFrame(this.requestAnimationId);
	}

	setSize(width, height) {
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000);
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	buildRender() {
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0xEEEEEE, 1.0);
		renderer.clear();
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.antialias = true;
		renderer.shadowMapAutoUpdate = true;
		return renderer;
	}
}
