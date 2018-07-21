import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Button } from '@material-ui/core';

const Menu = ({
	continueGame, gameWon, gameLost, gameStopped, reload, pauseGameAndShowGamesList,
}) => (
	<Dialog onClose={continueGame} open>
		<DialogContent>
			<div className="info">
				{gameWon && <h1>Congratulations!!!</h1>}
				{gameLost && <h1>Try again!!!</h1>}
				<ul>
					{gameStopped && !gameWon && !gameLost && <li><Button id="continue-game" onClick={continueGame}>Continue</Button></li>}
					<li ><Button id="new-game" onClick={reload}>New Game</Button></li>
					<li><Button id="select-game" onClick={pauseGameAndShowGamesList}>Select another game</Button></li>
				</ul>
			</div>
		</DialogContent>
	</Dialog>
);


Menu.propTypes = {
	gameWon: PropTypes.bool,
	gameLost: PropTypes.bool,
	gameStopped: PropTypes.bool,
	reload: PropTypes.func,
	continueGame: PropTypes.func,
	selectGame: PropTypes.func,
};

Menu.defaultProps = {
	reload: () => { },
	continueGame: () => { },
	selectGame: () => {},
	gameWon: false,
	gameLost: false,
	gameStopped: false,
};

export default Menu;
