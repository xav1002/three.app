class Game{
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
        this.camera.position.z = 400;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor('rgb(100, 100, 300)');
        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 2;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		this.controls.keys = [ 65, 83, 68 ];

        // sun
        // const sunTexture = THREE.ImageUtils.loadTexture();
        this.sunGeometry = new THREE.SphereGeometry(50, 100, 100);
        this.sunMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        this.sunMesh = new THREE.Mesh(this.sunGeometry, this.sunMaterial);

        // planets
        this.mercuryGeometry = new THREE.SphereGeometry(10, 20, 20);
        this.mercuryMaterial = new THREE.MeshPhongMaterial({color: 'green'});
        this.mercuryMesh = new THREE.Mesh(this.mercuryGeometry, this.mercuryMaterial);

        this.venusGeometry = new THREE.SphereGeometry(20, 40, 40);
        this.venusMaterial = new THREE.MeshPhongMaterial({color: 'yellow'});
        this.venusMesh = new THREE.Mesh(this.venusGeometry, this.venusMaterial);

        // light
        this.sunLight = new THREE.PointLight(0xffffff, 1);
        this.sunLight.position.set(0, 0, 0);

        this.light = new THREE.PointLight(0xffffff, 1);
        this.light.position.set(100, 100, 100);

        // Not in Scene
        // this.ambient = new THREE.AmbientLight(0xffffff, 1);

        this.floorGeometry = new THREE.PlaneGeometry(1000, 1000);
        this.floorMaterial = new THREE.MeshPhongMaterial({color: 'white'});
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -200;

        this.time = 0;

        this.init();

    }

    init() {
        const game = this;

        console.log(game.camera, game.scene, game.sunLight, game.light, game.sunMesh, game.floorMesh);

        game.scene.add(game.sunMesh);
        game.scene.add(game.sunLight);
        game.scene.add(game.light);
        game.scene.add(game.floorMesh);

        var mercuryPosX = -100;
        var mercuryPosY = 0;
        var mercuryPosZ = 0;

        game.mercuryMesh.position.set(mercuryPosX, mercuryPosY, mercuryPosZ);
        game.scene.add(game.mercuryMesh);

        var venusPosX = -200;
        var venusPosY = 0;
        var venusPosZ = 0;
        game.venusMesh.position.set(venusPosX, venusPosY, venusPosZ);
        game.scene.add(game.venusMesh);


        game.animate();
    }

    revolve() {
        // # of ticks per revolution?

        const game = this;

        // console.log(game.time);

        // Mercury orbit
        game.mercuryMesh.translateX(20 * Math.sin(game.time / 10));
        game.mercuryMesh.translateY(10 * Math.cos(game.time / 10));
        // game.mercuryMesh.translateZ(10 * Math.sin(game.time / 10));

        // Venus orbit
        game.venusMesh.translateX(30 * Math.sin(game.time / 12));
        game.venusMesh.translateY(35 * Math.cos(game.time / 12));
        game.venusMesh.translateZ(50 * Math.sin(game.time / 12));

        game.time += 1;

        // Eventually the game.time will get so big that it will be difficult for the computer to keep counting up, need way to decrease without a blip in the animation
        // if(game.time > 620) {
        //     game.time -= 620;
        // }
    }

    animate(){
        const game = this;
        requestAnimationFrame( function(){ game.animate() });

        game.revolve();

        game.controls.update();

        game.renderer.render(game.scene, game.camera);
    }
}