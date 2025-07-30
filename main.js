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
const logoTexture = textureLoader.load('sumraksha_logo.png');

const group = new THREE.Group();
const cubeSize = 0.3;
const spacing = 0.05;

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshBasicMaterial({ map: logoTexture });
      const cube = new THREE.Mesh(cubeGeo, [
        cubeMat, cubeMat, cubeMat,
        cubeMat, cubeMat, cubeMat
      ]);
      cube.position.set(
        x * (cubeSize + spacing),
        y * (cubeSize + spacing),
        z * (cubeSize + spacing)
      );
      group.add(cube);
    }
  }
}

scene.add(group);

function animate() {
  requestAnimationFrame(animate);
  group.children.forEach((cube, i) => {
    cube.rotation.x += 0.01 + 0.0005 * i;
    cube.rotation.y += 0.01 + 0.0005 * (27 - i);
  });
  renderer.render(scene, camera);
}
animate();
