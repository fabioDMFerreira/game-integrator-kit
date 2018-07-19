export default kit => ({
	enableCountdown: kit.enableCountdown.bind(kit),
	enableCatchables: kit.enableCatchables.bind(kit),
	keyboard: kit.keyboard,
	endOfGame: kit.endOfGame.bind(kit),
	setControlsDescription: kit.setControlsDescription.bind(kit),
});
