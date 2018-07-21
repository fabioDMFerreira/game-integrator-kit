import { Map } from 'immutable';
import { connect } from 'react-redux';


import InfoOptions from './InfoOptions';

function mapStateToProps(state) {
	let numberOfCatchables,
		countdownEnabled,
		catchablesEnabled,
		countdownTime,
		gameName;

	if (Map.isMap(state)) {
		gameName = state.get('game');
		if (gameName) {
			numberOfCatchables = state.getIn(['gameState', gameName, 'numberOfCatchables']);
			countdownEnabled = state.getIn(['gameState', gameName, 'countdownEnabled']);
			catchablesEnabled = state.getIn(['gameState', gameName, 'catchablesEnabled']);
			countdownTime = state.getIn(['gameState', gameName, 'countdownTime']);
		}
	}

	return {
		numberOfCatchables,
		countdownEnabled,
		catchablesEnabled,
		countdownTime,
	};
}

export default connect(mapStateToProps)(InfoOptions);
