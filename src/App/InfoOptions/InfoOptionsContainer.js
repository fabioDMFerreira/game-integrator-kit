import { Map } from 'immutable';
import { connect } from 'react-redux';


import InfoOptions from './InfoOptions';

function mapStateToProps(state) {
	let numberOfCatchables,
		countdownEnabled,
		catchablesEnabled;

	if (Map.isMap(state)) {
		numberOfCatchables = state.get('numberOfCatchables');
		countdownEnabled = state.get('countdownEnabled');
		catchablesEnabled = state.get('catchablesEnabled');
	}

	return {
		numberOfCatchables,
		countdownEnabled,
		catchablesEnabled,
	};
}

export default connect(mapStateToProps)(InfoOptions);
