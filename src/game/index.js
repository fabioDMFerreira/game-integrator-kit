import state from './state';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import Engine from './engine';

import Countdown from './countdown';
import Keyboard from './keyboard';

import { startGame, stopGame, continueGame, gameWon, gameLost } from './state/gameStatus';

export default class Game {
    constructor() {
        this.store = createStore(state, devToolsEnhancer());
        this.countdown = new Countdown(this.store, this.endOfGame);
        this.keyboard = new Keyboard(this.toggleStartGame.bind(this));
        this.engine = new Engine(this.keyboard.keysPressed, this);
    }

    endOfGame(result) {
        result ? this.won() : this.lost();
    }

    start() {
        this.store.dispatch(startGame());
        this.engine.render();
        this.countdown.setTime(300);
        this.countdown.start();
    }

    stop() {
        this.store.dispatch(stopGame());
        this.engine.stopRender();
        this.countdown.stop();
    }

    continue() {
        this.store.dispatch(continueGame());
        this.engine.render();
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
        this.engine.stopRender();
    }

    lost() {
        this.store.dispatch(gameLost());
        this.engine.stopRender();
    }

    reload() {
        window.location.reload();
    }

    setGameSize(width, height) {
        this.engine.setSize(width, height);
    }

}