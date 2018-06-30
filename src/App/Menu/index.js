import { connect } from 'react-redux';

import './Menu.css';

import Menu from './Menu';

const mapStateToProps = (state) => {
	const gameWon = state.get('gameWon'),
		gameLost = state.get('gameLost'),
		gameStopped = state.get('gameStopped');

	return {
		gameWon,
		gameLost,
		gameStopped,
	};
};

export { default as Menu } from './Menu';

export default connect(mapStateToProps)(Menu);
