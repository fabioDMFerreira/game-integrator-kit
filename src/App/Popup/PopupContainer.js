import { connect } from 'react-redux';

import Popup from './Popup';

function mapStateToProps(state) {
	const Content = state.get('popupContent');

	return {
		Content,
	};
}

export default connect(mapStateToProps)(Popup);
