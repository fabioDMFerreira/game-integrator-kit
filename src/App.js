import React, { Component } from 'react';
import './App.css';

import Game from './Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game />
        <div id="gameContainer">
        </div>
        <div className="infoGame">
          <div className="cronometro">
          </div>
          <div className="controls">
            <ul>
              <li>W-frente |</li>
              <li>S-atr&aacute;s |</li>
              <li>A-esquerda |</li>
              <li>D-direita |</li>
              <li>Espa&ccedil;o-saltar |</li>
              <li>Setas direita esquerda - rodar |</li>
              <li>Setas frente atr&aacute;s - aproximar/afastar</li>
            </ul>
          </div>
          <div className="pontuacao">
          </div>
        </div>
        <div className="menu-container container">
          <div className="info menu">
            <h1 id="perdeste">Perdeste!!!</h1>
            <h1 id="ganhaste">Ganhaste!!!</h1>
            <ul>
              <li id="continuar">Continuar</li>
              <li id="novo_jogo">Novo jogo</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
