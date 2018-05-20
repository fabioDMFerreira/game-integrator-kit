import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Countdown from './Countdown';
import './GameStatus.css';

export const GameStatus = props => (
	<div className="game-status-container">
		<Countdown />
		<div className="controls" />
		<div>
				Items to catch: {props.numberOfCatchables}
		</div>
	</div>
);

GameStatus.propTypes = {
	numberOfCatchables: PropTypes.number,
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
