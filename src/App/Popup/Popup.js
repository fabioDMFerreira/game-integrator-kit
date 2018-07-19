import React from 'react';
import { element, func, oneOfType, string } from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';

const Popup = ({ content, onClose }) => (
	<Dialog open onClose={onClose}>
		<DialogContent>
			{content}
		</DialogContent>
	</Dialog >
);

Popup.propTypes = {
	content: oneOfType([element, func, string]),
	onClose: func.isRequired,
};

Popup.defaultProps = {
	content: <div />,
};

export default Popup;
