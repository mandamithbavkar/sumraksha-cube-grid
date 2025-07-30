const canvas = document.getElementById("cubeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('sumraksha_logo.png', (logoTexture) => {
  const rubiksCube = new THREE.Group();
  const cubeSize = 0.9;
  const spacing = 0.15;
  const totalSize = cubeSize + spacing;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        // Each cube gets its own set of materials
        const materials = Array(6).fill().map(() => new THREE.MeshBasicMaterial({ map: logoTexture }));
        const cube = new THREE.Mesh(geometry, materials);

        cube.position.set(x * totalSize, y * totalSize, z * totalSize);
        rubiksCube.add(cube);
      }
    }
  }

  scene.add(rubiksCube);

  // Animate the whole group
  function animate() {
    requestAnimationFrame(animate);
    rubiksCube.rotation.x += 0.005;
    rubiksCube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
});
