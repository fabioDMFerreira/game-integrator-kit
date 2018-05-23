import reduceReducers from 'reduce-reducers';

import gameStatus from './gameStatus';
import { reducer as countdown } from '../countdown';
import { reducer as catchables } from '../catchables';
import ui from '../ui/state';

const App = reduceReducers(
	gameStatus,
	countdown,
	catchables,
	ui,
);

export default App;
