import { FC } from 'react';

interface MenuProps {
  continueGame?: () => void;
  gameWon?: boolean;
  gameLost?: boolean;
  gameStopped?: boolean;
  reload?: () => void;
  pauseGameAndShowGamesList?: () => void;
}

declare const Menu: FC<MenuProps>;
export default Menu;
