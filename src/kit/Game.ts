import Kit from '.';

interface Controls {
  [key: string]: string
}

export default interface Game {
  renderOn: (gameContainer: HTMLElement) => void, // first element passed is the html element where it will be rendered
  startRender: () => void, // must start rendering
  stopRender: () => void, // must stop rendering
  setSize: (width: number, height: number) => void, // executed on window resize
  loadKit: (kit: Kit) => void, // pass kit interface with allowed methods
  controls?: Controls // [optional] indicates controls to interact with game
}
