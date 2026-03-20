import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Game from './Game';
import Menu from './Menu';
import InfoOptions from './InfoOptions';
import Controls from './Controls';
import Popup from './Popup';
import SelectGame from './SelectGame';

interface Kit {
  load: (element: HTMLElement) => void;
  setGameContainerSize: (width: number, height: number) => void;
  showMenu: () => void;
  showControls: () => void;
  hideControls: () => void;
  hideMenu: () => void;
  continue: () => void;
  reload: () => void;
  hidePopup: () => void;
  selectGame: (game: string) => void;
  getGamesStatus: () => Record<string, string>;
  pauseGameAndShowGamesList: () => void;
}

interface AppProps {
  showPopup?: boolean;
  showMenu?: boolean;
  showControls?: boolean;
  controls?: Record<string, string>;
  game?: string;
}

interface Game {
  [key: string]: string;
}

const HOApp = (kit: Kit) => {
  class App extends Component<AppProps> {
    private loadGame: (element: HTMLElement) => void;
    private setGameSize: (width: number, height: number) => void;
    private openMenu: () => void;
    private openControls: () => void;
    private closeControls: () => void;
    private closeMenu: () => void;
    private reload: () => void;
    private closePopup: () => void;
    private selectGame: (game: string) => void;
    private gamesStatus: Game;
    private pauseGameAndShowGamesList: () => void;

    constructor(props: AppProps) {
      super(props);

      this.loadGame = kit.load.bind(kit);
      this.setGameSize = kit.setGameContainerSize.bind(kit);
      this.openMenu = kit.showMenu.bind(kit);
      this.openControls = kit.showControls.bind(kit);
      this.closeControls = kit.hideControls.bind(kit);
      this.closeMenu = kit.hideMenu.bind(kit);
      this.reload = kit.reload;
      this.closePopup = kit.hidePopup.bind(kit);
      this.selectGame = kit.selectGame.bind(kit);
      this.gamesStatus = kit.getGamesStatus();
      this.pauseGameAndShowGamesList = kit.pauseGameAndShowGamesList.bind(kit);
    }

    render(): React.ReactNode {
      const { showMenu = false, showControls = false, controls, game = '', showPopup = false } = this.props;

      return (
        <div className="App">
          {!game && !showPopup && (
            <SelectGame games={this.gamesStatus} select={this.selectGame} />
          )}
          {game && <Game load={this.loadGame} setSize={this.setGameSize} />}
          {game && (
            <InfoOptions
              openMenu={this.openMenu}
              openControls={this.openControls}
              controlsDescription={controls}
            />
          )}
          {showMenu && !showPopup && (
            <Menu
              continueGame={this.closeMenu}
              reload={this.reload}
              pauseGameAndShowGamesList={this.pauseGameAndShowGamesList}
            />
          )}
          {showControls && !showPopup && (
            <Controls onClose={this.closeControls} />
          )}
          {showPopup && <Popup onClose={this.closePopup} />}
        </div>
      );
    }
  }

  const mapStateToProps = (state: Map<string, any>): AppProps => {
    if (Map.isMap(state)) {
      return {
        showMenu: state.get('showMenu'),
        controls: state.get('controlsDescription') as Record<string, string>,
        showControls: state.get('showControls'),
        showPopup: state.get('showPopup'),
        game: state.get('game'),
      };
    }
    return {};
  };

  return connect(mapStateToProps)(App);
};

export default HOApp;
