import Game from './Kit/Game';

const games: { [key: string]: Game } = {},
	gamesContext = require.context('./games', true, /index\.js$/);

gamesContext.keys().forEach((key) => {
	const gameKey = key.split('/')[1];
	games[gameKey] = gamesContext(key).default;
});

const getGames = () => {
	if (!Object.keys(games).length) {
		throw new Error('No games found');
	}

	return Object.values(games);
};

export default getGames;

