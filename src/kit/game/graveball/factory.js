import * as THREE from 'three';

import applyPhysicsRules from './applyPhysicsRules';

import ballTexture from './images/ball.jpg';
import boxTexture from './images/box.jpg';

export class Plate{
    constructor(Z,Y,X,atrito,texture){
            var z= Z || 100;
            var y= Y || 100;
            var x= X|| 100;
    
            var obj=new THREE.Mesh(new THREE.BoxGeometry(z, y, x),new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(texture)}));
            obj.receiveShadow=true;
            obj.aplicaAtrito=atrito;
            return obj;
    }
}

export class BallObj{
    constructor(radius,objMovable,platform,objCatchable,scene,catchables){
        var material= new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(ballTexture)});
        var obj = new THREE.Mesh(new THREE.SphereGeometry(radius,50, 50), material);
        obj.castShadow=true;
        obj.structure="ball";
        applyPhysicsRules(obj,radius,1000,true,objMovable,platform,objCatchable,scene,catchables);//obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se
    
        return obj;
    }
   
};

export class CubeObj{
    constructor(x,y,z){
        var obj=new THREE.Mesh(new THREE.BoxGeometry(x,y,z), new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(boxTexture)}));
        obj.castShadow=true;
        obj.structure="cube";
    
        applyPhysicsRules(obj,x/2,30,false);//obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se
    
        return obj;
    }
};