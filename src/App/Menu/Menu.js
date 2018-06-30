import React from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const Menu = props =>
	(
		<div className="menu-container">
			<div className="info">
				{props.gameWon && <h1>Congratulations!!!</h1>}
				{props.gameLost && <h1>Try again!!!</h1>}
				<ul>
					{props.gameStopped && !props.gameWon && !props.gameLost && <li><Button id="continue-game" onClick={props.continue}>Continue</Button></li>}
					<li ><Button id="new-game" onClick={props.reload}>New Game</Button></li>
				</ul>
			</div>
		</div>
	);


Menu.propTypes = {
	gameWon: PropTypes.bool,
	gameLost: PropTypes.bool,
	gameStopped: PropTypes.bool,
	reload: PropTypes.func,
	continue: PropTypes.func,
};

Menu.defaultProps = {
	reload: () => {},
	continue: () => { },
	gameWon: false,
	gameLost: false,
	gameStopped: false,
};

export default Menu;
