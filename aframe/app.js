class Game{
    constructor(){

            this.scene = document.querySelector('#appscene').object3D;

            const planeGeo = new THREE.PlaneGeometry( 50000, 50000, 100, 100 );
            const planeMat = new THREE.MeshPhongMaterial( { color: 'rgb(100, 300, 100)' });

            // AFRAME.registerComponent('plane', {
            //     init: function() {
            //         this.el.setObject3D('plane', new THREE.Mesh(planeGeo, planeMat));
            //     }
            // });

            // this.scene.add(plane);

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

            if(isIntersecting) {
                // console.log(intersects[0].object);
            }
        }

        animate() {
            const game = this;

            var time = performance.now();
            var delta = ( time - game.prevTime ) / 1000;

            requestAnimationFrame( function(){ game.animate(); } );
    
            // this.cube.rotation.x += 0.01;
            // this.cube.rotation.y += 0.01;

            this.moveCamera(delta);
            this.objectInteraction();

            game.prevTime = time;

            this.renderer.render( this.scene, this.camera );
        }


    }