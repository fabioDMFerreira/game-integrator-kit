import Keyboard from '..';


describe('Keyboard', () => {
	it('subscribe should add a callback function to subscribers property', () => {
		const keyboard = new Keyboard(),
			cb = () => true;

		keyboard.subscribe('a', cb);
		expect(keyboard.subscribers.a.length).toBe(1);
		expect(Object.keys(keyboard.subscribers)).toHaveLength(1);

		keyboard.subscribe('a', cb);
		expect(keyboard.subscribers.a.length).toBe(2);
		expect(Object.keys(keyboard.subscribers)).toHaveLength(1);

		keyboard.subscribe('b', cb);
		expect(keyboard.subscribers.a.length).toBe(2);
		expect(keyboard.subscribers.b.length).toBe(1);
		expect(Object.keys(keyboard.subscribers)).toHaveLength(2);
	});

	it('onKeyDown should update keycode status in a list and execute functions in subscribers associated with key pressed if key was not pressed', () => {
		const keyboard = new Keyboard(),
			cb = jest.fn(),
			cb2 = jest.fn();

		keyboard.subscribe('a', cb);

		keyboard.onKeyDown({ keyCode: 'a' });

		expect(keyboard.keysPressed.a).toBe('pressed');
		expect(cb).toHaveBeenCalledTimes(1);

		keyboard.subscribe('a', cb2);

		keyboard.onKeyDown({ keyCode: 'a' });
		expect(keyboard.keysPressed.a).toBe('pressed');
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb2).toHaveBeenCalledTimes(0);
	});

	it('onKeyUp should update keyCode status in list of keys pressed', () => {
		const keyboard = new Keyboard();

		keyboard.onKeyDown({ keyCode: 'a' });
		expect(keyboard.keysPressed.a).toBe('pressed');

		keyboard.onKeyUp({ keyCode: 'a' });
		expect(keyboard.keysPressed.a).toBe('');
	});
});
