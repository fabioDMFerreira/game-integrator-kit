import React,{Component} from 'react';
import ResizeAware from 'react-resize-aware';

import './Game.css';

import {game} from './index';

export default class Game extends Component{

    resize({width,height}){
        console.log('size',width,height)
        game.setGameSize(width,height)
    }

    componentDidMount(){
        game.engine.load(this.refs.gameContainer)
    }

    render(){
        return <ResizeAware 
        id="gameContainer"
        onResize = {this.resize}
        >
        <div  ref="gameContainer"></div>
           </ResizeAware> ;
    }
}