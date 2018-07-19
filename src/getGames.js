function capitalizeFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1);
}

export function loadGamesFromContext(results) {
	const keys = results.keys(),
		// extract game folder name
		gamesNames = keys.map((gamePath) => {
			const nameOfGame = gamePath.match(/^.\/(\w*)\/index.js$/)[1];

			return capitalizeFirstLetter(nameOfGame);
		}),
		// Import index javascript file from the games
		dirContent = keys.map(results),
		// Assign file game to its description in games list
		games = dirContent.reduce((gamesList, value, index) => ({
			...gamesList,
			[gamesNames[index]]: value.default,
		}), {});


	return games;
}

export default () =>
	loadGamesFromContext(require.context('./games', true, /^.\/\w*\/index.js$/));

