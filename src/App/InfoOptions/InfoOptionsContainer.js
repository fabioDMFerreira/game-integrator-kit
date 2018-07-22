import { Map } from 'immutable';
import { connect } from 'react-redux';


import InfoOptions from './InfoOptions';

function mapStateToProps(state) {
	let numberOfCatchables,
		countdownEnabled,
		catchablesEnabled,
		countdownTime,
		controlsDescription;

	if (Map.isMap(state)) {
		const gameName = state.get('game');
		if (gameName) {
			numberOfCatchables = state.getIn(['gameState', gameName, 'numberOfCatchables']);
			countdownEnabled = state.getIn(['gameState', gameName, 'countdownEnabled']);
			catchablesEnabled = state.getIn(['gameState', gameName, 'catchablesEnabled']);
			countdownTime = state.getIn(['gameState', gameName, 'countdownTime']);
			controlsDescription = state.get('controlsDescription');
		}
	}

	return {
		numberOfCatchables,
		countdownEnabled,
		catchablesEnabled,
		countdownTime,
		controlsDescription,
	};
}

export default connect(mapStateToProps)(InfoOptions);
