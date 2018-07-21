import React from 'react';
import PropTypes from 'prop-types';

const Countdown = ({ time }) => <span>{time}</span>;


Countdown.propTypes = {
	time: PropTypes.number,
};

Countdown.defaultProps = {
	time: 0,
};

export default Countdown;

