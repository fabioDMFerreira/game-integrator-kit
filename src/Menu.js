import React,{Component} from 'react';
import {connect} from 'react-redux';

import {kit} from './index';

import './Menu.css';

export class Menu extends Component{
    render(){
        return <div className="darken-background">
        <div className="info">
          {this.props.gameLost && <h1 id="perdeste">Perdeste!!!</h1>}
          {this.props.gameWon && <h1 id="ganhaste">Ganhaste!!!</h1>}
          <ul>
            {this.props.gameStopped && <li id="continuar" onClick={kit.continue.bind(kit)}>Continuar</li>}
            <li id="novo_jogo" onClick={kit.reload}>Novo jogo</li>
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