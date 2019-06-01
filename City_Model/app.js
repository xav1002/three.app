class Game{
    constructor(){

        // 1. JS Classes V
        // 2. Raycaster, environment interaction V
        // 3. Loading the environment V
        // 4. Menus
        // 5. Cut scenes
        // 6. Different layers of app
        // 7. Cursor V
        // 8. Learn Animations
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

            const grassTexture = THREE.ImageUtils.loadTexture('./assets/grassTexture.jpg');

            const cubeMat = new THREE.MeshPhongMaterial( { color: 0x00aaff } );
            const planeMat = new THREE.MeshPhongMaterial( { map: grassTexture });

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
            const hardLoad = ['Wooden_Cabin', 'flag'];

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
            this.loader = new THREE.FBXLoader();
            this.gltfLoader = new THREE.GLTFLoader();

            this.scene.children.forEach(child => game.physicalObj.push(child));

            options.assets.forEach(asset => game.loader.load(asset, function(asset) {
                console.log(asset);
                objects.push(asset);
                asset.children.forEach(child => game.physicalObj.push(child));
                // create div of info for each item
                i += 1;
                console.log('works');
                if(i === options.assets.length) {
                    game.init(objects);
                }
            }));

            this.clock = new THREE.Clock();
            this.prevTime = performance.now();
            this.velocity = new THREE.Vector3();
            this.direction = new THREE.Vector3();

            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;

            this.directionBack = new THREE.Vector3();
            this.directionUp = new THREE.Vector3(0, 1, 0);
            this.directionDown = new THREE.Vector3(0, -1, 0);
            this.interactionDirectionBack = new THREE.Vector3();

            this.raycasterFront = new THREE.Raycaster();
            this.raycasterLeft = new THREE.Raycaster();
            this.raycasterRight = new THREE.Raycaster();
            this.raycasterBack = new THREE.Raycaster();
            this.raycasterUp = new THREE.Raycaster();
            this.raycasterDown = new THREE.Raycaster();
            this.interactionRaycaster = new THREE.Raycaster();

            this.controls = new THREE.PointerLockControls( this.camera );
            this.controls.getObject().position.y = 100;
            this.controls.getObject().position.z = 50;
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

            this.player = {};
            this.player2 = {};
            this.playerLoaded = false;

        }

        init(objects) {
            const game = this;

            document.body.removeChild(game.displayLoading);
            game.activateDiv.style.display = 'block';

            console.log(game.controls.getObject(), game.controls.getObject().children[0], game.camera, game.scene);

            console.log(objects);
            const woodenCabin = objects[1];
            woodenCabin.position.z = -1000;
            woodenCabin.position.x = 0;
            woodenCabin.position.y = -200;
            game.scene.add(woodenCabin);

            const flag = objects[0];
            flag.position.z = -300;
            flag.position.x = 200;
            flag.position.y = -100;
            game.scene.add(flag);

            game.loader.load('assets/Walking.fbx', function(obj) {
                obj.mixer = new THREE.AnimationMixer( obj );
                game.player.mixer = obj.mixer;
                game.player.root = obj.mixer.getRoot();
                obj.name = 'Character';
                obj.traverse( function(child) {
                    if(child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                game.player.root.position.x = -50;
                game.scene.add(obj);
                game.player.object = obj;
                game.player.Walking = obj.animations[0];
                game.action = 'Walking';
                game.playerLoaded = true;

                game.loadNextAnim();
            });

            game.gltfLoader.load('./assets/sambaDancing.gltf', function(obj) {
                // obj.mixer = new THREE.AnimationMixer( obj );
                // game.player2.mixer = obj.mixer;
                // game.player2.root = obj.mixer.getRoot();
                // obj.name = 'Character2';
                // obj.scene.traverse( function(child) {
                //     if(child.isMesh) {
                //         child.castShadow = true;
                //         child.receiveShadow = true;
                //     }
                // });

                // console.log(obj.scene.children[0].children);
                // game.scene.add(obj.scene.children[0].children);
                console.log(obj);
                obj.scene.children[0].children.traverse(child => {
                    if(child.isMesh) {
                        // console.log(child);
                        game.scene.add(child);
                        // console.log('works');
                    }
                });
                // game.player2.object = obj;
                // game.player2.Dancing = obj.animations[0];
                // game.action2 = 'Dancing';
            })

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

        set action(name) {
            game = this;
            const anim = game.player[name];
            console.log(name);
            const action = game.player.mixer.clipAction(anim, game.player.root);
            action.time = 0;
            action.play();
        }

        set action2(name) {
            game = this;
            const anim = game.player2[name];
            const action = game.player2.mixer.clipAction(anim, game.player2.root);
            action.time = 0;
            action.play();
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
            game.controls.getObject().children[0].getWorldDirection(game.directionBack);
            const limitDistance = 60;

            // Up distance limit
            let upTooClose = false;
            game.raycasterUp.ray.origin = position;
            game.raycasterUp.ray.direction = game.directionUp;
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
            game.raycasterDown.ray.direction = game.directionDown;
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
            game.raycasterBack.ray.direction = game.directionBack;
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
            let directionFront = game.directionBack.clone();
            directionFront.applyAxisAngle(game.directionUp, Math.PI);
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
            let directionRight = game.directionBack.clone();
            directionRight.applyAxisAngle(game.directionUp, - Math.PI / 2);
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
            let directionLeft = game.directionBack.clone();
            directionLeft.applyAxisAngle(game.directionUp, (Math.PI / 2));
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

        objectInteraction() {
            game = this;

            game.controls.getObject().getWorldDirection(game.interactionDirectionBack);
            let interactionDirectionFront = game.interactionDirectionBack.clone();
            interactionDirectionFront.applyAxisAngle(game.directionUp, Math.PI);

            game.interactionRaycaster.ray.origin = game.controls.getObject().position.clone();
            game.interactionRaycaster.ray.direction = interactionDirectionFront;

            let intersects = game.interactionRaycaster.intersectObjects(game.physicalObj);

            var isIntersecting;

            if(intersects.length > 0) {
                isIntersecting = true;
            } else if(intersects.length <= 0) {
                isIntersecting = false;
            }

            // if(isIntersecting) {
            //     intersects[0].object.material.color = 'red';
            // }
        }

        animate() {
            const game = this;
            requestAnimationFrame( function(){ game.animate(); } );

            var time = performance.now();
            var delta = ( time - game.prevTime ) / 1000;
            var animationDelta = game.clock.getDelta();

            // if(game.playerLoaded) {
            //     game.player.root.position.z += 5;
            // }

            if(game.player.mixer) {game.player.mixer.update(animationDelta)};
            if(game.player2.mixer) {game.player2.mixer.update(animationDelta)};

            // this.cube.rotation.x += 0.01;
            // this.cube.rotation.y += 0.01;

            this.moveCamera(delta);
            this.objectInteraction();

            game.prevTime = time;

            this.renderer.render( this.scene, this.camera );
        }


    }