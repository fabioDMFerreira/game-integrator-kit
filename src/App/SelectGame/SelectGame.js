import React from 'react';
import { arrayOf, string, func } from 'prop-types';
import { Dialog, DialogContent, Button } from '@material-ui/core';

const SelectGame = ({ games, select }) => (
	<Dialog open>
		<DialogContent>
			{games
                && games.length
                && games.map(game => <Button key={game} onClick={() => select(game)}>{game}</Button>)}
		</DialogContent>
	</Dialog>
);

SelectGame.propTypes = {
	games: arrayOf(string),
	select: func.isRequired,
};

SelectGame.defaultProps = {
	games: [],
};

export default SelectGame;
