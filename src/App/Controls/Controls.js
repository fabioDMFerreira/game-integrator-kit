import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { object, func } from 'prop-types';

import { Dialog } from '@material-ui/core';

import './Controls.css';

const Controls = ({ onClose, controls }) => (
	<Dialog open onClose={onClose}>
		<div id="controls-content">
			<ul>
				{
					Object.keys(controls).map((key, index) => <li key={index}>{key} - {controls[key]}</li>)
				}
			</ul>
		</div>
	</Dialog>
);

Controls.propTypes = {
	controls: object,
	onClose: func.isRequired,
};

Controls.defaultProps = {
	controls: {},
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
