import React from 'react';
import { DialogContentText } from '@material-ui/core';

const status = 'fatal';
const title = 'Games Not Found';
const message = 'Please add your games directories into "/src/games"';

const content = () => React.createElement(
	DialogContentText,
	null,
	message
);

export default {
	status,
	title,
	content,
};
