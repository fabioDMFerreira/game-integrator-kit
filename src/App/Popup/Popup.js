import React from 'react';
import { element, func, oneOfType } from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';

const Popup = ({ Content, onClose }) => (
	<Dialog open onClose={onClose}>
		<DialogContent>
			<Content />
		</DialogContent>
	</Dialog >
);

Popup.propTypes = {
	Content: oneOfType([element, func]),
	onClose: func.isRequired,
};

Popup.defaultProps = {
	Content: <div />,
};

export default Popup;
