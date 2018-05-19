import reduceReducers from 'reduce-reducers';

import gameStatus from './gameStatus';
import countdown from '../countdown/state';
import catchables from '../catchables/state';

const App = reduceReducers(
	gameStatus,
	countdown,
	catchables,
);

export default App;
