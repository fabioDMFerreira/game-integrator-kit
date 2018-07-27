export default {
	stop: 10,
	velocity,
	move() {
		obstacles.move();
		ground.position.z -= this.velocity;
		chunks.progress += this.velocity;
	},
	platform: null,
	setVelocity(v) {
		v = (v < velocity) ? velocity : v;
		this.velocity = v;
		const velAux = Math.round(v * 100) / 100;
		$('#valueVelocity').html(velAux);
		gv.refresh(velAux);
	},
	accelerate(value) {
		value = value || acceleration;
		this.setVelocity(this.velocity + value);
	},
	setPlatform(p) {
		p = p || Math.round(optionsPlatforms.number / 2);
		this.platform = p;
		$('#valueActivePlatform').html(p);
	},
	validatePlatform(p) {
		if (p == null) {
			p = Math.round(optionsPlatforms.number / 2);
		} else if (p > optionsPlatforms.number) {
			p = optionsPlatforms.number;
		} else if (p < 1) {
			p = 1;
		}
		return p;
	},
	getPlatformPosition(p) { // return position.x of the p platform
		p = this.validatePlatform(p);
		return optionsPlatforms.distance * (p - 1);
	},
	setPlatformPosition(p) {
		p = this.validatePlatform(p);
		const position = this.getPlatformPosition(p);
		this.setPlatform(p);
		return position;
	},
	leftPlatformPosition() {
		return this.setPlatformPosition(this.platform + 1);
	},
	rightPlatformPosition() {
		return this.setPlatformPosition(this.platform - 1);
	},
};
