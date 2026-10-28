import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// MINIMUM 1: skena, DirectionalLight + AmbientLight, OrbitControls
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101020);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1, 6);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(3, 5, 4);
scene.add(light);

// MINIMUM 2: kulmet (Float32Array, x y z radhazi)
// 0 = maja sipër, 1 = maja poshtë
// 2..7 = unaza e sipërme (y = 0.8), 8..13 = unaza e poshtme (y = -0.8)
const N = 6; // numri i faqeve anësore
const pos = [0, 2, 0,   0, -2, 0];
for (let i = 0; i < N; i++) {
  const a = (i / N) * Math.PI * 2;
  pos.push(Math.cos(a), 0.8, Math.sin(a));
}
for (let i = 0; i < N; i++) {
  const a = (i / N) * Math.PI * 2;
  pos.push(Math.cos(a), -0.8, Math.sin(a));
}
const vertices = new Float32Array(pos);

// MINIMUM 3: indekset (çdo 3 numra = 1 trekëndësh, renditja counter-clockwise nga jashtë)
const idx = [];
for (let i = 0; i < N; i++) {
  const n = (i + 1) % N;
  const up = 2 + i, upNext = 2 + n;
  const low = 2 + N + i, lowNext = 2 + N + n;

  idx.push(0, upNext, up);          // faqja e majës sipër
  idx.push(up, upNext, low);        // faqja anësore (trekëndëshi 1)
  idx.push(upNext, lowNext, low);   // faqja anësore (trekëndëshi 2)
  idx.push(1, low, lowNext);        // faqja e majës poshtë
}
const indices = new Uint16Array(idx);

// STANDARD 1: pozicioni + indekset te BufferGeometry, pastaj normalet
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));
geometry.computeVertexNormals();

// STANDARD 2 + 3: MeshStandardMaterial, side = FrontSide (parazgjedhja)
const material = new THREE.MeshStandardMaterial({
  color: 0x66ccff,
  side: THREE.FrontSide
});
const crystal = new THREE.Mesh(geometry, material);
scene.add(crystal);

console.log('Kulme:', vertices.length / 3, ' Faqe:', indices.length / 3);

function animate() {
  requestAnimationFrame(animate);
  crystal.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
