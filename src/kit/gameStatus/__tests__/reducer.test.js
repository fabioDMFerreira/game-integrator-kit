import { Map, fromJS } from 'immutable';

import reducer from '../reducer';
import * as actions from '../actions';

describe('GameStatus reducer', () => {
	it('should return empty state if any action is passed', () => {
		let actual = reducer(),
			expected = new Map();

		expect(actual).toEqual(expected);

		actual = reducer(undefined, { type: 'DOES_NOT_EXIST' });
		expected = new Map();

		expect(actual).toEqual(expected);
	});

	it('on START_GAME should update gameStarted, gameWon and gameLost', () => {
		const actual = reducer(undefined, actions.startGame()),
			expected = new Map({
				gameStarted: true,
				gameStopped: false,
				gameWon: false,
				gameLost: false,
			});

		expect(actual).toEqual(expected);
	});

	it('on STOP_GAME should update gameStopped', () => {
		const actual = reducer(undefined, actions.stopGame()),
			expected = new Map({
				gameStopped: true,
			});

		expect(actual).toEqual(expected);
	});

	it('on CONTINUE_GAME should update gameStopped', () => {
		const actual = reducer(undefined, actions.continueGame()),
			expected = new Map({
				gameStopped: false,
			});

		expect(actual).toEqual(expected);
	});

	it('on GAME_LOST should update gameWon and gameLost', () => {
		const actual = reducer(undefined, actions.gameLost()),
			expected = new Map({
				gameLost: true,
				gameWon: false,
			});

		expect(actual).toEqual(expected);
	});

	it('on GAME_WON should update gameWon and gameLost', () => {
		const actual = reducer(undefined, actions.gameWon()),
			expected = new Map({
				gameWon: true,
				gameLost: false,
			});

		expect(actual).toEqual(expected);
	});

	it('on SET_CONTROLS_DESCRIPTION should update controlsDescription', () => {
		let actual = reducer(undefined, actions.setControlsDescription({ w: 'lorem' })),
			expected = new Map({
				controlsDescription: {
					w: 'lorem',
				},
			});

		expect(actual).toEqual(expected);

		actual = reducer(undefined, actions.setControlsDescription());
		expected = new Map({ controlsDescription: undefined });

		expect(actual).toEqual(expected);
	});

	it('on SET_GAME_SELECTED should update gameName if name is passed', () => {
		let actual = reducer(undefined, actions.setGameSelected('lorem')),
			expected = new Map({
				game: 'lorem',
			});

		expect(actual).toEqual(expected);

		actual = reducer(undefined, actions.setGameSelected());
		expected = new Map({ game: null });

		expect(actual).toEqual(expected);
	});
});
