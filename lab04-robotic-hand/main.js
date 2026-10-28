import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1, 9);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(3, 5, 6);
scene.add(light);

const skin = new THREE.MeshStandardMaterial({ color: 0xe0a070 });
const joints = []; // këtu ruajmë nyjet që do përkulen

// Shputa (pëllëmba)
const palm = new THREE.Mesh(new THREE.BoxGeometry(3, 3.2, 0.8), skin);
scene.add(palm);

// Gisht = disa segmente; çdo segment është brenda nyjës së të parit (hierarki)
function makeFinger(lengths, x, y, rotZ = 0) {
  const base = new THREE.Group();
  base.position.set(x, y, 0);
  base.rotation.z = rotZ;
  palm.add(base);

  let parent = base;
  for (const len of lengths) {
    const joint = new THREE.Group();        // nyja (rrotullohet për përkulje)
    parent.add(joint);
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.55, len, 0.55), skin);
    seg.position.y = len / 2;               // segmenti ngrihet nga nyja
    joint.add(seg);
    // nyja tjetër ndodhet në fund të këtij segmenti
    const next = new THREE.Group();
    next.position.y = len;
    joint.add(next);
    joints.push(joint);
    parent = next;
  }
}

// 4 gishtat (te maja e shputes): tregues, i mesit, unazor, i vogël
makeFinger([0.9, 0.7, 0.6], -1.0, 1.6);
makeFinger([1.0, 0.8, 0.6], -0.33, 1.6);
makeFinger([0.9, 0.7, 0.6], 0.33, 1.6);
makeFinger([0.7, 0.5, 0.5], 1.0, 1.6);

// Gishti i madh: nga ana e MAJTË e shputes, i anuar nga jashtë
makeFinger([0.9, 0.7], -1.5, -0.8, 0.9);

function animate() {
  requestAnimationFrame(animate);
  // përkulja e gishtave (shkon para-mbrapa)
  const bend = (Math.sin(Date.now() * 0.002) + 1) / 2;   // 0 .. 1
  joints.forEach(j => { j.rotation.x = bend * 1.1; });
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
