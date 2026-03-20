import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Dialog } from '@material-ui/core';

import './Controls.css';

interface ControlsProps {
  onClose: () => void;
  controls?: Record<string, string>;
}

function Controls({ onClose, controls = {} }: ControlsProps): React.ReactElement {
  return (
    <Dialog open onClose={onClose}>
      <div id="controls-content">
        <ul>
          {Object.keys(controls).map((key) => (
            <li key={key}>
              {key}
              {' - '}
              {controls[key]}
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}

const mapStateToProps = (state: Map<string, any>): { controls?: Record<string, string> } => {
  let controls;

  if (Map.isMap(state)) {
    controls = state.get('controlsDescription');
  }

  return {
    controls,
  };
};

export default connect(mapStateToProps)(Controls);
