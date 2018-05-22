import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const Countdown = props => <span>{props.countdownTime}</span>;


Countdown.propTypes = {
	countdownTime: PropTypes.number,
};

Countdown.defaultProps = {
	countdownTime: 0,
};

function mapStateToProps(state) {
	let countdownTime;

	if (Map.isMap(state)) {
		countdownTime = state.get('countdownTime');
	}

	return {
		countdownTime,
	};
}

export default connect(mapStateToProps)(Countdown);
