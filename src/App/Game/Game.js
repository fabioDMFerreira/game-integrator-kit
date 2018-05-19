import React, { Component } from 'react';
import ResizeAware from 'react-resize-aware';
import PropTypes from 'prop-types';

import './Game.css';

class Game extends Component {
	constructor() {
		super();
		this.resize = this.resize.bind(this);
	}

	componentDidMount() {
		this.props.load(this.gameContainer);
	}

	resize({ width, height }) {
		this.props.setSize(width, height);
	}

	render() {
		return (
			<ResizeAware
				id="gameContainer"
				onResize={this.resize}
			>
				<div ref={(thisHtmlElement) => { this.gameContainer = thisHtmlElement; }} />
			</ResizeAware>
		);
	}
}

Game.propTypes = {
	setSize: PropTypes.func.isRequired,
	load: PropTypes.func.isRequired,
};

export default Game;
