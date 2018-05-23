import Catchables from '../Catchables';
import * as actions from '../actions';

let mockKit;

describe('Catchables', () => {
	beforeEach(() => {
		mockKit = {
			store: {
				dispatch: jest.fn(),
			},
		};
	});

	afterEach(() => {
	});

	it('set should dispatch an action that updates number of catchables in state', () => {
		const catchables = new Catchables(mockKit),
			spy = jest.spyOn(actions, 'setNumberCatchables', 'set');

		catchables.set(10);

		expect(spy.mock.calls.length).toBe(1);
		expect(spy.mock.calls[0][0]).toBe(10);
		expect(catchables.store.dispatch).toHaveBeenCalledTimes(1);

		spy.mockReset();
		spy.mockRestore();
	});

	it('decrease should dispatch an action that decreases number of catchables in state', () => {
		const catchables = new Catchables(mockKit),
			spy = jest.spyOn(actions, 'decrementNumberCatchables', 'set');

		catchables.decrease();

		expect(spy.mock.calls.length).toBe(1);
		expect(catchables.store.dispatch).toHaveBeenCalledTimes(1);

		spy.mockReset();
		spy.mockRestore();
	});
});
