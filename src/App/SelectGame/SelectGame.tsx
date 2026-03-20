import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

interface Game {
	[key: string]: string;
}

interface SelectGameProps {
	games: Game;
	select: (gameName: string) => void;
}

function SelectGame({ games, select }: SelectGameProps) {
	return (
		<Dialog open>
			<DialogContent>
				{(() => {
					if (games && Object.keys(games).length) {
						return Object.keys(games).map((gameName) => {
							if (games[gameName] === 'success') {
								return (
									<Button
										color="primary"
										key={gameName}
										onClick={() => select(gameName)}
									>
										{gameName}
									</Button>
								);
							}

							return (
								<div className="invalid-game-container" key={gameName}>
									{`${gameName} can not be loaded`}
									<br />
									<small>{games[gameName]}</small>
								</div>
							);
						});
					}

					return 'Games not found. Please add your games directories into "src/games".';
				})()}
			</DialogContent>
		</Dialog>
	);
}

export default SelectGame;
