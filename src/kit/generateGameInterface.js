export default (kit, gameName) => ({
	enableCountdown: kit.enableCountdown.bind(kit, gameName),
	enableCatchables: kit.enableCatchables.bind(kit, gameName),
	keyboard: kit.keyboard,
	endOfGame: kit.endOfGame.bind(kit),
});
