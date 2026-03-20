import { connect } from 'react-redux';
import { Map } from 'immutable';
import React from 'react';

import Popup from './Popup';

interface PopupState {
  content?: React.ReactElement | (() => React.ReactElement) | string;
  title?: string;
  status?: string;
}

const mapStateToProps = (state: Map<string, any>): PopupState => {
  const content = state.get('popupContent');
  const title = state.get('popupTitle');
  const status = state.get('popupStatus');

  return {
    content,
    title,
    status,
  };
};

export default connect(mapStateToProps)(Popup);
