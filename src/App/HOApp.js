import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func } from 'prop-types';

import Game from './Game';
import Menu from './Menu';
import GameStatus from './GameStatus';
import Controls from './Controls';
import Popup from './Popup';

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
			controls: func,
		}

		static defaultProps = {
			showPopup: false,
			showControls: false,
			showMenu: false,
			controls: () => <div />,
		}

		constructor() {
			super();

			this.loadGame = kit.load.bind(kit);
			this.setGameSize = kit.setGameContainerSize.bind(kit);

			this.openMenu = kit.showMenu.bind(kit);
			this.openControls = kit.showControls.bind(kit);

			this.continueGame = kit.continue.bind(kit);
			this.reload = kit.reload; // method that doesn't need context

			this.hidePopup = kit.hidePopup.bind(kit);
		}


		render() {
			return (
				<div className="App">
					<Game
						load={this.loadGame}
						setSize={this.setGameSize}
					/>
					<GameStatus
						openMenu={this.openMenu}
						openControls={this.openControls}
						showPopup={this.showPopup}
					/>
					{
						this.props.showMenu &&
						<Menu
							continueGame={this.continueGame}
							reload={this.reload}
						/>}
					{
						this.props.showControls &&
						<Controls>
							{this.props.controls()}
						</Controls>
					}

					{
						this.props.showPopup &&
						<Popup onClose={this.hidePopup} />
					}
				</div>
			);
		}
	}

	function mapStateToProps(state) {
		let showMenu,
			controls,
			showControls,
			showPopup;

		if (Map.isMap(state)) {
			showMenu = state.get('showMenu');
			controls = state.get('controlsDescription');
			showControls = state.get('showControls');
			showPopup = state.get('showPopup');
		}

		return {
			showMenu,
			controls,
			showControls,
			showPopup,
		};
	}

	return connect(mapStateToProps)(App);
};

export default HOApp;
