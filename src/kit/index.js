import state from './state';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import Engine from './engine';

import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';

import Graveball from './game/graveball';

import { startGame, stopGame, continueGame, gameWon, gameLost } from './state/gameStatus';

export default class Kit {
    constructor() {
        this.store = createStore(state, devToolsEnhancer());
        this.countdown = new Countdown(this.store, this.endOfGame.bind(this));
        this.catchables = new Catchables(this.store);
        this.keyboard = new Keyboard(this.toggleStartGame.bind(this));
        this.game = new Graveball(this.keyboard.keysPressed, this.endOfGame.bind(this),this.catchables);
        this.engine = new Engine(this.game);

    }

    endOfGame(result) {
        result ? this.won() : this.lost();
    }

    init(element){
        this.engine.load(element);
        this.game.load();
        this.game.objects.forEach(element=>this.engine.scene.add(element));
        this.start();
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

    setGameContainerSize(width, height) {
        this.engine.setSize(width, height);
    }

}