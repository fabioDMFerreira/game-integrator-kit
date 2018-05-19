import React,{Component} from 'react';
import {connect} from 'react-redux';

import './Menu.css';

export class Menu extends Component{
    
    constructor(){
        super();
        this.newGame = this.newGame.bind(this);
        this.continueGame = this.continueGame.bind(this);
    }

    newGame(){
        this.props.kit.reload();
    }

    continueGame(){
        this.props.kit.continue().bind(this.props.kit);
    }
    
    render(){
        return <div className="darken-background">
        <div className="info">
          {this.props.gameLost && <h1 id="perdeste">Won!!!</h1>}
          {this.props.gameWon && <h1 id="ganhaste">Lost!!!</h1>}
          <ul>
            {this.props.gameStopped && <li id="continuar" onClick={this.continueGame}>Continue</li>}
            <li id="novo_jogo" onClick={this.newGame}>New Game</li>
          </ul>
        </div>
      </div>
    }
}

const mapStateToProps = (state)=>{
    const gameWon = state.get('gameWon');
    const gameLost = state.get('gameLost');
    const gameStopped = state.get('gameStopped');

    return {
        gameWon,
        gameLost,
        gameStopped
    }
}

export default connect(mapStateToProps)(Menu);