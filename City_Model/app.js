class Game{
    constructor(){
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
            this.camera.position.y = 500;
            console.log(this.camera, this.camera.position);

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setClearColor('rgb(100, 100, 300)');
            console.log(this.renderer);
            document.body.appendChild( this.renderer.domElement );

            const light = new THREE.PointLight( 0xffffff, 0.5 );
            light.position.set( 0, 20, 10 );
            const ambient = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
    
            const cubeGeo = new THREE.BoxGeometry( 1, 1, 1 );
            const planeGeo = new THREE.PlaneGeometry( 50000, 50000, 100, 100 );

            const cubeMat = new THREE.MeshPhongMaterial( { color: 0x00aaff } );
            const planeMat = new THREE.MeshPhongMaterial( { color: 'rgb(100, 300, 100)' });

            this.cube = new THREE.Mesh( cubeGeo, cubeMat );
            this.cube.position.y = 500;

            this.plane = new THREE.Mesh( planeGeo, planeMat );
            this.plane.position.y = -100;
            this.plane.rotation.x = -90 * Math.PI / 180;

            this.scene.add( this.cube );
            this.scene.add(this.plane);
            this.scene.add( light );
            this.scene.add( ambient );

            this.camera.position.z = 50;

            const game = this;

            const pathPrefix = './assets/';

            const hardLoad = ['Test_Building', 'Test_Building', 'Test_Building'];

            const options = {
                assets:[
                ],
                oncomplete: function() {
                    console.log('works');
                }
            }

            hardLoad.forEach(obj => options.assets.push(`${pathPrefix}${obj}.fbx`));

            var i = 0;

            const objects = [];

            const loader = new THREE.FBXLoader();
            options.assets.forEach(asset => loader.load(asset, function(asset) {
                console.log(asset);
                objects.push(asset);
                i += 1;
                console.log('works');
                if(i === options.assets.length) {
                    game.init(objects);
                }
            }));

            this.prevTime = performance.now();
            this.velocity = new THREE.Vector3();
            this.direction = new THREE.Vector3();

            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;

            this.controls = new THREE.PointerLockControls( this.camera );
            this.scene.add(this.controls.getObject());

            this.activateDiv = document.querySelector('#activate');
            this.activateDiv.addEventListener('click', function() {
                game.controls.lock();
            });

            this.animate();

            // for (var i = 0; i < meshNames.length; i += 1) {
            //     console.log('works');
            //     meshNames[i].position.z = -5000;
            //     meshNames[i].position.x = 1000 * i;
            //     game.scene.add(meshNames[i]);
            // }

            // const preloader = new Preloader(options);
        }

        init(objects) {
            console.log('works');
            const game = this;

            console.log(objects);
            const testBuilding1 = objects[0];
            testBuilding1.position.z = -5000;
            testBuilding1.position.x = -3000;
            testBuilding1.position.y = -300;
            testBuilding1.rotation.y = -45;
            game.scene.add(testBuilding1);

            const testBuilding2 = objects[1];
            testBuilding2.position.z = -5000;
            testBuilding2.position.x = 0;
            testBuilding2.position.y = -300;
            game.scene.add(testBuilding2);

            const testBuilding3 = objects[2];
            testBuilding3.position.z = -5000;
            testBuilding3.position.x = 3000;
            testBuilding3.position.y = -300;
            game.scene.add(testBuilding3);

            console.log(game.controls);
            console.log(game);

            window.addEventListener('keydown', function(e) {
                switch ( e.keyCode ) {
    
                    case 38: // up
                    case 87: // w
                            game.moveForward = true;
                            console.log(game.moveForward);
                            break;
        
                    case 37: // left
                    case 65: // a
                            game.moveLeft = true;
                            break;
        
                    case 40: // down
                    case 83: // d
                            game.moveBackward = true;
                            break;
        
                    case 39: // right
                    case 68: // d
                            game.moveRight = true;
                            break;
        
                    case 32: // up
                            game.moveUp = true;
                            break;
        
                    case 16: // down
                            game.moveDown = true;
                            break;
                        }
            });

            window.addEventListener('keyup', function(e) {
                switch ( e.keyCode ) {
        
                    case 38: // up
                    case 87: // w
                            game.moveForward = false;
                            break;
        
                    case 37: // left
                    case 65: // a
                            game.moveLeft = false;
                            break;
        
                    case 40: // down
                    case 83: // d
                            game.moveBackward = false;
                            break;
        
                    case 39: // right
                    case 68: // d
                            game.moveRight = false;
                            break;
        
                    case 32: // up
                            game.moveUp = false;
                            break;
        
                    case 16: // down
                            game.moveDown = false;
                            break;
                        }
            });

            // var controls = game.controls;

        //     function onDocumentMouseMove(e) {
        //         e.preventDefault();
        //         mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        //         mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        //     }
        //     window.addEventListener('mousemove', onDocumentMouseMove);
        }

        animate() {
            const game = this;
            // console.log(game.camera);
            requestAnimationFrame( function(){ game.animate(); } );
    
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            var time = performance.now();
            var delta = ( time - game.prevTime ) / 1000;
            game.velocity.x -= game.velocity.x * 7.5 * delta;
            game.velocity.z -= game.velocity.z * 7.5 * delta;
            game.velocity.y -= game.velocity.y * 7.5 * delta;

            game.direction.z = Number( game.moveForward ) - Number( game.moveBackward );
            game.direction.x = Number( game.moveLeft ) - Number( game.moveRight );
            game.direction.y = Number( game.moveUp ) - Number( game.moveDown );
            game.direction.normalize(); // this ensures consistent movements in all directions

            if ( game.moveForward || game.moveBackward ) {
                game.velocity.z -= game.direction.z * 4000 * delta;
                console.log(game.velocity.z);
            };
            if ( game.moveLeft || game.moveRight ) {
                game.velocity.x -= game.direction.x * 4000 * delta;
            };
            if (game.moveUp || game.moveDown) {
                game.velocity.y += game.direction.y * 4000 * delta;
            }

            console.log();

            game.controls.getObject().translateX(game.velocity.x * delta);
            game.controls.getObject().translateY(game.velocity.y * delta);
            game.controls.getObject().translateZ(game.velocity.z * delta);

            // controls = game.controls;
            game.prevTime = time;

            this.renderer.render( this.scene, this.camera );
        }


    }

// class Preloader{
//     constructor(options) {
//             this.assets = {};
//             for(let asset of options.assets ){
//                 this.assets[asset] = { loaded: 0, complete: false };
//                 this.load(asset);
//             }
//             console.log(this.assets);

//             this.container = options.container;
		
// 		if (options.onprogress==undefined){
// 			this.onprogress = onprogress;
// 			this.domElement = document.createElement("div");
// 			this.domElement.style.position = 'absolute';
// 			this.domElement.style.top = '0';
// 			this.domElement.style.left = '0';
// 			this.domElement.style.width = '100%';
// 			this.domElement.style.height = '100%';
// 			this.domElement.style.background = '#000';
// 			this.domElement.style.opacity = '0.7';
// 			this.domElement.style.display = 'flex';
// 			this.domElement.style.alignItems = 'center';
// 			this.domElement.style.justifyContent = 'center';
// 			this.domElement.style.zIndex = '1111';
// 			const barBase = document.createElement("div");
// 			barBase.style.background = '#aaa';
// 			barBase.style.width = '50%';
// 			barBase.style.minWidth = '250px';
// 			barBase.style.borderRadius = '10px';
// 			barBase.style.height = '15px';
// 			this.domElement.appendChild(barBase);
// 			const bar = document.createElement("div");
// 			bar.style.background = '#2a2';
// 			bar.style.width = '50%';
// 			bar.style.borderRadius = '10px';
// 			bar.style.height = '100%';
// 			bar.style.width = '0';
// 			barBase.appendChild(bar);
// 			this.progressBar = bar;
// 			if (this.container!=undefined){
// 				this.container.appendChild(this.domElement);
// 			}else{
// 				document.body.appendChild(this.domElement);
// 			}
// 		}else{
// 			this.onprogress = options.onprogress;
// 		}
		
// 		this.oncomplete = options.oncomplete;
		
// 		const loader = this;
// 		function onprogress(delta){
// 			const progress = delta*100;
// 			loader.progressBar.style.width = `${progress}%`;
// 		}
// 	}
	
// 	checkCompleted(){
// 		for(let prop in this.assets){
// 			const asset = this.assets[prop];
// 			if (!asset.complete) return false;
// 		}
// 		return true;
// 	}
	
// 	get progress(){
// 		let total = 0;
// 		let loaded = 0;
		
// 		for(let prop in this.assets){
// 			const asset = this.assets[prop];
// 			if (asset.total == undefined){
// 				loaded = 0;
// 				break;
// 			}
// 			loaded += asset.loaded; 
// 			total += asset.total;
// 		}
		
// 		return loaded/total;
// 	}
	
// 	load(url){
// 		const loader = this;
// 		var xobj = new XMLHttpRequest();
// 		xobj.overrideMimeType("application/json");
// 		xobj.open('GET', url, true); 
// 		xobj.onreadystatechange = function () {
// 			  if (xobj.readyState == 4 && xobj.status == "200") {
// 				  loader.assets[url].complete = true;
// 				  if (loader.checkCompleted()){
// 					  if (loader.domElement!=undefined){
// 						  if (loader.container!=undefined){
// 							  loader.container.removeChild(loader.domElement);
// 						  }else{
// 							  document.body.removeChild(loader.domElement);
// 						  }
// 					  }
// 					  loader.oncomplete();	
// 				  }
// 			  }
// 		};
// 		xobj.onprogress = function(e){
// 			const asset = loader.assets[url];
// 			asset.loaded = e.loaded;
// 			asset.total = e.total;
// 			loader.onprogress(loader.progress);
// 		}
// 		xobj.send(null);
// 	}
//     }