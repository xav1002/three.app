import { Scene, CanvasRenderer } from "./three";

var geometry = new THREE.BoxGeometry(100, 100, 100);
var mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1000;
mesh.position.x = -100;
screen.add(mesh);

var geometry2 = new THREE.SphereGeometry(50, 20, 20);
var mesh2 = new THREE.Mesh(geometry2, material);
mesh2.position.z = -1000;
mesh2.position.x = 100;
scene.add(mesh2);

var geometry3= new THREE.PlaneGeometry(10000, 10000, 100, 100);
var mesh3 = new THREE.Mesh(geometry3, material);
mesh3.rotation.x = -90 * Math.PI / 180;
mesh3.position.y = -100;
scene.add(mesh3);

render();

function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}