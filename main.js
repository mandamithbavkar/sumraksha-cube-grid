import * as THREE from 'https://cdn.skypack.dev/three';

const canvas = document.getElementById("cubeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('sumraksha_logo_grid.png');

const materials = Array(6).fill(new THREE.MeshBasicMaterial({ map: logoTexture }));
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
