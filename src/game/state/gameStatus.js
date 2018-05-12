const START_GAME = 'START_GAME',
    STOP_GAME = 'STOP_GAME',
    CONTINUE_GAME = 'CONTINUE_GAME',
    GAME_WON = 'GAME_WON',
    GAME_LOST = 'GAME_LOST';

export function startGame(){
    return {
        type:START_GAME
    };
};

export function stopGame(){
    return {
        type:STOP_GAME  
    };
};

export function continueGame(){
    return {
        type:CONTINUE_GAME
    };
};

export function gameWon(){
    return {
        type:GAME_WON
    };
};

export function gameLost(){
    return {
        type:GAME_LOST
    };
};

export default (state,action)=>{
    switch(action.type){
        case START_GAME:
            state = state.set('gameStarted', true);
            state = state.set('gameWon', false);
            state = state.set('gameLost', false);
            return state;
        case STOP_GAME:
            state = state.set('gameStopped', true);
            state = state.set('showMenu',true);
            return state;
        case CONTINUE_GAME:
            state = state.set('gameStopped', false);
            state = state.set('showMenu', false);
            return state;
        case GAME_LOST:
            state = state.set('gameLost', true);
            state = state.set('showMenu',true);
            return state;
        case GAME_WON:
            state = state.set('gameWon', true);
            state = state.set('showMenu', true);
            return state;
        default:
            return state;
    }    
}