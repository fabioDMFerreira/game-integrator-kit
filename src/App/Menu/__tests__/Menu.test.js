import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Menu } from '../Menu';

Enzyme.configure({ adapter: new Adapter() });

describe('Menu component', () => {
	it('Menu should new game button', () => {
		const newGame = jest.fn(),
			menu = shallow(<Menu reload={newGame} />),
			buttons = menu.find('#novo_jogo');

		expect(buttons).toHaveLength(1);
	});
});
