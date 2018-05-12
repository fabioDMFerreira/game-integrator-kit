export default class Keyboard{

    // map = {
    //     37: "left arrow",
    //     38: "up arrow",
    //     39: "right arrow",
    //     40: "down arrow",
    //     87: "w",
    //     83: "s",
    //     65: "a",
    //     68: "d"
    // };

    constructor(toggleContinueStopGame){
        document.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
        document.addEventListener( 'keyup', this.onKeyUp.bind(this), false );    
        this.keysPressed=[];
        this.toggleContinueStopGame=toggleContinueStopGame;
    }

    onKeyDown(event){
        if(event.keyCode===27){
            return this.toggleContinueStopGame();
		};
        
        this.keysPressed[event.keyCode]="pressed";
	}

    onKeyUp(event){
        this.keysPressed[event.keyCode]="";
    }

}