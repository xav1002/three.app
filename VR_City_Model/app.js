const scene = document.querySelector('a-scene');

var camera = document.createElement('a-camera');
camera.setAttribute('look-controls', true);
camera.setAttribute('wasd-controls', true);

const loader = new THREE.FBXLoader();
var cabin = document.createElement('a-entity');

cabin.setAttribute('obj-model', {
    obj: '#woodencabinobj',
    mtl: '#woodencabinmtl'
});
console.log(cabin);
// cabin.setAttribute('modify-cabin', true);
cabin.setAttribute('scale', '1 1 1');
cabin.setAttribute('position', '0 0 -10');
scene.appendChild(cabin);

var ground = document.createElement('a-entity');
ground.setAttribute('ground', true);
scene.appendChild(ground);

console.log(scene);
console.log(camera);