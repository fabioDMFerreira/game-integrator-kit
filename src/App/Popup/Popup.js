import React from 'react';
import { element, func, oneOfType, string } from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

const Popup = ({
	title, status, content, onClose,
}) => (
	<Dialog
		open
		onClose={onClose}
		disableBackdropClick={status === 'fatal'}
		disableEscapeKeyDown={status === 'fatal'}
	>
		<DialogTitle>
			{title}
		</DialogTitle>
		<DialogContent>
			{
				(() => {
					if (content instanceof Function) {
						return content();
					}

					return content;
				})()
			}
		</DialogContent>
	</Dialog >
);

Popup.propTypes = {
	content: oneOfType([element, func, string]),
	onClose: func.isRequired,
	title: string,
	status: string,
};

Popup.defaultProps = {
	content: <div />,
	status: '',
	title: '',
};

export default Popup;
