import getGames from './getGamesFromSrc';

const games = getGames(require.context('./src', true, /^.\/\w*\/index.js$/));


export default games;
