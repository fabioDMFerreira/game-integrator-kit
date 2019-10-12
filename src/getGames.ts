function capitalizeFirstLetter(str: string) {
	return str[0].toUpperCase() + str.slice(1);
}

export function loadGamesFromContext(results: any) {
	const keys = results.keys(),
		// extract game folder name
		gamesNames = keys.map((gamePath: string) => {
			const matchPath = gamePath.match(/^.\/(\w*)\/index.js$/);
			const nameOfGame = matchPath ? matchPath[1] : "";

			return capitalizeFirstLetter(nameOfGame);
		}),
		// Import index javascript file from the games
		dirContent = keys.map(results),
		// Assign file game to its description in games list
		games = dirContent.reduce((gamesList: any, value: any, index: number) => ({
			...gamesList,
			[gamesNames[index]]: value.default,
		}), {});


	return games;
}

export default () =>
	loadGamesFromContext(require.context('./games', true, /^.\/\w*\/index.js$/));

