import React,{Component} from 'react';

import Countdown from './Countdown';
import './GameStatus.css';

export default class GameStatus extends Component{
    render(){
        return <div className="infoGame">
        <Countdown />
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
    }
}