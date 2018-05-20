import { Map } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Game from './Game';
import Menu from './Menu';
import GameStatus from './GameStatus';

/**
 * Higher order component that returns App component linked with kit methods
 * @param {Object} kit
 */
const HOApp = (kit) => {
	function mapStateToProps(state) {
		let showMenu;

		if (Map.isMap(state)) {
			showMenu = state.get('showMenu');
		}

		return {
			showMenu,
		};
	}

	class App extends Component {
		constructor() {
			super();

			this.loadGame = kit.load.bind(kit);
			this.setGameSize = kit.setGameContainerSize.bind(kit);

			this.continueGame = kit.continue.bind(kit);
			this.reload = kit.reload; // method that doesn't need context
		}

		render() {
			return (
				<div className="App">
					<Game load={this.loadGame} setSize={this.setGameSize} />
					<GameStatus />
					{this.props.showMenu && <Menu continue={this.continueGame} reload={this.reload} />}
				</div>
			);
		}
	}

	App.propTypes = {
		showMenu: PropTypes.bool,
	};

	App.defaultProps = {
		showMenu: false,
	};

	return connect(mapStateToProps)(App);
};

export default HOApp;
