const canvas = document.getElementById("cubeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();
textureLoader.load('sumraksha_logo.png', (logoTexture) => {
  const cubelets = [];
  const cubeSize = 0.9;
  const spacing = 0.05;
  const offset = 1; // because we loop from -1 to 1

  // Create 3x3x3 cubes
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

  // Face rotation queue
  const faceRotations = [
    { axis: 'x', value: 1 },
    { axis: 'y', value: -1 },
    { axis: 'z', value: 0 },
    { axis: 'x', value: -1 },
    { axis: 'y', value: 1 },
    { axis: 'z', value: -1 },
  ];

  let step = 0;
  let rotating = false;
  let rotationGroup = null;
  let angle = 0;

  function selectFace(axis, value) {
    return cubelets.filter(cube => {
      return Math.round(cube.position[axis]) === value * (cubeSize + spacing);
    });
  }

  function nextRotation() {
    const { axis, value } = faceRotations[step % faceRotations.length];
    const faceCubes = selectFace(axis, value);
    rotationGroup = new THREE.Group();
    faceCubes.forEach(cube => rotationGroup.attach(cube));
    scene.add(rotationGroup);
    rotating = true;
    angle = 0;
    rotationGroup.userData.axis = axis;
    step++;
  }

  function update() {
    if (!rotating) {
      nextRotation();
    } else {
      const a = rotationGroup.userData.axis;
      const rotationSpeed = 0.05;
      angle += rotationSpeed;
      rotationGroup.rotation[a] += rotationSpeed;

      if (angle >= Math.PI / 2) {
        const overflow = angle - Math.PI / 2;
        rotationGroup.rotation[a] -= overflow;
        rotationGroup.children.forEach(cube => {
          // Preserve transformation
          cube.position.applyMatrix4(rotationGroup.matrix);
          cube.rotation.setFromRotationMatrix(rotationGroup.matrix.multiply(cube.matrix));
          scene.attach(cube);
        });
        scene.remove(rotationGroup);
        rotating = false;
        rotationGroup = null;
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }

  update();
});
