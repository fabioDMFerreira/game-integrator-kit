import reduceReducers from 'reduce-reducers';

import gameStatus from './gameStatus/reducer';
import countdown from './countdown/reducer';
import catchables from './catchables/reducer';
import ui from './ui/reducer';

const App = reduceReducers(
	gameStatus,
	countdown,
	catchables,
	ui,
);

export default App;
