class Test {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild(this.renderer.domElement);

        this.cubeGeo = new THREE.CubeGeometry(10, 10, 10);
        this.cubeMat = new THREE.MeshPhongMaterial({color: 'green'});
        this.cubeMesh = new THREE.Mesh(this.cubeGeo, this.cubeMat);
        this.cubeMesh.position.set(0, 0, -20);
        this.scene.add(this.cubeMesh);

        this.pointLight = new THREE.PointLight(0xffffff, 5);
        this.pointLight.position.set(5, 5, 5);
        this.scene.add(this.pointLight);

        this.animate();
    }

    animate() {
        const test = this;

        requestAnimationFrame( function() {test.animate()});

        test.renderer.render(test.scene, test.camera);
    }
}