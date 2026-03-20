import { FC } from 'react';

interface Game {
  [key: string]: string;
}

interface SelectGameProps {
  games: Game;
  select: (gameName: string) => void;
}

declare const SelectGame: FC<SelectGameProps>;
export default SelectGame;
