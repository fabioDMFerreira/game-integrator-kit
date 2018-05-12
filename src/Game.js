import React,{Component} from 'react';

import GameEngine from './game/grave';

export default class Game extends Component{

    componentDidMount(){
        GameEngine.load(this.refs.gameContainer);
    }

    render(){
        return <div ref="gameContainer"></div>;
    }
}