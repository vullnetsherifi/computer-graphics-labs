import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/addons/libs/lil-gui.module.min.js';

// Skena
const scene = new THREE.Scene();

// Kamera
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 5, 9);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Kontrollet me mouse
const controls = new OrbitControls(camera, renderer.domElement);

const pickables = []; // Array per objektet qe mund te zgjidhen
const startPositions = []; // Pozicionet fillestare (per Reset)

// 4 objekte te ndryshme (forma dhe ngjyra), te gjitha me lartesi 1
const shapes = [
  { name: 'Kub', geometry: new THREE.BoxGeometry(1, 1, 1), color: 0x000080 },
  { name: 'Sfere', geometry: new THREE.SphereGeometry(0.5, 32, 16), color: 0x008000 },
  { name: 'Kon', geometry: new THREE.ConeGeometry(0.5, 1, 32), color: 0x4b0082 },
  { name: 'Cilinder', geometry: new THREE.CylinderGeometry(0.4, 0.4, 1, 32), color: 0x8b0000 }
];

shapes.forEach((shape, i) => {
  const material = new THREE.MeshStandardMaterial({ color: shape.color });
  const mesh = new THREE.Mesh(shape.geometry, material);
  mesh.name = shape.name;
  mesh.position.set(-4.5 + i * 3, 0.5, 0);
  scene.add(mesh);
  pickables.push(mesh);
  startPositions.push(mesh.position.clone()); // ruajme pozicionin fillestar
});

const pointer = new THREE.Vector2(); // Vektori i pozicionit te mouse
function updatepointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const px = event.clientX - rect.left;
  const py = event.clientY - rect.top;

  const W = rect.width;
  const H = rect.height;

  pointer.x = (2 * px) / W - 1;
  pointer.y = 1 - (2 * py) / H;
}

let selected = null; // Objekti i zgjedhur
let dragging = false; // A po e terheqim objektin

const raycaster = new THREE.Raycaster(); // Raycaster per zgjidhjen e objekteve

// Plani horizontal ne lartesine y = 0.5 (qendra e objekteve) per levizjen
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);
const intersection = new THREE.Vector3(); // Pika e prerjes me planin

renderer.domElement.addEventListener('pointerdown', (event) => {
  updatepointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables);

  if (selected) {
    selected.material.emissive.set(0x000000); // ja heqim glowin objektit te vjeter
  }

  selected = hits.length > 0 ? hits[0].object : null;

  if (selected) {
    selected.material.emissive.set(0x882200); // glow per objektin e ri
    dragging = true;
    controls.enabled = false; // kamera nuk rrotullohet gjate terheqjes
  }
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging || !selected) return;

  updatepointer(event);
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(plane, intersection)) {
    selected.position.x = intersection.x;
    selected.position.z = intersection.z;
  }
});

addEventListener('pointerup', () => {
  dragging = false;
  controls.enabled = true;
});

// GUI: per cdo objekt nje folder me pozicionin X dhe butonin Reset
const gui = new GUI();

pickables.forEach((mesh, i) => {
  const folder = gui.addFolder(mesh.name);

  // Pozicioni X (perditesohet vete kur e terheqim objektin)
  folder.add(mesh.position, 'x', -8, 8, 0.01).name('X').listen();

  // Reset vetem per kete objekt
  folder.add({
    reset() {
      mesh.position.copy(startPositions[i]);
      mesh.material.emissive.set(0x000000);
      if (selected === mesh) {
        selected = null;
        dragging = false;
        controls.enabled = true;
      }
    }
  }, 'reset').name('Reset');

  folder.open();
});

// Reset per te gjitha objektet
gui.add({
  resetAll() {
    pickables.forEach((mesh, i) => {
      mesh.position.copy(startPositions[i]);
      mesh.material.emissive.set(0x000000);
    });
    selected = null;
    dragging = false;
    controls.enabled = true;
  }
}, 'resetAll').name('Reset te gjitha');

// Dritat
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(4, 5, 6);
scene.add(sun);

scene.add(new THREE.GridHelper(20, 20));

// Cikli i renderimit
function loop() {
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene, camera);
}
loop();

// Rregullo madhesine kur ndryshon dritarja
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});