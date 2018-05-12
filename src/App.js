import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';


import Game from './Game';
import Menu from './Menu';
import GameStatus from './GameStatus';


export class App extends Component {


  render() {
    return (
      <div className="App">

        <Game />

        <GameStatus />
        
        {this.props.showMenu && <Menu />}
      </div>
    );
  }
}

const mapStateToProps = function(state){
  const showMenu = state.get('showMenu');

  return {
    showMenu
  };
}

export default connect(mapStateToProps)(App);
