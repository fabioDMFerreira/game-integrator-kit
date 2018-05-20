import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Help } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import Countdown from './Countdown';
import './GameStatus.css';

export const GameStatus = props => (
	<div className="game-status-container">
		<div>
			<Button onClick={props.openMenu}>
				<Menu />
			</Button>
		</div>
		<div>
			<Button onClick={props.openControls}>
				<Help />
			</Button>
		</div>
		<Countdown />
		<div className="controls" />
		<div>
			Items to catch: {props.numberOfCatchables}
		</div>
	</div>
);

GameStatus.propTypes = {
	numberOfCatchables: PropTypes.number,
	openMenu: PropTypes.func.isRequired,
	openControls: PropTypes.func.isRequired,
};

GameStatus.defaultProps = {
	numberOfCatchables: 0,
};

function mapStateToProps(state) {
	let numberOfCatchables;

	if (Map.isMap(state)) {
		numberOfCatchables = state.get('numberOfCatchables');
	}

	return {
		numberOfCatchables,
	};
}

export default connect(mapStateToProps)(GameStatus);
