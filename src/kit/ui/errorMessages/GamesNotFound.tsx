import React from 'react';
import { DialogContentText } from '@material-ui/core';

const status = 'fatal' as const;
const title = 'Games Not Found';
const message = 'Please add your games directories into "/src/games"';

const content = (): React.ReactElement => (
  <DialogContentText>
    {message}
  </DialogContentText>
);

interface ErrorMessage {
  status: typeof status;
  title: string;
  content: () => React.ReactElement;
}

const errorMessage: ErrorMessage = {
  status,
  title,
  content,
};

export default errorMessage;
