function capitalizeFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1);
}

export default function getGames(results) {
	let games = {},
		gamesNames,
		dirContent;

	const keys = results.keys();


	games = keys.reduce(
		(gamePathsObject, gamePath) => {
			// extract game folder name
			const nameOfGame = gamePath.match(/^.\/(\w*)\/index.js$/)[1];

			gamePathsObject[capitalizeFirstLetter(nameOfGame)] = '';

			return gamePathsObject;
		}
		, {},
	);

	gamesNames = Object.keys(games);

	dirContent = keys.map(results);
	dirContent.map((value, index) => {
		games[gamesNames[index]] = value.default;
	});

	return games;
}
