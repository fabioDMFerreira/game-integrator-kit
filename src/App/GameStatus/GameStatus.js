import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Countdown from './Countdown';
import './GameStatus.css';

export const GameStatus = props => (
	<div className="infoGame">
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
				Items to catch: {props.numberOfCatchables}
		</div>
	</div>
);

GameStatus.propTypes = {
	numberOfCatchables: PropTypes.number,
};

GameStatus.defaultProps = {
	numberOfCatchables: 0,
};

function mapStateToProps(state) {
	let numberOfCatchables;

	if (Map.isMap(state)) {
		numberOfCatchables = state.get('numberOfCatchables');
	}

	return {
		numberOfCatchables,
	};
}

export default connect(mapStateToProps)(GameStatus);
