import React,{Component} from 'react';
import ResizeAware from 'react-resize-aware';

import './Game.css';

export default class Game extends Component{

    constructor(){
        super();
        this.resize = this.resize.bind(this);
    }

    resize({width,height}){
        console.log('size',width,height)
        this.props.kit.setGameContainerSize(width,height)
    }

    componentDidMount(){
        this.props.kit.load(this.refs.gameContainer)
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