export const SET_NUMBER_CATCHABLES = 'SET_NUMBER_CATCHABLES',
    DECREMENT_NUMBER_CATCHABLES = 'DECREMENT_NUMBER_CATCHABLES';

export function setNumberCatchables(number){
    return {
        type:SET_NUMBER_CATCHABLES,
        number
    }
}

export function decrementNumberCatchables(number){
    return {
        type:DECREMENT_NUMBER_CATCHABLES
    }
}

export default function(state,action){
    switch(action.type){
        case SET_NUMBER_CATCHABLES:
            if(action.number && !isNaN(action.number)){
                state = state.set('numberOfCatchables',action.number);
            }
            else{
                console.warn('setNumberCatchables first parameter should be a number')
            }
            return state;
        case DECREMENT_NUMBER_CATCHABLES:
            const numberOfCatchables = state.get('numberOfCatchables');
            if(numberOfCatchables===0){
                console.warn('numberOfCatchables is 0 in state');
            }
            else if(!numberOfCatchables){
                console.warn('numberOfCatchables should be set');
            }
            else{
                state = state.set('numberOfCatchables',numberOfCatchables-1);
            }
            return state;
        default:
            return state;
    }

}