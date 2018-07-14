import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { element, func } from 'prop-types';

import { Dialog } from '@material-ui/core';

import './Controls.css';

const Controls = ({ onClose, children }) => (
	<Dialog open onClose={onClose}>
		{children}
	</Dialog>
);

Controls.propTypes = {
	children: element,
	onClose: func.isRequired,
};

Controls.defaultProps = {
	children: <div />,
};


function mapStateToProps(state) {
	let controls;

	if (Map.isMap(state)) {
		controls = state.get('controlsDescription');
	}

	return {
		controls,
	};
}

export default connect(mapStateToProps)(Controls);
