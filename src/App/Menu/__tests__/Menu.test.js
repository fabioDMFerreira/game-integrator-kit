import React from 'react';
import { shallow } from 'enzyme';

import Menu from '../Menu';


describe('Menu component', () => {
	it('should show new game button that on click should call reload parameter function', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} />),
			newGameButton = menu.find('#new-game');

		expect(newGameButton).toHaveLength(1);

		newGameButton.simulate('click');

		expect(newGame).toHaveBeenCalledTimes(1);
	});

	it('should show continue game button if game is stopped and it is not finished and on click call continue property function', () => {
		const continueGame = jest.fn();

		let menu = shallow(<Menu gameStopped continueGame={continueGame} />),
			continueGameButton = menu.find('#continue-game');
		expect(continueGameButton).toHaveLength(1);
		continueGameButton.simulate('click');
		expect(continueGame).toHaveBeenCalledTimes(1);

		menu = shallow(<Menu gameStopped gameWon />);
		continueGameButton = menu.find('#continue-game');
		expect(continueGameButton).toHaveLength(0);

		menu = shallow(<Menu gameStopped gameLost />);
		continueGameButton = menu.find('#continue-game');
		expect(continueGameButton).toHaveLength(0);
	});

	it('should text game won if prop is passed', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} gameWon />),
			textWon = menu.find('h1[children="Congratulations!!!"]');

		expect(textWon).toHaveLength(1);
	});

	it('should text game won if prop is false', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} gameWon={false} />),
			textWon = menu.find('h1[children="Congratulations!!!"]');

		expect(textWon).toHaveLength(0);
	});

	it('should text game lost if prop is passed', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} gameLost />),
			textLost = menu.find('h1[children="Try again!!!"]');

		expect(textLost).toHaveLength(1);
	});

	it('should text game lost if prop is false', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} gameLost={false} />),
			textLost = menu.find('h1[children="Try again!!!"]');

		expect(textLost).toHaveLength(0);
	});
});
