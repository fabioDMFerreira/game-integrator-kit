import { connect } from 'react-redux';

import Popup from './Popup';

function mapStateToProps(state) {
	const content = state.get('popupContent');

	return {
		content,
	};
}

export default connect(mapStateToProps)(Popup);
