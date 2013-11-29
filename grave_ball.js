
	var width=window.innerWidth,
	height=window.innerHeight,
	container=$("#janelaJogo"),
	camera, 
	scene, 
	renderer,
	ballRadius=100,
	ballTranslation=5,
	ballRotation=(2*ballTranslation)/(ballRadius*Math.PI), //x=(ballTranslation*2)/(perimetro)
	ball,
	ballTranslationZ=new THREE.Vector3(0,0,1),
	ballTranslationX=new THREE.Vector3(1,0,0),
	light,
	controls,
	object,
	plane,
	keyboard=[],
	platform=[],
	gravity=true,
	raycaster;//detecta colisoes




	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	function onDocumentKeyDown(event){
				keyboard[event.keyCode]="pressionado";
    }


	function onDocumentKeyUp(event){
				keyboard[event.keyCode]="";
    }

    

    function ballMove(vector,forward){
       	var transAux=vector.clone();

    	transAux.multiplyScalar(ballTranslation);
    	transAux.multiplyScalar(forward);
		//$("#texto").text(transAux.x+" "+transAux.z);
    	ball.position.z+=transAux.z;
    	ball.position.y+=transAux.y;
    	ball.position.x+=transAux.z;
    	$("#texto").text(ball.position.x+" "+ball.position.z);
    }

    function ballMoveZ(forward){
    	ballTranslationZ.multiplyScalar(forward);
	    ballMove(ballTranslationZ,forward);
    }

    function ballMoveX(forward){
    	ballTranslationX.multiplyScalar(forward);
    	ballMove(ballTranslationX,forward);
    }

    function movesUpdate(){
    	if(keyboard[87]){
    		ball.position.z+=ballTranslationZ.z*-ballTranslation;
    		ball.position.y+=ballTranslationZ.y*-ballTranslation;
    		ball.position.x+=ballTranslationZ.x*-ballTranslation;
    		ball.rotation.x-=ballRotation;
    	}
    	if(keyboard[83]){
    		
    		ball.position.z+=ballTranslationZ.z*+ballTranslation;
    		ball.position.y+=ballTranslationZ.y*+ballTranslation;
    		ball.position.x+=ballTranslationZ.x*+ballTranslation;
    		ball.rotation.x+=ballRotation;
    	}
    	if(keyboard[65]){
    		ball.position.z+=ballTranslationX.z*-ballTranslation;
    		ball.position.y+=ballTranslationX.y*-ballTranslation;
    		ball.position.x+=ballTranslationX.x*-ballTranslation;
    		ball.rotation.z+=ballRotation;
    	}
    	if(keyboard[68]){
    		ball.position.z+=ballTranslationX.z*ballTranslation;
    		ball.position.y+=ballTranslationX.y*ballTranslation;
    		ball.position.x+=ballTranslationX.x*ballTranslation;
    		ball.rotation.z-=ballRotation;
    	}

    	//apply gravity
    	raycaster=new THREE.Raycaster(ball.position,new THREE.Vector3(0,-1,0),0,ballRadius+5);
		var intersect= raycaster.intersectObjects(platform);
    	if(gravity && intersect.length==0 && ball.position.y!=-200){
    	//	$("#texto").text("Falling...");
    		ball.position.y-=ballTranslation;
    	}
    	else{
    	//	$("#texto").text("On platform!");
    	}
    }

	init();
	render();

	function init(){
		//Renderizador
		renderer=new THREE.WebGLRenderer({antialias:true});
		renderer.setSize(width,height);
		renderer.setClearColor(0xEEEEEE, 1.0);
      	renderer.clear();
		container.append(renderer.domElement);

		//Cena (lista de objectos a incluir)
		scene=new THREE.Scene();

		//Bola
 		ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 100, 100), new THREE.MeshNormalMaterial({wireframe:true}));
		ball.position.y=10;
		scene.add(ball);

     	//Plano
     	plane = new THREE.Mesh(new THREE.CubeGeometry(250, 10, 1000), new THREE.MeshLambertMaterial({ color: 0x1ec876 }));
      	//plane.overdraw = true;
      	plane.position=new THREE.Vector3(0,-100,0);
      	platform.push(plane);
		scene.add(plane);
		

     	//light
		light = new THREE.PointLight(0xffffff);
		light.position.set(-100, 300, 200);
		scene.add(light);

		//Camera
		camera=new THREE.PerspectiveCamera(45,width/height,1,1000000);
		camera.position.set(ball.position.x,ball.position.y+200,ball.position.x+500);
		camera.lookAt(ball.position);
		scene.add(camera);

		//linha
		/*var material = new THREE.LineBasicMaterial({ color: 0x0000ff  });
		var geometry = new THREE.Geometry();
    	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    	geometry.vertices.push(new THREE.Vector3(0, -500, 0));
    	var line = new THREE.Line(geometry, material);
    	scene.add(line);*/


		//Controls
			controls = new THREE.TrackballControls( camera );

			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.panSpeed = 0.8;

			controls.noZoom = false;
			controls.noPan = false;

			controls.staticMoving = false;
			controls.dynamicDampingFactor = 0.3;

			//controls.keys = [ 65, 83, 68 ];
		
	}

	function render(){
				requestAnimationFrame(render);
				controls.update();
				movesUpdate();
				camera.position.set(ball.position.x,ball.position.y+200,ball.position.x+500);
				camera.lookAt(ball.position);
				renderer.render(scene,camera);
				
	}
	render();