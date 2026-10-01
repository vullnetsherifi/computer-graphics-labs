import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Skena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Kamera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Kubi
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ color: 0x22c55e });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Sfera (pas kubit)
const geometryS = new THREE.SphereGeometry(1, 8, 8);
const materialS = new THREE.MeshStandardMaterial({ color: 0x3b82f6, wireframe: true });
const sphere = new THREE.Mesh(geometryS, materialS);
sphere.position.z = -3;
scene.add(sphere);

// Dritat
const light = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(light);
const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(3, 3, 5);
scene.add(dirLight);

// Kontrollet me mouse
const control = new OrbitControls(camera, renderer.domElement);

// Animimi
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    sphere.rotation.y += 0.01;
    control.update();
    renderer.render(scene, camera);
}
animate();

// Rregullo madhësinë kur ndryshon dritarja
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});