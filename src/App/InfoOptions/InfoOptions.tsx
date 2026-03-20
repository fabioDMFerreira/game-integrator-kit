import React from 'react';
import { Menu, Help, BlurCircular, Timer } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import Countdown from './Countdown';
import './InfoOptions.css';

interface InfoOptionsProps {
  openMenu: () => void;
  openControls?: (() => void) | null;
  numberOfCatchables?: number;
  countdownEnabled?: boolean;
  catchablesEnabled?: boolean;
  countdownTime?: number;
  controlsDescription?: Record<string, any>;
}

function InfoOptions({
  openMenu,
  openControls = null,
  numberOfCatchables = 0,
  countdownEnabled = false,
  catchablesEnabled = false,
  countdownTime = 0,
  controlsDescription = undefined,
}: InfoOptionsProps): React.ReactElement {
  return (
    <div id="info-options">
      <div>
        <Button variant="contained" color="primary" onClick={openMenu}>
          <Menu />
        </Button>
      </div>
      {openControls && controlsDescription && (
        <div>
          <Button variant="contained" color="primary" onClick={openControls}>
            <Help />
          </Button>
        </div>
      )}
      {countdownEnabled && (
        <div className="countdown">
          <Timer />
          {' '}
          <Countdown time={countdownTime} />
        </div>
      )}
      {catchablesEnabled && (
        <div className="catchables" title="Objects to catch">
          <BlurCircular />
          {' '}
          {numberOfCatchables}
        </div>
      )}
    </div>
  );
}

export default InfoOptions;
