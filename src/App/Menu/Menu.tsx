import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

interface MenuProps {
  continueGame?: () => void;
  gameWon?: boolean;
  gameLost?: boolean;
  gameStopped?: boolean;
  reload?: () => void;
  pauseGameAndShowGamesList?: () => void;
}

const noop = () => undefined;

function Menu({
  continueGame = noop,
  gameWon = false,
  gameLost = false,
  gameStopped = false,
  reload = noop,
  pauseGameAndShowGamesList = noop,
}: MenuProps): React.ReactElement {
  return (
    <Dialog onClose={continueGame} open>
      <DialogContent>
        <div className="info">
          {gameWon && <h1>Congratulations!!!</h1>}
          {gameLost && <h1>Try again!!!</h1>}
          <ul>
            {gameStopped && !gameWon && !gameLost && (
              <li>
                <Button id="continue-game" onClick={continueGame}>
                  Continue
                </Button>
              </li>
            )}
            <li>
              <Button id="new-game" onClick={reload}>
                New Game
              </Button>
            </li>
            <li>
              <Button id="select-game" onClick={pauseGameAndShowGamesList}>
                Select another game
              </Button>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Menu;
