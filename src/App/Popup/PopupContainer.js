import { connect } from 'react-redux';

import Popup from './Popup';

function mapStateToProps(state) {
	const content = state.get('popupContent'),
		title = state.get('popupTitle'),
		status = state.get('popupStatus');

	return {
		content,
		title,
		status,
	};
}

export default connect(mapStateToProps)(Popup);
