import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func } from 'prop-types';

import Game from './Game';
import Menu from './Menu';
import InfoOptions from './InfoOptions';
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
			this.closeControls = kit.hideControls.bind(kit);
			this.closeMenu = kit.hideMenu.bind(kit);

			this.continueGame = kit.continue.bind(kit);
			this.reload = kit.reload; // method that doesn't need context

			this.closePopup = kit.hidePopup.bind(kit);
		}


		render() {
			const {
				showMenu, showControls, controls, gameName, showPopup,
			} = this.props;
			return (
				<div className="App">
					<Game
						load={this.loadGame}
						setSize={this.setGameSize}
					/>
					{
						gameName &&
						<InfoOptions
							openMenu={this.openMenu}
							openControls={this.openControls}
							showPopup={this.showPopup}
						/>
					}
					{
						showMenu &&
						<Menu
							continueGame={this.closeMenu}
							reload={this.reload}
						/>}
					{
						showControls &&
						<Controls onClose={this.closeControls}>
							{controls()}
						</Controls>
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
			gameName;

		if (Map.isMap(state)) {
			showMenu = state.get('showMenu');
			controls = state.get('controlsDescription');
			showControls = state.get('showControls');
			showPopup = state.get('showPopup');
			gameName = state.get('gameName');
		}

		return {
			showMenu,
			controls,
			showControls,
			showPopup,
			gameName,
		};
	}

	return connect(mapStateToProps)(App);
};

export default HOApp;
