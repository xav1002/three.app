const scene = document.querySelector('a-scene');

const camera = document.querySelector('#camera');

var cabin = document.createElement('a-entity');
console.log(cabin);
cabin.setAttribute('cabin', true);
cabin.setAttribute('position', '0 0 -10');
scene.appendChild(cabin);

var ground = document.createElement('a-entity');
ground.setAttribute('ground', true);
scene.appendChild(ground);

var cube = document.createElement('a-entity');
cube.setAttribute('red-cube', true);
cube.setAttribute('position', '50 0 -10');
console.log(cube);
scene.appendChild(cube);

// var dancing = document.createElement('a-entity');
// dancing.setAttribute('dancing', true);
// dancing.setAttribute('animation-mixer');
// scene.appendChild(dancing);

// window.addEventListener('click', function() {
//     cabin.setAttribute('animation', {
//         property: 'rotation',
//         to: '0 360 0',
//         dur: '1500',
//         easing: 'linear',
//         loop: 'true'
//     });
//     cube.setAttribute('animation', {
//         property: 'components.material.material.color',
//         type: 'color',
//         from: 'red',
//         to: 'green',
//         dur: '5000',
//     });
// });

console.log(scene);