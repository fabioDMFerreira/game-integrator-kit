import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Help, BlurCircular, Timer } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import Countdown from './Countdown';
import './GameStatus.css';

export const GameStatus = props => (
	<div className="game-status-container">
		<div>
			<Button variant="raised" color="primary" onClick={props.openMenu}>
				<Menu />
			</Button>
		</div>
		<div>
			<Button variant="raised" color="primary" onClick={props.openControls}>
				<Help />
			</Button>
		</div>
		<div className="countdown">
			<Timer /> <Countdown />
		</div>
		<div className="catchables" title="Objects to catch">
			<BlurCircular /> {props.numberOfCatchables}
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
