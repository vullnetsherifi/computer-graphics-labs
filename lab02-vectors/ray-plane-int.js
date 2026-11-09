import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1419);

// Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6, 5, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Rrafshi: dyshemeja y = 0
const n = new THREE.Vector3(0, 1, 0);   // normalja e rrafshit
const p0 = new THREE.Vector3(0, 0, 0);  // nje pike mbi rrafsh
const d = n.dot(p0);                    // d = n · p0

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({ color: 0x2a3140 })
);
floor.rotation.x = -Math.PI / 2;        // PlaneGeometry eshte vertikal, e shtrijme horizontalisht
floor.updateMatrixWorld(true);          // Raycaster e kerkon kete
scene.add(floor, new THREE.GridHelper(12, 12));

// Rrezja
const o = new THREE.Vector3(2, 5, 1);                      // origjina
const dir = new THREE.Vector3(0.3, -1, 0.1).normalize();   // drejtimi

// Formula: t = (d - n·o) / (n·dir), pika p = o + t·dir
const t = (d - n.dot(o)) / n.dot(dir);
const hit = o.clone().addScaledVector(dir, t);

// Vizatimi i rrezes dhe i pikes se prerjes
scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([o, hit]),
    new THREE.LineBasicMaterial({ color: 0xff4422 })
));

const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({ color: 0xffd700 })
);
dot.position.copy(hit);
scene.add(dot);

// Krahasimi me THREE.Raycaster
const rcHit = new THREE.Raycaster(o, dir).intersectObject(floor)[0];
console.log('Formula:  ', hit.toArray().map(x => x.toFixed(3)));
console.log('Raycaster:', rcHit.point.toArray().map(x => x.toFixed(3)));

// Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();