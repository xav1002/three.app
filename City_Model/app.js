class Game{
    constructor(){

        // 1. JS Classes V
        // 2. Raycaster, environment interaction V
        // 3. Loading the environment V
        // 4. Menus
        // 5. Cut scenes
        // 6. Different layers of app
        // 7. Cursor V
        // Aframe
        // hiC, BigWig tracks
        // Scenes not constant, data driven, depends on type of data loaded
        // Amt. of computation needs to be able to handle polygons of assets in scene: preserve framerate; prevent adding too many tracks
            // If # polygons can't be decreased, increase computation; split computation from display

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setClearColor('rgb(100, 100, 300)');
            document.body.appendChild( this.renderer.domElement );

            const light = new THREE.PointLight( 0xffffff, 0.5 );
            light.position.set( 0, 20, 10 );
            const ambient = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
    
            const cubeGeo = new THREE.BoxGeometry( 100, 100, 100 );
            const planeGeo = new THREE.PlaneGeometry( 50000, 50000, 100, 100 );

            const cubeMat = new THREE.MeshPhongMaterial( { color: 0x00aaff } );
            const planeMat = new THREE.MeshPhongMaterial( { color: 'rgb(100, 300, 100)' });

            this.cube = new THREE.Mesh( cubeGeo, cubeMat );
            this.cube.position.y = 500;
            this.cube.position.z = -2000;

            this.plane = new THREE.Mesh( planeGeo, planeMat );
            this.plane.position.y = 0;
            this.plane.rotation.x = -90 * Math.PI / 180;

            this.scene.add( light );
            this.scene.add( ambient );
            this.scene.add( this.cube );
            this.scene.add(this.plane);

            const game = this;

            const pathPrefix = './assets/';
            const hardLoad = ['Wooden_Cabin'];

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
            this.physicalObj = [];
            const loader = new THREE.FBXLoader();

            this.scene.children.forEach(child => game.physicalObj.push(child));

            options.assets.forEach(asset => loader.load(asset, function(asset) {
                console.log(asset);
                objects.push(asset);
                asset.children.forEach(child => game.physicalObj.push(child));
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

            this.raycasterFront = new THREE.Raycaster();
            this.raycasterLeft = new THREE.Raycaster();
            this.raycasterRight = new THREE.Raycaster();
            this.raycasterBack = new THREE.Raycaster();
            this.raycasterUp = new THREE.Raycaster();
            this.raycasterDown = new THREE.Raycaster();

            this.controls = new THREE.PointerLockControls( this.camera );
            this.controls.getObject().position.y = 100;
            this.controls.getObject().position.z = 50;
            // this.controls.getObject().children[0].matrixWorldNeedsUpdate = true;
            this.scene.add(this.controls.getObject());

            this.displayLoading = document.createElement('div');
            this.displayLoading.innerText = "Loading . . .";
            this.displayLoading.style.fontSize = '40px';
            this.displayLoading.style.width = '100%';
            this.displayLoading.style.height = '50%';
            this.displayLoading.style.display = 'block';
            this.displayLoading.style.position = 'absolute';
            this.displayLoading.style.color = 'white';
            this.displayLoading.style.textAlign = 'center';
            this.displayLoading.style.top = '50%';
            document.body.appendChild(this.displayLoading);

            this.cursorVert = document.querySelector('.cursor-vertical');
            this.cursorHorizon = document.querySelector('.cursor-horizontal');
            this.cursorVert.style.top = Number((window.innerHeight / 2) - 10) + 'px';
            this.cursorVert.style.left = Number((window.innerWidth / 2) - 3/2) + 'px';
            this.cursorHorizon.style.top = Number((window.innerHeight / 2) - 3/2) + 'px';
            this.cursorHorizon.style.left = Number((window.innerWidth / 2) - 10) + 'px';

            this.activateDiv = document.querySelector('#activate');
            this.activateDiv.addEventListener('click', function() {
                game.controls.lock();
                game.activateDiv.style.display = 'none';
                game.cursorVert.style.display = 'block';
                game.cursorHorizon.style.display = 'block';
            });
            this.controls.addEventListener('unlock', function() {
                game.activateDiv.style.display = 'block';
                game.cursorVert.style.display = 'none';
                game.cursorHorizon.style.display = 'none';
            });

        }

        init(objects) {
            const game = this;

            document.body.removeChild(game.displayLoading);
            game.activateDiv.style.display = 'block';

            console.log(game.controls.getObject(), game.controls.getObject().children[0], game.camera, game.scene);

            console.log(objects);
            const woodenCabin = objects[0];
            woodenCabin.position.z = -1000;
            woodenCabin.position.x = 0;
            woodenCabin.position.y = -200;
            game.scene.add(woodenCabin);

            // const testBuilding2 = objects[1];
            // testBuilding2.position.z = -5000;
            // testBuilding2.position.x = 0;
            // testBuilding2.position.y = -300;
            // game.scene.add(testBuilding2);

            // const testBuilding3 = objects[2];
            // testBuilding3.position.z = -5000;
            // testBuilding3.position.x = 3000;
            // testBuilding3.position.y = -300;
            // game.scene.add(testBuilding3);

            // const simpleBuilding1 = objects[3];
            // simpleBuilding1.position.z = -5000;
            // simpleBuilding1.position.x = -3000;
            // simpleBuilding1.position.y = -300;
            // game.scene.add(simpleBuilding1);

            game.animate();

            window.addEventListener('keydown', function(e) {
                switch ( e.keyCode ) {
    
                    case 38: // up
                    case 87: // w
                            game.moveForward = true;
                            // console.log(game.moveForward);
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
        }

        moveCamera(delta) {
            const game = this;

            // console.log(game.scene.children[7].children);

            game.velocity.x -= game.velocity.x * 7.5 * delta;
            game.velocity.z -= game.velocity.z * 7.5 * delta;
            game.velocity.y -= game.velocity.y * 7.5 * delta;

            game.direction.z = Number( game.moveForward ) - Number( game.moveBackward );
            game.direction.x = Number( game.moveLeft ) - Number( game.moveRight );
            game.direction.y = Number( game.moveUp ) - Number( game.moveDown );
            game.direction.normalize(); // this ensures consistent movements in all directions

            if ( game.moveForward || game.moveBackward ) {
                game.velocity.z -= game.direction.z * 4000 * delta;
            };
            if ( game.moveLeft || game.moveRight ) {
                game.velocity.x -= game.direction.x * 4000 * delta;
            };
            if (game.moveUp || game.moveDown) {
                game.velocity.y += game.direction.y * 4000 * delta;
            }

            let position = game.controls.getObject().position.clone();
            let directionBack = new THREE.Vector3();
            game.controls.getObject().children[0].getWorldDirection(directionBack);
            let directionUp = new THREE.Vector3(0, 1, 0);
            let directionDown = new THREE.Vector3(0, -1, 0);
            const limitDistance = 60;

            // Up distance limit
            let upTooClose = false;
            game.raycasterUp.ray.origin = position;
            game.raycasterUp.ray.direction = directionUp;
            game.raycasterUp.far = limitDistance;

            for(let obj of game.physicalObj) {
                const intersect = game.raycasterUp.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < limitDistance) {
                        upTooClose = true;
                        break;
                    }
                }
            }
            if(upTooClose && game.velocity.y > 0) {
                game.velocity.y = 0;
            }

            // Down distance limit
            let downTooClose = false;
            game.raycasterDown.ray.origin = position;
            game.raycasterDown.ray.direction = directionDown;
            game.raycasterDown.far = limitDistance;

            for(let obj of game.physicalObj) {
                const intersect = game.raycasterDown.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < 100) {
                        downTooClose = true;
                        break;
                    }
                }
            }
            if(downTooClose && game.velocity.y < 0) {
                game.velocity.y = 0;
            }

            // Back distance limit
            let backTooClose = false;
            game.raycasterBack.ray.origin = position;
            game.raycasterBack.ray.direction = directionBack;
            game.raycasterBack.far = limitDistance;

            for(let obj of game.physicalObj) {
                const intersect = game.raycasterBack.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < limitDistance) {
                        backTooClose = true;
                        break;
                    }
                }
            }
            if(backTooClose && game.velocity.z > 0) {
                game.velocity.z = 0;
            }

            // Front distance limit
            let frontTooClose = false;
            let directionFront = directionBack.clone();
            directionFront.applyAxisAngle(directionUp, Math.PI);
            game.raycasterFront.ray.origin = position;
            game.raycasterFront.ray.direction = directionFront;
            game.raycasterFront.far = limitDistance;
            for(let obj of game.physicalObj) {
                const intersect = game.raycasterFront.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < limitDistance) {
                        frontTooClose = true;
                        break;
                    }
                }
            }
            if(frontTooClose && game.velocity.z < 0) {
                game.velocity.z = 0;
            }

            // Right distance limit
            let rightTooClose = false;
            let directionRight = directionBack.clone();
            directionRight.applyAxisAngle(directionUp, - Math.PI / 2);
            game.raycasterRight.ray.origin = position;
            game.raycasterRight.ray.direction = directionRight;
            game.raycasterRight.far = limitDistance;

            for(let obj of game.physicalObj) {
                const intersect = game.raycasterRight.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < limitDistance) {
                        rightTooClose = true;
                        break;
                    }
                }
            }
            if(rightTooClose && game.velocity.x < 0) {
                game.velocity.x = 0;
            }

            // Left distance limit
            let leftTooClose = false;
            let directionLeft = directionBack.clone();
            directionLeft.applyAxisAngle(directionUp, (Math.PI / 2));
            game.raycasterLeft.ray.origin = position;
            game.raycasterLeft.ray.direction = directionLeft;
            game.raycasterLeft.far = limitDistance;

            for(let obj of game.physicalObj) {
                const intersect = game.raycasterLeft.intersectObject(obj);
                if(intersect.length > 0) {
                    if(intersect[0].distance < limitDistance) {
                        leftTooClose = true;
                        break;
                    }
                }
            }
            if(leftTooClose && game.velocity.x > 0) {
                game.velocity.x = 0;
            }

            game.controls.getObject().translateX(game.velocity.x * delta);
            game.controls.getObject().translateY(game.velocity.y * delta);
            game.controls.getObject().translateZ(game.velocity.z * delta);

        }

        animate() {
            const game = this;

            var time = performance.now();
            var delta = ( time - game.prevTime ) / 1000;

            requestAnimationFrame( function(){ game.animate(); } );
    
            // this.cube.rotation.x += 0.01;
            // this.cube.rotation.y += 0.01;

            this.moveCamera(delta);

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