let scene;
let camera;
let renderer;
let isLoaded = false;
let plane = undefined;
let sky;
let sun;
let user = 'SofyaLLLL';

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer(
        {
            antialias: true
        }
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,10000);
    camera.position.set(-5,7,-5);
    camera.lookAt(0,0,0);
    scene.add(camera);

    const controls = new THREE.OrbitControls(camera, rendere.domElement);
    controls.update();
    const helper = new THREE.GridHelper(40,10);
    scene.add(helper);

    const directionalLight = new THREE.directionalLight(0xffffff, .9);
    directionalLight.position.set(-1,1,1);
    scene.add(directionalLight);
    const loader = new THREE.GLTFLoader();
    loader.load('../models/a380.glb', function (gltf) {
        plane = gltf.scene;
        plane.scene.set(.2,.2,.2);
    });

    sky = new THREE.Sky();
    sky.scale.setScalar(70);
    scene.add(sky);
    sun = new THREE.Vector3();
    const uniforms = sky.material.uniforms;
    const phi = THREE.MathUtils.degToRad(88);
    sun.setFromSphericalCoords(1, phi, Math.PI/4);
    uniforms['sunPosition'].value.copy(sun);
    renderer.toneMappingExposure = renderer.toneMappingExposure;
    renderer.render(scene, camera);

    render();
    window.addEventListener('resize',onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function rotatePlane(body) {
    plane.rotation.x = THREE.MathUtils.degToRad(body.beta);
    plane.rotation.y = THREE.MathUtils.degToRad(body.alpha);
    plane.rotation.z = THREE.MathUtils.degToRad(body.gamma);
}

if('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', rotatePlane, false);
}
else {
    console.log('Данная технология не поддерживается');
}
function render() {
    if(isLoaded==false && !!plane ) {
        isLoaded = true;
        scene.add(plane);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
init();