import {Plate} from './factory';
import brightSquaresTexture from './images/bright_squares256.png';
import streetTexture from './images/street.jpg';
import brickTexture from './images/brick.jpg';

export default function(platform){
    const worldObjects = []

    var plane = new Plate(10000, 10, 10000, 0, brightSquaresTexture);
    plane.receiveShadow = true;
    platform.push(plane);
    worldObjects.push(plane);
    plane.position.set(0, 0, 0);

    var wall = new Plate(100, 1000, 10000, 0.05, brickTexture);
    wall.receiveShadow = true;
    platform.push(wall);
    worldObjects.push(wall);
    wall.position.set(5000, 0, 0);

    var wall2 = new Plate(10000, 1000, 100, 0.05, brickTexture);
    wall2.receiveShadow = true;
    platform.push(wall2);
    worldObjects.push(wall2);
    wall2.position.set(0, 0, 5000);

    var tower = new Plate(500, 500, 500, 0.05, streetTexture);
    tower.receiveShadow = true;
    platform.push(tower);
    worldObjects.push(tower);
    tower.position.set(0, 150, 0);

    var r1 = new Plate(500, 100, 1500, 0.05, streetTexture);
    r1.rotation.x = -1 / 9 * Math.PI;
    r1.receiveShadow = true;
    platform.push(r1);
    worldObjects.push(r1);
    r1.position.set(0, 50, -900);

    var r2 = new Plate(500, 100, 1500, 0.05, streetTexture);
    r2.rotation.x = 1 / 9 * Math.PI;
    r2.receiveShadow = true;
    platform.push(r2);
    worldObjects.push(r2);
    r2.position.set(0, 50, 900);

    var r3 = new Plate(1500, 100, 500, 0.05, streetTexture);
    r3.rotation.z = 1 / 9 * Math.PI;
    r3.receiveShadow = true;
    platform.push(r3);
    worldObjects.push(r3);
    r3.position.set(-900, 50, 0);

    var r4 = new Plate(1500, 100, 500, 0.05, streetTexture);
    r4.rotation.z = -1 / 9 * Math.PI;
    r4.receiveShadow = true;
    platform.push(r4);
    worldObjects.push(r4);
    r4.position.set(900, 50, 0);

    var tower2 = new Plate(2000, 800, 3000, 0.05, streetTexture);
    tower2.receiveShadow = true;
    platform.push(tower2);
    worldObjects.push(tower2);
    tower2.position.set(-2000, 0, 2000);

    return worldObjects;
}