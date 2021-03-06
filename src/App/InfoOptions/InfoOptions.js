import React from 'react';
import { number, func, bool, object } from 'prop-types';
import { Menu, Help, BlurCircular, Timer } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import Countdown from './Countdown';
import './InfoOptions.css';

const InfoOptions = ({
	openMenu, openControls, numberOfCatchables, countdownEnabled, catchablesEnabled, countdownTime, controlsDescription,
}) => (
	<div id="info-options">
		<div>
			<Button variant="raised" color="primary" onClick={openMenu}>
				<Menu />
			</Button>
		</div>
		{
			openControls && controlsDescription &&
				<div>
					<Button variant="raised" color="primary" onClick={openControls}>
						<Help />
					</Button>
				</div>
		}
		{
			countdownEnabled &&
				<div className="countdown">
					<Timer /> <Countdown time={countdownTime} />
				</div>
		}
		{
			catchablesEnabled &&
				<div className="catchables" title="Objects to catch">
					<BlurCircular /> {numberOfCatchables}
				</div>
		}

	</div>
);

InfoOptions.propTypes = {
	numberOfCatchables: number,
	openMenu: func.isRequired,
	openControls: func,
	countdownEnabled: bool,
	catchablesEnabled: bool,
	countdownTime: number,
	controlsDescription: object,
};

InfoOptions.defaultProps = {
	openControls: null,
	numberOfCatchables: 0,
	countdownEnabled: false,
	catchablesEnabled: false,
	countdownTime: 0,
	controlsDescription: undefined,
};


export default InfoOptions;
