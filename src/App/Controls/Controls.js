import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import PropTypes from 'prop-types';

import './Controls.css';

const Controls = props => (
	<div id="controls-container">
		<div id="controls-content">
			{props.children}
		</div>
	</div>
);

Controls.propTypes = {
	children: PropTypes.element,
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
