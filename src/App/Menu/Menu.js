import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Menu.css';

export class Menu extends Component {
	constructor() {
		super();
		this.newGame = this.newGame.bind(this);
		this.continueGame = this.continueGame.bind(this);
	}

	newGame() {
		this.props.reload();
	}

	continueGame() {
		this.props.continue();
	}

	render() {
		return (
			<div className="darken-background">
				<div className="info">
					{this.props.gameLost && <h1 id="perdeste">Won!!!</h1>}
					{this.props.gameWon && <h1 id="ganhaste">Lost!!!</h1>}
					<ul>
						{this.props.gameStopped && <li id="continuar"><button onClick={this.continueGame}>Continue</button></li>}
						<li id="novo_jogo" ><button onClick={this.newGame}>New Game</button></li>
					</ul>
				</div>
			</div>
		);
	}
}

Menu.propTypes = {
	gameWon: PropTypes.bool,
	gameLost: PropTypes.bool,
	gameStopped: PropTypes.bool,
	reload: PropTypes.func.isRequired,
	continue: PropTypes.func.isRequired,
};

Menu.defaultProps = {
	gameWon: false,
	gameLost: false,
	gameStopped: false,
};

const mapStateToProps = (state) => {
	const gameWon = state.get('gameWon'),
		gameLost = state.get('gameLost'),
		gameStopped = state.get('gameStopped');

	return {
		gameWon,
		gameLost,
		gameStopped,
	};
};

export default connect(mapStateToProps)(Menu);
