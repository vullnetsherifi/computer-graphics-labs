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
    bx: 0, by: 2, bz: 0
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

function update() {
    const a = new THREE.Vector3(params.ax, params.ay, params.az);
    const b = new THREE.Vector3(params.bx, params.by, params.bz);
    const sum = new THREE.Vector3().addVectors(a, b);

    updateArrow(arrA, a);
    updateArrow(arrB, b);
    updateArrow(arrSum, sum);

    console.log(`a+b = (${sum.toArray()}), a·b = ${a.dot(b)}`);
}

// GUI
const gui = new GUI();
gui.add(params, 'ax', -5, 5, 0.1).onChange(update);
gui.add(params, 'ay', -5, 5, 0.1).onChange(update);
gui.add(params, 'az', -5, 5, 0.1).onChange(update);
gui.add(params, 'bx', -5, 5, 0.1).onChange(update);
gui.add(params, 'by', -5, 5, 0.1).onChange(update);
gui.add(params, 'bz', -5, 5, 0.1).onChange(update);

update();

// Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();