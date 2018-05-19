import React,{Component} from 'react';
import ResizeAware from 'react-resize-aware';

import './Game.css';

import {kit} from './index';

export default class Game extends Component{

    resize({width,height}){
        console.log('size',width,height)
        kit.setGameContainerSize(width,height)
    }

    componentDidMount(){
        kit.load(this.refs.gameContainer)
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