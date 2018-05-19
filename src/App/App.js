import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Game from './Game';
import Menu from './Menu';
import GameStatus from './GameStatus';

const App = (kit) => {
	function mapStateToProps(state) {
		let showMenu;

		if (Map.isMap(state)) {
			showMenu = state.get('showMenu');
		}

		return {
			showMenu,
		};
	}

	const continueGame = () => kit.continue.apply(kit),
		loadGame = element => kit.load.call(kit, element),
		setGameSize = (width, height) => kit.setGameContainerSize.call(kit, width, height),
		{ reload } = kit,
		Component = props =>
			(
				<div className="App">
					<Game load={loadGame} setSize={setGameSize} />
					<GameStatus />
					{props.showMenu && <Menu continue={continueGame} reload={reload} />}
				</div>
			),
		connectedComponent = connect(mapStateToProps)(Component);

	Component.propTypes = {
		showMenu: PropTypes.bool,
	};

	Component.defaultProps = {
		showMenu: false,
	};

	return connectedComponent;
};

export default App;
