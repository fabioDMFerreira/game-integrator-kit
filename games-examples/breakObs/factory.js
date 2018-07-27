import * as THREE from 'three';

export default {
	getImageMaterial(imagem, repeat) {
		const path = 'imagens/',
			material = THREE.ImageUtils.loadTexture(path + imagem);// dimensions of the image should be potences of 2
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
