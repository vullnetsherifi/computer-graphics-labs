import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 5, 16);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 4.5, 0);
controls.update();

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 5, 6);
scene.add(light);

// Dyshemeja
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x3a3a4a, side: THREE.DoubleSide })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground, new THREE.GridHelper(20, 20));

const skin = new THREE.MeshStandardMaterial({ color: 0xe0a070 });
const metal = new THREE.MeshStandardMaterial({ color: 0x555555 });
const armMat = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const joints = []; // nyjet e gishtave qe do perkulen

// Baza
const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), metal);
base.position.y = 0.25;
scene.add(base);

// Shpatulla
const shoulder = new THREE.Group();
shoulder.position.y = 0.25;
base.add(shoulder);
shoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), metal));

// Krahu i siperm (gjatesia 2)
const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2, 0.7), armMat);
upperArm.position.y = 1;
shoulder.add(upperArm);

// Berryli
const elbow = new THREE.Group();
elbow.position.y = 2;
shoulder.add(elbow);
elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), metal));

// Parakrahu (gjatesia 2)
const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2, 0.6), armMat);
foreArm.position.y = 1;
elbow.add(foreArm);

// Kyci i dores
const wrist = new THREE.Group();
wrist.position.y = 2;
elbow.add(wrist);
wrist.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), metal));

// Shputa (femije i kycit)
const palm = new THREE.Mesh(new THREE.BoxGeometry(3, 3.2, 0.8), skin);
palm.position.y = 1.6;
wrist.add(palm);

// Pozicioni fillestar (kendet mblidhen ne 0, dora qendron vertikale)
shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

// Gisht = disa segmente; cdo segment eshte brenda nyjes se te parit (hierarki)
function makeFinger(lengths, x, y, rotZ = 0) {
  const base = new THREE.Group();
  base.position.set(x, y, 0);
  base.rotation.z = rotZ;
  palm.add(base);

  let parent = base;
  for (const len of lengths) {
    const joint = new THREE.Group();
    parent.add(joint);
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.55, len, 0.55), skin);
    seg.position.y = len / 2;
    joint.add(seg);
    const next = new THREE.Group();
    next.position.y = len;
    joint.add(next);
    joints.push(joint);
    parent = next;
  }
}

// 4 gishtat: tregues, i mesit, unazor, i vogel
makeFinger([0.9, 0.7, 0.6], -1.0, 1.6);
makeFinger([1.0, 0.8, 0.6], -0.33, 1.6);
makeFinger([0.9, 0.7, 0.6], 0.33, 1.6);
makeFinger([0.7, 0.5, 0.5], 1.0, 1.6);

// Gishti i madh: nga ana e majte e shputes, i anuar nga jashte
makeFinger([0.9, 0.7], -1.5, -0.8, 0.9);

// Kontrolle me tastiere: Q/A shpatulla, W/S berryli, E/D kyci
const step = THREE.MathUtils.degToRad(5);
addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'q') shoulder.rotation.z += step;
  if (key === 'a') shoulder.rotation.z -= step;
  if (key === 'w') elbow.rotation.z += step;
  if (key === 's') elbow.rotation.z -= step;
  if (key === 'e') wrist.rotation.z += step;
  if (key === 'd') wrist.rotation.z -= step;
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // perkulja e gishtave (shkon para-mbrapa)
  const bend = (Math.sin(Date.now() * 0.002) + 1) / 2;
  joints.forEach(j => { j.rotation.x = bend * 1.1; });
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});