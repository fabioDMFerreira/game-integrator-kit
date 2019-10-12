# Game Integrator Kit

Game Integrator Kit provides basic features to quickly start developing 3D animations and games with Webgl.

<div align="center">
	<p>
		<img
			width="300"
			src="images/screenshot.png">
	</p>
	<strong>
		<a href="https://game-integrator-kit.herokuapp.com/">Demo</a>
	</strong>
</div>

# Features

- **Rendering handler.** Provides rendering container. Shows menu on start and stop rendering;
- **Responsive Interface.** Rendering container size is updated on resizing window;
- **Support parallel development of multiple animations.** It allows having more than one game/animation in same codebase and swap easily between them without running additional commands.
- **Modular** Games is almost independent of the kit. It only needs an interface to access a set of methods. Games have their own dependencies and their own repository. This allows receiving game kit updates without having conflicts with existing game code.
- **Game modules.** Provides features that are tipically used in games.
	- **Countdown.** Force gamers to complete game goals in time. Shows lose screen if countdown ends.
	- **Catchables.** Set the goal of catching existant objects. Shows win screen if all objects are collected.
- **WebGL library independent.** Animation built in any WebGL library can use the kit.
	- **Threejs.** Kit provides a class with methods and animation elements that helps integration.
- **Es6, eslint configuration, Sass, build script and jest/enzyme setup**

# Tech/framework used

- React/Redux;
- Material UI components;
- State is saved in an immutable object;
- Enzyme is already setup;

# Usage and installation

This project was bootstrapped with Create React App.

You will find some information on how to perform common tasks in this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

Clone this repository:

``` > git clone https://github.com/fabioDMFerreira/game-integrator-kit ```

Install dependencies

``` > npm install ```

Add games to `src/games` directory. Create an `index.js`, which must export kit required methods.

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

Start application server.

``` > npm start ```

# Testing

Run test script.

``` > npm run-script test ```

## Vscode

Use [jest extension](https://github.com/jest-community/vscode-jest).

# Deployment

Create the optimized application bundle.

``` > npm run-script build ```

## Manual

Move bundle to production server and run a static server. For example [local-web-server](https://www.npmjs.com/package/local-web-server).

``` > cd <application directory> && ws --spa index.html -p 80 ```

## Heroku

Install heroku client and login.

Move bundle to a different directory and create git repository.

``` > cd <bundle directory> && game init ```

 Create your heroku application and add its repository.

``` > heroku create <application name> ```

Add your files and commit.

```> git add * ```<br />
```> git commit -a -m "<commit message>"```

Deploy bundle.

``` > git push heroku master```

Access application.

``` > heroku open ```

# Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

# Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

# License
This project is licensed under the MIT License - see the LICENSE.md file for details.

