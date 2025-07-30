const canvas = document.getElementById("cubeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('sumraksha_logo.png', (logoTexture) => {
  const cubelets = [];
  const cubeSize = 0.9;
  const spacing = 0.05;
  const offset = 1;

  for (let x = -offset; x <= offset; x++) {
    for (let y = -offset; y <= offset; y++) {
      for (let z = -offset; z <= offset; z++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const materials = Array(6).fill().map(() => new THREE.MeshBasicMaterial({ map: logoTexture }));
        const cube = new THREE.Mesh(geometry, materials);
        cube.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
        cube.userData.coord = { x, y, z };
        scene.add(cube);
        cubelets.push(cube);
      }
    }
  }

  const rotations = [
    { axis: 'y', value: 1 },
    { axis: 'x', value: -1 },
    { axis: 'z', value: 0 },
    { axis: 'y', value: -1 },
    { axis: 'x', value: 1 },
    { axis: 'z', value: -1 },
  ];

  let step = 0;
  let rotating = false;
  let rotationGroup = null;
  let angle = 0;

  function getFace(axis, value) {
    const threshold = 0.01;
    return cubelets.filter(cube => {
      return Math.abs(cube.position[axis] - value * (cubeSize + spacing)) < threshold;
    });
  }

  function nextRotation() {
    const { axis, value } = rotations[step % rotations.length];
    const faceCubes = getFace(axis, value);
    rotationGroup = new THREE.Group();
    faceCubes.forEach(cube => rotationGroup.attach(cube));
    scene.add(rotationGroup);
    rotationGroup.userData = { axis };
    rotating = true;
    angle = 0;
    step++;
  }

  function bakeAndUngroup() {
    rotationGroup.updateMatrixWorld();
    const axis = rotationGroup.userData.axis;
    rotationGroup.children.forEach(cube => {
      cube.applyMatrix4(rotationGroup.matrix);
      scene.attach(cube);
    });
    scene.remove(rotationGroup);
    rotationGroup = null;
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!rotating) {
      nextRotation();
    } else {
      const rotSpeed = 0.05;
      const axis = rotationGroup.userData.axis;
      rotationGroup.rotation[axis] += rotSpeed;
      angle += rotSpeed;
      if (angle >= Math.PI / 2) {
        const overshoot = angle - Math.PI / 2;
        rotationGroup.rotation[axis] -= overshoot;
        bakeAndUngroup();
        rotating = false;
      }
    }
    renderer.render(scene, camera);
  }

  animate();
});
