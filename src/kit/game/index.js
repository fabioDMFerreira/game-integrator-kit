export default class Game{

    /**
     * Add instance with methods to handle number of catchables on state
     * @param {Object} catchables - instance of catchables
     */
    setCatchablesHandler(catchables){
        this.catchables = catchables;
    }

    /**
     * Returns list of objects that should be render
     * @param {Object} scene 
     * @returns {Array.Object} listObjects
     */
    getObjectsToRender(){
        throw new Error('getWorldObjects should be implemented in game class');
    }
    
    /**
     * This method should be called in every render
     */
    onRender(){
        throw new Error('onRender should be implemented in game class');
    }    

};