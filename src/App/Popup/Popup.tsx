import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

interface PopupProps {
  title?: string;
  status?: string;
  content?: React.ReactElement | (() => React.ReactElement) | string;
  onClose: () => void;
}

function Popup({
  title = '',
  status = '',
  content = <div />,
  onClose,
}: PopupProps): React.ReactElement {
  return (
    <Dialog
      open
      onClose={onClose}
      disableBackdropClick={status === 'fatal'}
      disableEscapeKeyDown={status === 'fatal'}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {(() => {
          if (content instanceof Function) {
            return content();
          }
          return content;
        })()}
      </DialogContent>
    </Dialog>
  );
}

export default Popup;
