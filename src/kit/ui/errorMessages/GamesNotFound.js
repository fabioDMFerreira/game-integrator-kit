import React from 'react';
import { DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';


export default () => (
	<div>
		<DialogTitle>
			{'Games not Found'}
		</DialogTitle>
		<DialogContent>
			<DialogContentText>
				{'Please add your games directories into "/src/games".'}
			</DialogContentText>
		</DialogContent>
	</div>
);
