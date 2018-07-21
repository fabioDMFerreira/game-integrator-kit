import React from 'react';
import { object, func } from 'prop-types';
import { Dialog, DialogContent, Button } from '@material-ui/core';

const SelectGame = ({ games, select }) => (
	<Dialog open>
		<DialogContent>
			{
				(() => {
					if (games && Object.keys(games).length) {
						return Object.keys(games).map((gameName) => {
							if (games[gameName] === 'success') {
								return <Button color="primary" key={gameName} onClick={() => select(gameName)}>{gameName}</Button>;
							}

							return (<div className="invalid-game-container">
								{
									`${gameName} can not be loaded`
								}
								<br />
								<small>{games[gameName]}</small>
               </div>);
						});
					}

					return 'Games not found. Please add your games directories into "src/games".';
				})()
			}
			{}
		</DialogContent>
	</Dialog>
);

SelectGame.propTypes = {
	games: object,
	select: func.isRequired,
};

SelectGame.defaultProps = {
	games: [],
};

export default SelectGame;
