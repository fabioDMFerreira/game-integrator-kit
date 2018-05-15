import gameStatus from './gameStatus';
import countdown from '../countdown/state';
import catchables from '../catchables/state';

import {Map} from 'immutable';

const App = (state=new Map(),action)=>{
    state = gameStatus(state,action);
    state = countdown(state,action);
    state = catchables(state,action);
    return state;
}

export default App;