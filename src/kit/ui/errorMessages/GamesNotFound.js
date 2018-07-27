import React from 'react';
import { DialogContentText } from '@material-ui/core';


export const status = 'fatal',
	title = 'Games Not Found',
	content = () => (
		<DialogContentText>
			{'Please add your games directories into "/src/games".'}
		</DialogContentText>
	);

export default {
	status,
	title,
	content,
};
