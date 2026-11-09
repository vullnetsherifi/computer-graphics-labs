import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

// Scena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Boshtet
scene.add(new THREE.AxesHelper(3));

// Kontrollet
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Vlerat qe i ndryshojme me GUI
const params = {
    ax: 2, ay: 1, az: 0,
    bx: 0, by: 2, bz: 0,
    sum: '',
    dot: '',
    cross: '',
    crossLength: '',
    angle: ''
};

const origin = new THREE.Vector3(0, 0, 0);

// Shigjetat
const arrA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0xEB431C, 0.35, 0.2);
const arrB = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0x1E40FF, 0.35, 0.2);
const arrSum = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0x3ECFBE, 0.35, 0.2);
scene.add(arrA, arrB, arrSum);

function updateArrow(arrow, v) {
    if (v.length() === 0) {
        arrow.visible = false;
        return;
    }
    arrow.visible = true;
    arrow.setDirection(v.clone().normalize());
    arrow.setLength(v.length(), 0.35, 0.2);
}

const fmt = (v) => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;

// GUI: Vector A, Vector B, Results
const gui = new GUI();

const aFolder = gui.addFolder('Vector A');
aFolder.add(params, 'ax', -5, 5, 0.1).name('X').onChange(update);
aFolder.add(params, 'ay', -5, 5, 0.1).name('Y').onChange(update);
aFolder.add(params, 'az', -5, 5, 0.1).name('Z').onChange(update);
aFolder.open();

const bFolder = gui.addFolder('Vector B');
bFolder.add(params, 'bx', -5, 5, 0.1).name('X').onChange(update);
bFolder.add(params, 'by', -5, 5, 0.1).name('Y').onChange(update);
bFolder.add(params, 'bz', -5, 5, 0.1).name('Z').onChange(update);
bFolder.open();

const resultsFolder = gui.addFolder('Results');
resultsFolder.add(params, 'sum').name('a + b').disable();
resultsFolder.add(params, 'dot').name('a · b').disable();
resultsFolder.add(params, 'cross').name('a × b').disable();
resultsFolder.add(params, 'crossLength').name('‖a × b‖').disable();
resultsFolder.add(params, 'angle').name('θ').disable();
resultsFolder.open();

function update() {
    const a = new THREE.Vector3(params.ax, params.ay, params.az);
    const b = new THREE.Vector3(params.bx, params.by, params.bz);

    const sum = new THREE.Vector3().addVectors(a, b);
    const dot = a.dot(b);
    const cross = new THREE.Vector3().crossVectors(a, b);
    const crossLength = cross.length();

    // Kendi (nese njeri vektor eshte zero, kendi nuk ka kuptim)
    let angleText = '-';
    if (a.length() > 0 && b.length() > 0) {
        const cos = THREE.MathUtils.clamp(dot / (a.length() * b.length()), -1, 1);
        angleText = THREE.MathUtils.radToDeg(Math.acos(cos)).toFixed(2) + '°';
    }

    updateArrow(arrA, a);
    updateArrow(arrB, b);
    updateArrow(arrSum, sum);

    params.sum = fmt(sum);
    params.dot = dot.toFixed(2);
    params.cross = fmt(cross);
    params.crossLength = crossLength.toFixed(2);
    params.angle = angleText;

    resultsFolder.controllersRecursive().forEach(c => c.updateDisplay());
}

update();

// Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();