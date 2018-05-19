import React,{Component} from 'react';
import {connect} from 'react-redux';
import Countdown from './Countdown';
import './GameStatus.css';

export class GameStatus extends Component{
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
        <div>
          Items to catch: {this.props.numberOfCatchables}
        </div>
      </div>
    }
}

const mapStateToProps = state => ({
  numberOfCatchables:state.get('numberOfCatchables')
});

export default connect(mapStateToProps)(GameStatus);