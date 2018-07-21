import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Button } from '@material-ui/core';

const Menu = ({
	continueGame, gameWon, gameLost, gameStopped, reload, finishGame,
}) => (
	<Dialog onClose={continueGame} open>
		<DialogContent>
			<div className="info">
				{gameWon && <h1>Congratulations!!!</h1>}
				{gameLost && <h1>Try again!!!</h1>}
				<ul>
					{gameStopped && !gameWon && !gameLost && <li><Button id="continue-game" onClick={continueGame}>Continue</Button></li>}
					<li ><Button id="new-game" onClick={reload}>New Game</Button></li>
					<li><Button id="finish-game" onClick={finishGame}>Pause and select another game</Button></li>
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
	finishGame: PropTypes.func,
};

Menu.defaultProps = {
	reload: () => { },
	continueGame: () => { },
	finishGame: () => {},
	gameWon: false,
	gameLost: false,
	gameStopped: false,
};

export default Menu;
