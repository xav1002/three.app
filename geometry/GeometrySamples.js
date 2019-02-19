var geometry;
        var geometryHandlerButton = document.querySelector("#geometryhandlerbutton");
        var geometryHandler = function() {
            geometryInput = document.querySelector('#geometryhandlerinput').value;
            
            if(geometryInput === '1') {
                // PlaneGeometry
                geometry = new THREE.PlaneGeometry(100, 100, 100);
            } else if(geometryInput === '2') {
                // CubeGeometry === BoxGeometry
                // Geometry
                geometry = new THREE.Geometry();
                geometry.vertices.push(
                new THREE.Vector3(-10, 10, 0),
                new THREE.Vector3(-10, -10, 0),
                new THREE.Vector3(10, -10, 0),
                );
                geometry.faces.push( new THREE.Face3(0, 1, 2));
            } else if(geometryInput === '3') {
                // BufferGeometry
                geometry = new THREE.BufferGeometry();
                // var bufferVertices = new Float32Array([
                // -10.0, -10.0, 0.0,
                // 10.0, -10.0, 0.0,
                // 10.0, 10.0, 0.0
                // ]);
            } else if(geometryInput === '4') {
                // BoxGeometry
                geometry = new THREE.BoxGeometry(100, 100, 100);
            } else if(geometryInput === '5') {
                // SphereGeometry
                geometry = new THREE.SphereGeometry(50, 10, 10);
            } else if(geometryInput === '6') {
                // CircleGeometry/CircleBufferGeometry
                geometry = new THREE.CircleGeometry(50, 50, 50);
            } else if(geometryInput === '7') {
                // ConeGeometry
                gemoetry = new THREE.ConeGeometry(100, 100, 100);
            } else if(geometryInput === '8') {
                // CylinderGeometry
                geometry = new THREE.CylinderGeometry(100, 100, 100, 100, false);
            } else if(geometryInput === '9') {
                // PolyhedronGeometry
                var vertices = [
                    'coords', 'coords', 'etc.'
                ];

                var faces = [
                    '#,#,#',  '#,#,#',
                    '#,#,#',  '#,#,#',
                    'etc.'
                ];

                geometry = new THREE.PolyhedronGeometry(vertices, faces, 100, 2);
            } else if(geometryInput === '10') {
                // DodecahedronGeometry
                geometry = new THREE.DodecahedronGeometry(100, 0);
            } else if(geometryInput === '11') {
                // IcosahedronGeometry
                geometry = new THREE.IcosahedronGeometry(100, 0);
            } else if(geometryInput === '12') {
                geometry = new THREE.OctohedronGeometry(100, 50);
            } else if(geometryInput === '13') {
                geometry = new THREE.RingGeometry(50, 100, 32);
            } else if(geometryInput === '14') {
                geometry = new THREE.TetrahedronGeometry(10, 50);
            } else if(geometryInput === '15') {
                geometry = new THREE.TorusGeometry(100, 30, 16, 100);
            } else if(geometryInput === '16') {
                geometry = new THREE.TorusKnotGeometry(100, 30, 100, 100);
            } else if(geometryInput === '17') {
                var points = [];
                for (var i = 0; i < 10; i += 1) {
                    points.push( new THREE.Vector2(5 + Math.sin(i * 0) * 40, i * 10));
                }
                geometry = new THREE.LatheGeometry(points);
            } else if(geometryInput === '18') {
                // 10:00
                var paraFunc = function (u, v) {
                    var x = -100 + 200 * u;
                    var y = 0;
                    var z = (Math.sin(u * Math.PI) + Math.sin(v * Math.PI)) * -60;

                    return new THREE.Vector3(x, y, z);
                }
                geometry = new THREE.ParametricGeometry(paraFunc, 10, 10);
            } else if(geometryInput === '19') {
                var curve = new THREE.SplineCurve3([
                    new THREE.Vector3( -10, 0, 100 ),
                    new THREE.Vector3( -5, 5, 5 ),
                    new THREE.Vector3( 0, 0, 0 ),
                    new THREE.Vector3( 5, -50, 5 ),
                    new THREE.Vector3( 100, 0, 10 )
                ]);
                geometry = new THREE.TubeGeometry(curve, 50, 20, 80, false);
            }
            console.log(geometryInput);
            console.log(geometry);
            var material = new THREE.MeshLambertMaterial({color : 0xF3FFE2});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, -1000);

            scene.add(mesh);

            requestAnimationFrame(render);
            function render() {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.03;
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        renderer.render(scene, camera);
        }
        geometryHandlerButton.addEventListener('click', geometryHandler);