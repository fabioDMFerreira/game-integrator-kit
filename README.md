# Game Kit Integrator

Game Kit Integrator is a setup environment with user interface components and tools already linked to easily create games and 3D animations.

The motivation of this project is to help programmers develop fastly their webgl projects.

## Screenshots

# Tech/framework used

This project uses react/redux stack and material-ui components. There is a list of dependencies:

- @material-ui/core": "1.0.0",
- @material-ui/icons": "1.0.0",
- enzyme": "3.3.0",
- enzyme-adapter-react-16": "1.1.1",
- immutable": "3.8.2",
- jest-enzyme": "6.0.2",
- prop-types": "15.6.1",
- react": "^16.3.2",
- react-dom": "^16.3.2",
- react-redux": "5.0.7",
- react-resize-aware": "2.7.0",
- reduce-reducers": "0.3.0",
- redux": "4.0.0",
- redux-devtools-extension": "2.13.2",
- sass-flex-mixin": "1.0.3"

# Features

- Renderer container;
- Resize;
- Allow start and stop game;
- Support develop more that one game in same codebase;
- Controls help;
- Countdown;
- Catchables;
- Decoupled application. Game has its repository and dependencies;
- Es6, eslint configuration, build script and jest/enzyme setup;
- Threejs engine helper;

# Usage

First, clone this repository:

``` $ git clone https://github.com/fabioDMFerreira/game-integrator-kit ```

Add your games to "src/games" directory with an "index.js".

Export necessary methods:

```
export default {
	renderOn, // first element passed is the html element where it will be rendered
	startRender, // must start rendering
	stopRender, // must stop rendering
	setSize, // executed on window resize
	loadKit, // pass kit interface with allowed methods
	controls // [optional] indicates controls to interact with game
};
```

Develop and enjoy your game.

# Deployment



# Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

# Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

# License
This project is licensed under the MIT License - see the LICENSE.md file for details.

