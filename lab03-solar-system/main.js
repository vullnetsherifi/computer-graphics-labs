import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Skena, kamera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 12, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

// MINIMUM 1: PointLight në qendër + AmbientLight
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
const sunLight = new THREE.PointLight(0xffffff, 400);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// MINIMUM 2: Dielli (sferë në origjinë, direkt te scene = rrënja e hierarkisë)
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc00 })
);
scene.add(sun);

// MINIMUM 3: nyja boshe earthOrbit, fëmijë i Diellit
const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit);

// MINIMUM 4: Toka, fëmijë i earthOrbit, position.x = 6
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x2266ff })
);
earth.position.x = 6;
earthOrbit.add(earth);

// STANDARD 1: moonOrbit (fëmijë i Tokës) dhe Hëna (fëmijë i moonOrbit, me zhvendosje anash)
const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
);
moon.position.x = 1.3;
moonOrbit.add(moon);

// CHALLENGE 2: planeti i dytë (Marsi) me hënën e vet (Fobosi)
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xff4422 })
);
mars.position.x = 10;
marsOrbit.add(mars);

const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit);
const phobos = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x999999 })
);
phobos.position.x = 0.9;
phobosOrbit.add(phobos);

// Cikli i renderimit
function animate() {
  requestAnimationFrame(animate);

  earthOrbit.rotation.y += 0.01;   // Toka rreth Diellit
  moonOrbit.rotation.y += 0.04;    // Hëna rreth Tokës
  earth.rotation.y += 0.05;        // Toka rreth vetes

  marsOrbit.rotation.y += 0.006;   // Marsi rreth Diellit
  phobosOrbit.rotation.y += 0.07;  // Fobosi rreth Marsit
  mars.rotation.y += 0.04;         // Marsi rreth vetes

  sun.rotation.y += 0.002;         // CHALLENGE 1: Dielli rreth vetes

  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
