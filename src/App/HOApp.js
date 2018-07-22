import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, string , object } from 'prop-types';

import Game from './Game';
import Menu from './Menu';
import InfoOptions from './InfoOptions';
import Controls from './Controls';
import Popup from './Popup';
import SelectGame from './SelectGame';

/**
 * Higher order component that returns App component linked with kit methods
 * @param {Object} kit
 */
const HOApp = (kit) => {
	class App extends Component {
		static propTypes = {
			showPopup: bool,
			showMenu: bool,
			showControls: bool,
			controls: object,
			game: string,
		}

		static defaultProps = {
			showPopup: false,
			showControls: false,
			showMenu: false,
			controls: undefined,
			game: '',
		}

		constructor() {
			super();

			this.loadGame = kit.load.bind(kit);
			this.setGameSize = kit.setGameContainerSize.bind(kit);

			this.openMenu = kit.showMenu.bind(kit);
			this.openControls = kit.showControls.bind(kit);
			this.closeControls = kit.hideControls.bind(kit);
			this.closeMenu = kit.hideMenu.bind(kit);

			this.continueGame = kit.continue.bind(kit);
			this.reload = kit.reload; // method that doesn't need context

			this.closePopup = kit.hidePopup.bind(kit);

			this.selectGame = kit.selectGame.bind(kit);

			this.gamesStatus = kit.getGamesStatus();

			this.pauseGameAndShowGamesList = kit.pauseGameAndShowGamesList.bind(kit);
		}


		render() {
			const {
				showMenu, showControls, controls, game, showPopup,
			} = this.props;
			return (
				<div className="App">
					{
						!game && !showPopup &&
						<SelectGame games={this.gamesStatus} select={this.selectGame} />
					}
					{
						game &&
						<Game
							load={this.loadGame}
							setSize={this.setGameSize}
						/>
					}
					{
						game &&
						<InfoOptions
							openMenu={this.openMenu}
							openControls={this.openControls}
							showPopup={this.showPopup}
						/>
					}
					{
						showMenu && !showPopup &&
						<Menu
							continueGame={this.closeMenu}
							reload={this.reload}
							pauseGameAndShowGamesList={this.pauseGameAndShowGamesList}
						/>}
					{
						showControls && !showPopup &&
						<Controls onClose={this.closeControls} controls={controls} />
					}

					{
						showPopup &&
						<Popup onClose={this.closePopup} />
					}
				</div>
			);
		}
	}

	function mapStateToProps(state) {
		let showMenu,
			controls,
			showControls,
			showPopup,
			game;

		if (Map.isMap(state)) {
			showMenu = state.get('showMenu');
			controls = state.get('controlsDescription');
			showControls = state.get('showControls');
			showPopup = state.get('showPopup');
			game = state.get('game');
		}

		return {
			showMenu,
			controls,
			showControls,
			showPopup,
			game,
		};
	}

	return connect(mapStateToProps)(App);
};

export default HOApp;
