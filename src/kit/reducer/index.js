import reduceReducers from 'reduce-reducers';

import gameStatus from './gameStatus';
import countdown from '../countdown/state';
import catchables from '../catchables/state';
import ui from '../ui/state';

const App = reduceReducers(
	gameStatus,
	countdown,
	catchables,
	ui,
);

export default App;
