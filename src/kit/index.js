import reducer from './reducer';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';

import Graveball from './game/graveball';

import { startGame, stopGame, continueGame, gameWon, gameLost } from './reducer/gameStatus';

export default class Kit {
    constructor() {
        if(process.env.NODE_ENV ==='development'){
            this.store = createStore(reducer, devToolsEnhancer());
        }
        else{
            this.store = createStore(reducer);            
        }
        this.countdown = new Countdown(this.store, this.endOfGame.bind(this));
        this.catchables = new Catchables(this.store);
        this.keyboard = new Keyboard(this.toggleStartGame.bind(this));
        this.game = new Graveball(this.keyboard.keysPressed, this.endOfGame.bind(this), this.catchables);
    }

    endOfGame(result) {
        result ? this.won() : this.lost();
    }

    load(element) {
        this.game.renderOn(element);
        this.start();
    }

    start() {
        this.store.dispatch(startGame());
        this.game.render();
        this.countdown.setTime(300);
        this.countdown.start();
    }

    stop() {
        this.store.dispatch(stopGame());
        this.game.stopRender();
        this.countdown.stop();
    }

    continue() {
        this.store.dispatch(continueGame());
        this.game.render();
        this.countdown.continue();
    }

    toggleStartGame() {
        const gameStopped = this.store.getState().get('gameStopped');
        if (gameStopped) {
            this.continue();
        }
        else {
            this.stop();
        }
    }

    won() {
        this.store.dispatch(gameWon());
        this.game.stopRender();
    }

    lost() {
        this.store.dispatch(gameLost());
        this.game.stopRender();
    }

    reload() {
        window.location.reload();
    }

    setGameContainerSize(width, height) {
        this.game.setSize(width, height);
    }

}