const START_COUNTDOWN='START_COUNTDOWN',
    STOP_COUNTDOWN='STOP_COUNTDOWN',
    CONTINUE_COUNTDOWN='CONTINUE_COUNTDOWN',
    SET_COUNTDOWN_TIME = 'SET_COUNTDOWN_TIME',
    DECREMENT_COUNTDOWN_TIME = 'DECREMENT_COUNTDOWN_TIME';

export const startCountdown=()=>{
    return {
        type:START_COUNTDOWN
    };
};

export const stopCountdown=()=>{
    return {
        type:STOP_COUNTDOWN
    };
};

export const continueCountdown=()=>{
    return {
        type:CONTINUE_COUNTDOWN
    };
};

export const setCountdownTime=(time)=>{
    return {
        type:SET_COUNTDOWN_TIME,
        time
    };
};

export const decrementCountdownTime=()=>{
    return {
        type:DECREMENT_COUNTDOWN_TIME
    };
};

export default function(state,action){
    switch(action.type){
        case START_COUNTDOWN:
            state = state.set('countdownStarted',true);
            state = state.set('countdownStopped',false);
            return state;
        case STOP_COUNTDOWN:
            state = state.set('countdownStopped',true);
            return state;
        case CONTINUE_COUNTDOWN:
            state = state.set('countdownStopped',false);
            return state;
        case SET_COUNTDOWN_TIME:   
            if(action.time && !isNaN(action.time)){
                state = state.set('countdownTime',Number(action.time));
            }
            else{
                console.warn('Countdown time should be a number');
            }
            return state;
        case DECREMENT_COUNTDOWN_TIME:
            const time = state.get('countdownTime');
            if(time){
                state = state.set('countdownTime',time-1)
            }
            return state;
        default:
            return state;
    }
}