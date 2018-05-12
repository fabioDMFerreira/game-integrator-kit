import jQuery from 'jquery';
import * as THREE from 'three';

import ballTexture from './images/ball.jpg';
import boxTexture from './images/box.jpg';
import streetTexture from './images/street.jpg';
import brickTexture from './images/brick.jpg';
import brightSquaresTexture from './images/bright_squares256.png';

import {game} from '../index';

var camera, 
	scene, 
	renderer,
	keyboard=[],
	keyboardStatus=true,
	platform=[],
	objMovable=[],
	objCatchable=[],
	requestAnimationId,
	anguloCamera=3/2*Math.PI,
	distanciaCamera=500;

var rays={};

rays.up=[new THREE.Vector3(0,1,0),
					new THREE.Vector3(1,1,0),
					new THREE.Vector3(-1,1,0),
					new THREE.Vector3(0,1,1),
					new THREE.Vector3(0,1,-1),
					new THREE.Vector3(-1,1,-1),
					new THREE.Vector3(-1,1,1),
					new THREE.Vector3(1,1,-1),
					new THREE.Vector3(1,1,1)
];
rays.down=[		new THREE.Vector3(0,-1,0),
				new THREE.Vector3(1,-1,0),
				new THREE.Vector3(-1,-1,0),
				new THREE.Vector3(0,-1,1),
				new THREE.Vector3(0,-1,-1),
				new THREE.Vector3(-1,-1,-1),
				new THREE.Vector3(-1,-1,1),
				new THREE.Vector3(1,-1,-1),
				new THREE.Vector3(1,-1,1)
];

rays.a=[	new THREE.Vector3(0,1,0),
			new THREE.Vector3(1,0,0),//diretamente para a esquerda
			//new THREE.Vector3(1,1,0),
			//new THREE.Vector3(1,-1,0),

			new THREE.Vector3(1,0,1),//esquerda frente
			//new THREE.Vector3(1,1,1),
			//new THREE.Vector3(1,-1,1),

			new THREE.Vector3(1,0,-1),//esquerda tras
			//new THREE.Vector3(1,1,-1),
			//new THREE.Vector3(1,-1,-1)
];
rays.d=[	new THREE.Vector3(0,1,0),
			new THREE.Vector3(-1,0,0),//diretamente para a direita
			//new THREE.Vector3(-1,1,0),
			//new THREE.Vector3(-1,-1,0),

			new THREE.Vector3(-1,0,1),//direita frente
			//new THREE.Vector3(-1,1,1),
			//new THREE.Vector3(-1,-1,1),

			new THREE.Vector3(-1,0,-1),//direita tras
			//new THREE.Vector3(-1,1,-1),
			//new THREE.Vector3(-1,-1,-1)
];
rays.w=[	new THREE.Vector3(0,1,0),
			new THREE.Vector3(0,0,1),//diretamente para a frente
			//new THREE.Vector3(0,1,1),
			//new THREE.Vector3(0,-1,1),

			new THREE.Vector3(-1,0,1),//direita frente
			//new THREE.Vector3(-1,1,1),
			//new THREE.Vector3(-1,-1,1),

			new THREE.Vector3(1,0,1),//esquerda frente
			//new THREE.Vector3(1,1,1),
			//new THREE.Vector3(1,-1,1),
];
rays.s=[	new THREE.Vector3(0,1,0),
			new THREE.Vector3(0,0,-1),//diretamente para tras
			//new THREE.Vector3(0,1,-1),
			//new THREE.Vector3(0,-1,-1),

			new THREE.Vector3(-1,0,-1),//direita tras
			//new THREE.Vector3(-1,1,-1),
			//new THREE.Vector3(-1,-1,-1),

			new THREE.Vector3(1,0,-1),//esquerda tras
			//new THREE.Vector3(1,1,-1),
			//new THREE.Vector3(1,-1,-1)		
];

	//Codigo de objetos
	var Plate=function(Z,Y,X,atrito,texture){
		var z= Z || 100;
		var y= Y || 100;
		var x= X|| 100;

		var obj=new THREE.Mesh(new THREE.BoxGeometry(z, y, x),new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(texture)}));
    	obj.receiveShadow=true;
		obj.aplicaAtrito=atrito;
		return obj;
	};

	var coisasFisica=function(obj,Radius,maxVel,rot){
		obj.Radius=Radius;
		obj.translation={};
		obj.translation.z=new THREE.Vector3(0,0,1);
		obj.translation.x=new THREE.Vector3(1,0,0);
		obj.Velocity=new THREE.Vector3(0,0,0);
		obj.Falling=false;
		obj.inclination={};
		obj.inclination.x=-1;
		obj.inclination.z=-1;
		obj.MaxVelocity=maxVel;
		obj.moveFlag={}
		obj.moveFlag.w=true;
		obj.moveFlag.s=true;
		obj.moveFlag.a=true;
		obj.moveFlag.d=true;
		obj.RotationFlag=rot;
		obj.atrito=0;
		obj.aplicaAtrito=0.2;
		obj.caster=new THREE.Raycaster();

		//Aplicar forcas
		obj.addAccelaration=function(axe,value){
			if(value!==0 && obj.Velocity[axe]+value<=obj.MaxVelocity && obj.Velocity[axe]+value>=-obj.MaxVelocity){
				obj.Velocity[axe]=obj.Velocity[axe]+value;
			}
		};
		obj.addAccelarationX=function(value){
			obj.addAccelaration("x",value);
		};
		obj.addAccelarationZ=function(value){
			obj.addAccelaration("z",value);
		};
		obj.addAccelarationY=function(value){
			obj.addAccelaration("y",value);
		};

		//aplicar diretamente velocidades (!warning)
		obj.setVelocity=function(axe,value){
			obj.Velocity["axe"]=value;
		};
		obj.setVelocityX=function(value){
			obj.setVelocity("x",value);
		};
		obj.setVelocityZ=function(value){
			obj.setVelocity("z",value);
		};
		obj.setVelocityY=function(value){
			obj.setVelocity("y",value);
		};
		//detectar colisões
		obj.detectCollisionUp=function(){
			for(var id in rays["up"]){
					obj.caster.set(obj.position,rays["up"][id]);
					var intersect=obj.caster.intersectObjects(objCatchable);
					if(intersect.length>0 && intersect[0].distance < obj.Radius+obj.Velocity["y"]+15){
						scene.remove(intersect[0].object);
						objCatchable= jQuery.grep(objCatchable, function(value) {
							return value !== intersect[0].object;
							});
					}
			}

			var auxIntersect=[];//onde vai ficar informacao da colisao
			auxIntersect[0]={};
			auxIntersect[0].distance=100000;
			var auxRaio;

			for(let id in rays.up){
				obj.caster.set(obj.position,rays.up[id]);
				let intersect=obj.caster.intersectObjects(platform);

				if(intersect.length!==0 && intersect[0].distance < obj.Radius+obj.Velocity.y){
					obj.setVelocityY((intersect[0].distance-obj.Radius)*-1);
				}

				if(intersect.length!==0 && intersect[0].distance < obj.Radius && intersect[0].distance<auxIntersect[0].distance){
					auxIntersect=intersect;
					auxRaio=rays.up[id];
				}
			}


			if(auxIntersect[0].distance!==100000){
				
				if(auxIntersect[0].distance<obj.Velocity.y){
					obj.setVelocityY(auxIntersect[0].distance);
				}
				obj.position.add(auxRaio.clone().multiplyScalar(-(obj.Radius-auxIntersect[0].distance+10)))
				//obj.position.y-=obj.Radius-auxIntersect[0].distance;
				return 1
			}
			return 0;
		};

		obj.detectCollisionDown=function(){
			//var count=0;
			for(var id in rays["down"]){
					obj.caster.set(obj.position,rays["down"][id]);
					var intersect=obj.caster.intersectObjects(objCatchable);
					if(intersect.length>0 && intersect[0].distance < obj.Radius+obj.Velocity["y"]+15){
						scene.remove(intersect[0].object);
						objCatchable= jQuery.grep(objCatchable, function(value) {
							return value !== intersect[0].object;
							});
					}
			}

			var auxIntersect=[];//onde vai ficar informacao da colisao
			auxIntersect[0]={};
			auxIntersect[0].distance=100000;
			var auxRaio;

			for(let id in rays.down){
				obj.caster.set(obj.position,rays.down[id]);
				let intersect=obj.caster.intersectObjects(platform);

				if(intersect.length!==0 && intersect[0].distance < obj.Radius+obj.Velocity.y){
					obj.setVelocityY(intersect[0].distance-obj.Radius);
				}

				if(intersect.length!==0 && intersect[0].distance < obj.Radius && intersect[0].distance<auxIntersect[0].distance){
					auxIntersect=intersect;
					auxRaio=rays.down[id];
				}
				/*if((intersect.length===0)||(intersect.length>0 && intersect[0].distance > obj.Radius)){
					count++;
				}

				else{
					obj.Falling=false;
					obj.updateInclinationTranslation(intersect[0]);
					//obj.position.y-=obj.Radius-intersect[0].distance;
					return 1
				}*/
			}

			if(auxIntersect[0].distance!==100000){
				obj.Falling=false;
				obj.updateInclinationTranslation(auxIntersect[0],auxRaio);
				return 1
			}
			else{
				obj.Falling=true;
				obj.translation.x.y=0;
				obj.translation.z.y=0;//a bola deixa de poder andar no eixo dos yy porque nao ha plano que a ajude a subir
				return 0;
			}
		};

		obj.collision=function(tecla,eixo){
			//detectar objectos que se apanham
			for(var id in rays[tecla]){
					obj.caster.set(obj.position,rays[tecla][id]);
					var intersect=obj.caster.intersectObjects(objCatchable);
					if(intersect.length>0 && intersect[0].distance < obj.Radius+obj.Velocity[eixo]+15){
						scene.remove(intersect[0].object);
						objCatchable= jQuery.grep(objCatchable, function(value) {
							return value !== intersect[0].object;
							});
						jQuery(".pontuacao").html(objCatchable.length);
					}
			}
			//detectar objectos que se podem mover
			for(let id in rays[tecla]){
					obj.caster.set(obj.position,rays[tecla][id]); //atribui ponto de referencia e direcçao
					let intersect=obj.caster.intersectObjects(objMovable);//procura numa lista de objectos os que intersecta
					if(intersect.length>0 && intersect[0].distance < obj.Radius+obj.Velocity[eixo]+15){//se ha algum objecto intersectado faz determinada acção
						intersect[0].object.Velocity[eixo]=obj.Velocity[eixo];
					}
			}
			//detectar objectos inamoviveis
			for(let id in rays[tecla]){
					obj.caster.set(obj.position,rays[tecla][id]);
					let intersect=obj.caster.intersectObjects(platform);
					if(intersect.length>0 && intersect[0].distance < obj.Radius+obj.Velocity[eixo]){
						if(tecla==="a" || tecla==="w")
							obj.position[eixo]-=obj.Radius-intersect[0].distance+obj.Velocity[eixo];
						else
							obj.position[eixo]+=obj.Radius-intersect[0].distance+obj.Velocity[eixo];
						obj.moveFlag[tecla]=false;
						return 1;
					}
			}
			return 0;
		};


		obj.detectCollisionX=function(){
			if(this.Velocity.x>0){
				if(obj.collision("a","x"))
					return 1;
			}
			else if(this.Velocity.x<0){
				if(obj.collision("d","x"))
					return 1;
			}
			return 0;
		};

		obj.detectCollisionZ=function(){
			if(this.Velocity.z>0){
				if(obj.collision("w","z"))
					return 1;
			}
			else if(this.Velocity.z<0){
				if(obj.collision("s","z"))
					return 1;
			}
			return 0;
		};


		obj.detectCollision=function(){
			//console.log(obj.Velocity.y);
			if(obj.detectCollisionUp() && obj.Velocity.y<0){
				obj.setVelocityY(0);
			}
			if(obj.detectCollisionDown() && obj.Velocity.y>0){
				obj.setVelocityY(0);
			}
			if(obj.detectCollisionZ()){
				obj.setVelocityZ(0);
			}
			if(obj.detectCollisionX()){
				obj.setVelocityX(0);
			}
		};

		//update
		obj.updateRotationOrder=function(order){//order tem de receber uma string que tenha os caracters X,Y e Z
			obj.rotation.order=order;
		};

		obj.updateInclinationTranslation=function(objPlatform,raio){


			//console.log(objPlatform.object.rotation);

			if(objPlatform.object.rotation.z){
				obj.translation.x.set(Math.cos(objPlatform.object.rotation.z),Math.sin(objPlatform.object.rotation.z),0);
			}		
			else{
				obj.translation.x.set(1,0,0);
			}

			if(objPlatform.object.rotation.x){
				obj.translation.z.set(0,Math.sin(objPlatform.object.rotation.x),Math.cos(objPlatform.object.rotation.x));
			}
			else{
				obj.translation.z.set(0,0,1);
			}

			obj.inclination.x=objPlatform.object.rotation.x; 
			obj.inclination.z=objPlatform.object.rotation.z; 

			if(!obj.RotationFlag){//se for um cubo, ao passar por cima de alguma rampa, ele inclina-se
				obj.rotation.x=objPlatform.object.rotation.x; 
				obj.rotation.z=objPlatform.object.rotation.z; 
			}

			if(objPlatform.distance<=obj.Radius){
				obj.position.add(raio.clone().multiplyScalar(-(obj.Radius-objPlatform.distance+10)));
			}

			obj.atrito=objPlatform.object.aplicaAtrito;
		};

		obj.updatePosition=function(){			
			obj.detectCollision();

			if(obj.Velocity.z && !obj.Falling){
	    	  	if(obj.Velocity.z>0){
			   		if(obj.Velocity.z-obj.atrito<0)
			   			obj.Velocity.z=0;//força de obj.atrito
			   		else 
			   			obj.addAccelarationZ(-obj.atrito);
			   	}
			   	else if(obj.Velocity.z<0){
			   		if(obj.Velocity.z+obj.atrito>0)
			   			obj.Velocity.z=0;//força de obj.atrito
			   		else 
			   			obj.addAccelarationZ(obj.atrito);
			   	}
	    	}
	    	obj.position.add(obj.translation.z.clone().multiplyScalar(obj.Velocity.z));
	    	

	    	if(obj.Velocity.x && !obj.Falling){
			   	if(obj.Velocity.x>0){
			   		if(obj.Velocity.x-obj.atrito<0)
			   			obj.Velocity.x=0;//força de obj.atrito
			   		else 
			   			obj.addAccelarationX(-obj.atrito);
			   	}
			   	else if(obj.Velocity.x<0){
			   		if(obj.Velocity.x+obj.atrito>0)
			   			obj.Velocity.x=0;//força de obj.atrito
			   		else 
			   			obj.addAccelarationX(obj.atrito);
			   	}
	    	}

	   		obj.position.add(obj.translation.x.clone().multiplyScalar(obj.Velocity.x));		
	  
	    	obj.position.add(new THREE.Vector3(0,-1,0).clone().multiplyScalar(obj.Velocity.y));
	    	
	    	if(obj.RotationFlag){//interessa fazer rotacao se for uma bola
	    		obj.rotation.x+=(2*obj.Velocity.z)/(obj.Radius*Math.PI);
	    		obj.rotation.z-=(2*obj.Velocity.x)/(obj.Radius*Math.PI);
	    	}
		};
	}

	function WORLD(){
		this.app="GraveBall :)";
		this.gravity=0.5;		
	
		var orderRotation='XYZ';

		this.setObject=function(obj){
			this.Obj=obj;
		}

		this.updateVelocity=function(){
				if(this.Obj.Falling){
		    		this.Obj.addAccelarationY(this.gravity);
		    	}
		    	else{
		    	   	if(this.Obj.inclination.z){
			    		this.Obj.addAccelarationX(-this.gravity*Math.sin(this.Obj.inclination.z));
			    	}
			    	if(this.Obj.inclination.x){
			    		this.Obj.addAccelarationZ(this.gravity*Math.sin(this.Obj.inclination.x));
			    	}
		    	}

		    	this.Obj.updatePosition();

		    	for(var i=0;i<objMovable.length;i++){
			    	if(objMovable[i].Falling){
			    		objMovable[i].addAccelarationY(this.gravity);
			    	}
			    	else{
				    	if(objMovable[i].inclination.z){
				    		objMovable[i].addAccelarationX(-this.gravity*Math.sin(objMovable[i].inclination.z));
				    	}
				    	if(objMovable[i].inclination.x){
				    		objMovable[i].addAccelarationZ(this.gravity*Math.sin(objMovable[i].inclination.x));
				    	}
		    		}
		    		objMovable[i].updatePosition();
		    	}
		}

		this.cleanKeyboardKey=function(id){
			var idSpl=id.split("");
				for(var x in idSpl){
					if(keyboard[parseInt(idSpl[x].charCodeAt(0))]){
						keyboard[parseInt(idSpl[x].charCodeAt(0))]="";
					}
			}
		}

		this.fimJogo=function(){
			if(this.Obj.position.y<-100){
				game.endOfGame();
			}
			if(objCatchable.length===0){
				game.endOfGame(1);
			}
		}

		this.moves=function(keyboard){
			if(!this.Obj.Falling && keyboardStatus){	
				if(keyboard[87] && this.Obj.moveFlag.w){//W
					//this.Obj.addAccelarationZ(0.4);
					this.Obj.addAccelarationZ(Math.sin(Math.PI+anguloCamera)*0.4);
					this.Obj.addAccelarationX(-Math.cos(Math.PI+anguloCamera)*0.4);
					orderRotation='XYZ';
					this.Obj.moveFlag.d=true;
		    		this.Obj.moveFlag.s=true;
		    		this.Obj.moveFlag.a=true;
		    	}
		    	if(keyboard[83] && this.Obj.moveFlag.s){//S
		    		//this.Obj.addAccelarationZ(-0.4);
		    		this.Obj.addAccelarationZ(-Math.sin(Math.PI+anguloCamera)*0.4);
					this.Obj.addAccelarationX(Math.cos(Math.PI+anguloCamera)*0.4);
		    		orderRotation='XYZ';
		    		this.Obj.moveFlag.w=true;
		    		this.Obj.moveFlag.d=true;
		    		this.Obj.moveFlag.a=true;
		    	}
		    	if(keyboard[65] && this.Obj.moveFlag.a){//A
		    		//this.Obj.addAccelarationX(0.4);
		    		this.Obj.addAccelarationZ(-Math.sin(Math.PI/2+anguloCamera)*0.4);
					this.Obj.addAccelarationX(Math.cos(Math.PI/2+anguloCamera)*0.4);
		    		orderRotation='ZYX';
		    		this.Obj.moveFlag.w=true;
		    		this.Obj.moveFlag.s=true;
		    		this.Obj.moveFlag.d=true;
		    	}
		    	if(keyboard[68] && this.Obj.moveFlag.d){//D
		    		//this.Obj.addAccelarationX(-0.4);
		    		this.Obj.addAccelarationZ(Math.sin(Math.PI/2+anguloCamera)*0.4);
					this.Obj.addAccelarationX(-Math.cos(Math.PI/2+anguloCamera)*0.4);
		    		orderRotation='ZYX';
		    		this.Obj.moveFlag.w=true;
		    		this.Obj.moveFlag.s=true;
		    		this.Obj.moveFlag.a=true;
		    	}
		    	if(keyboard[32]){
		    		this.Obj.addAccelarationY(-15);
		    	}
	    	}
	    	
	    	if(keyboard[39]){
	    		anguloCamera-=1/100*Math.PI;
	    	}

	    	if(keyboard[37]){
	    		anguloCamera+=1/100*Math.PI;
	    	}

	    	if(keyboard[38]){
	    		distanciaCamera-=5;
	    	}

	    	if(keyboard[40]){
	    		distanciaCamera+=5;
	    	}

	    	this.Obj.updateRotationOrder(orderRotation);

	    	this.updateVelocity();	    	

	    	this.fimJogo();

	    	return 1;
		}

	}

	var BallObj=function(radius){
		//construtor
		var material= new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(ballTexture)});
		var obj = new THREE.Mesh(new THREE.SphereGeometry(radius,50, 50), material);
		obj.castShadow=true;
		obj.structure="ball";
		coisasFisica(obj,radius,1000,true);//obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se

		return obj;
	};

	var CubeObj=function(x,y,z){
		//construtor
		var obj=new THREE.Mesh(new THREE.BoxGeometry(x,y,z), new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(boxTexture)}));
		obj.castShadow=true;
		obj.structure="cube";

		coisasFisica(obj,x/2,30,false);//obj, distancia dos Radiuss de colisao, velocidade maxima, se roda ao mover-se

		return obj;
	};

	var world=new WORLD();

	function init(element){
		renderer=new THREE.WebGLRenderer({antialias:true});
		renderer.setClearColor(0xEEEEEE, 1.0);
      	renderer.clear();
      	renderer.shadowMap.enabled=true;
      	renderer.shadowMapSoft=true;
      	renderer.antialias=true;
      	renderer.shadowMapAutoUpdate=true;
		element.append(renderer.domElement);
		
		scene=new THREE.Scene(); //onde se insere a lista de objetos a mostrar

		var ball=new BallObj(50);
		scene.add(ball);
		ball.position.set(0,500,0);

		//platform.push(ball);
		//objMovable.push(ball);
		world.setObject(ball);

		var plane =new Plate(10000,10,10000,0,brightSquaresTexture);
      	plane.receiveShadow=true;
      	platform.push(plane);
		scene.add(plane);
		plane.position.set(0,0,0);

		var wall =new Plate(100,1000,10000,0.05,brickTexture);
      	wall.receiveShadow=true;
      	platform.push(wall);
		scene.add(wall);
		wall.position.set(5000,0,0);

		var wall2 =new Plate(10000,1000,100,0.05,brickTexture);
      	wall2.receiveShadow=true;
      	platform.push(wall2);
		scene.add(wall2);
		wall2.position.set(0,0,5000);

		var tower =new Plate(500,500,500,0.05,streetTexture);
      	tower.receiveShadow=true;
      	platform.push(tower);
		scene.add(tower);
		tower.position.set(0,150,0);

		var r1 =new Plate(500,100,1500,0.05,streetTexture);
		r1.rotation.x=-1/9*Math.PI;
      	r1.receiveShadow=true;
      	platform.push(r1);
		scene.add(r1);
		r1.position.set(0,50,-900);

		var r2 =new Plate(500,100,1500,0.05,streetTexture);
		r2.rotation.x=1/9*Math.PI;
      	r2.receiveShadow=true;
      	platform.push(r2);
		scene.add(r2);
		r2.position.set(0,50,900);

		var r3 =new Plate(1500,100,500,0.05,streetTexture);
		r3.rotation.z=1/9*Math.PI;
      	r3.receiveShadow=true;
      	platform.push(r3);
		scene.add(r3);
		r3.position.set(-900,50,0);

		var r4 =new Plate(1500,100,500,0.05,streetTexture);
		r4.rotation.z=-1/9*Math.PI;
      	r4.receiveShadow=true;
      	platform.push(r4);
		scene.add(r4);
		r4.position.set(900,50,0);

		var tower2 =new Plate(2000,800,3000,0.05,streetTexture);
      	tower2.receiveShadow=true;
      	platform.push(tower2);
		scene.add(tower2);
		tower2.position.set(-2000,0,2000);


		//platform.push(gift);
		//world.setObject(gift);

		var ray=new THREE.Raycaster();


		// add catchable objects
		for(var i=0;i<1;i++){
			var material= new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load(ballTexture)});
			var gift = new THREE.Mesh(new THREE.SphereGeometry(50,50, 50), material);
			gift.position.z=Math.floor((10000*Math.random()) - 5000);
			gift.position.x=Math.floor((10000*Math.random()) - 5000);
			gift.position.y=3000;

			ray.set(gift.position,new THREE.Vector3(0,-1,0));
			var intersect=ray.intersectObjects(platform);

			if(intersect.length>0){
				gift.position.y=gift.position.y-intersect[0].distance+100;
				if(intersect.length>1){
					console.log(intersect);
					console.log(gift.position);
				}
				//console.log(gift.position);
			}

			scene.add(gift);
			objCatchable.push(gift);
		}

		jQuery(".pontuacao").html(objCatchable.length);

		var cube=new CubeObj(200,200,200);
		scene.add(cube);
		platform.push(cube);
		objMovable.push(cube);
		cube.position.set(new THREE.Vector3(700,1500,700));
		//world.setObject(cube);


     	//point light
		//light = new THREE.PointLight(0xffffff);
		//light.position.set(2000, 2000, -2000);
		//scene.add(light);
		// var spotlight=new THREE.SpotLight(0xffffff);
		// spotlight.position.set(-200,2000,200);
		// //spotlight.shadowCameraVisible = true;
		// // spotlight.shadowDarkness = 0.3;
		// // spotlight.onlyShadow=true;
		// spotlight.intensity = 100;
		// //  spotlight.shadowCameraFov =150;
		// // must enable shadow casting ability for the light
		// spotlight.castShadow = true;
		// scene.add(spotlight);

		//var light = new THREE.AmbientLight( 0x6f6f6f ); // soft white light 
		//scene.add( light );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( -200, 1300, 200 );
		directionalLight.castShadow=true;
		scene.add( directionalLight );

		// var hemisphere= new THREE.HemisphereLight(0xf6f6f6);
		//scene.add(hemisphere);

		//Skybox
		var skyboxGeometry = new THREE.BoxGeometry(100000, 100000, 100000);
		var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x6698FF, side: THREE.BackSide });
		var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
		scene.add(skybox);
	}

	function render(){
		world.moves(keyboard);
		if(camera){
			camera.position.set(-distanciaCamera*Math.cos(anguloCamera),200,distanciaCamera*Math.sin(anguloCamera));
			camera.position.add(world.Obj.position);
			camera.lookAt(world.Obj.position);
			renderer.render(scene,camera);
		}
		requestAnimationId=requestAnimationFrame(render);
	}

export default class GameEngine{

	constructor(keysPressed){
		keyboard = keysPressed;
	}

	load(element){
		init(element);
		game.start();
	}

	render(){
		render();
	}

	stopRender(){
		cancelAnimationFrame(requestAnimationId);
	}

	setSize(width,height){
		camera=new THREE.PerspectiveCamera(45,width/height,1,1000000);
		camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
		renderer.setSize(width,height);
	}
};
