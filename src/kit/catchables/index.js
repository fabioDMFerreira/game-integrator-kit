import {setNumberCatchables,decrementNumberCatchables} from './state';

export default class Catchables{
    
    constructor(store){
        this.store = store;
    }
    
    /**
     * Set on state number of catchable objects
     * @param {number} n
     */
    set(n){
        this.store.dispatch(setNumberCatchables(n))
    }

    /**
     * Decrease value one in number of catchable objects. This method should be called
     * when a catchable element is catched.
     */
    decrease(){
        this.store.dispatch(decrementNumberCatchables())        
    }
}