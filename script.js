import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#heartCanvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#02030a");

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 34);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const heartGroup = new THREE.Group();
scene.add(heartGroup);

const COUNT = 12000;
const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const sizes = new Float32Array(COUNT);

const blue = new THREE.Color("#19aaff");
const cyan = new THREE.Color("#b8f5ff");
const purple = new THREE.Color("#a04dff");

function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: 13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t)
  };
}

for (let i = 0; i < COUNT; i++) {
  const t = Math.random() * Math.PI * 2;
  const edge = heartPoint(t);
  const fill = Math.sqrt(Math.random());

  const x = edge.x * fill;
  const y = edge.y * fill;

  // Profundidade para dar volume 3D
  const depth = (Math.random() - 0.5) * 5 * fill;

  positions[i * 3] = x * 0.65;
  positions[i * 3 + 1] = y * 0.65;
  positions[i * 3 + 2] = depth;

  const colorChoice = Math.random();

  const color = colorChoice < 0.68
    ? blue
    : colorChoice < 0.9
      ? cyan
      : purple;

  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;

  sizes[i] = 0.04 + Math.random() * 0.075;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.12,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
});

const heart = new THREE.Points(geometry, material);
heartGroup.add(heart);

// Pequenos pontos de luz ao redor do coração
const sparkCount = 900;
const sparkPositions = new Float32Array(sparkCount * 3);

for (let i = 0; i < sparkCount; i++) {
  sparkPositions[i * 3] = (Math.random() - 0.5) * 24;
  sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
}

const sparkGeometry = new THREE.BufferGeometry();
sparkGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(sparkPositions, 3)
);

const sparks = new THREE.Points(
  sparkGeometry,
  new THREE.PointsMaterial({
    color: "#64caff",
    size: 0.045,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);

scene.add(sparks);

// Base luminosa sob o coração
const baseGeometry = new THREE.BufferGeometry();
const baseCount = 1800;
const basePositions = new Float32Array(baseCount * 3);

for (let i = 0; i < baseCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * 4.8;

  basePositions[i * 3] = Math.cos(angle) * radius;
  basePositions[i * 3 + 1] = -9 + (Math.random() - 0.5) * 0.35;
  basePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.45;
}

baseGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(basePositions, 3)
);

const base = new THREE.Points(
  baseGeometry,
  new THREE.PointsMaterial({
    color: "#218fff",
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);

scene.add(base);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Pulsação suave
  const pulse = 1 + Math.sin(t * 2.2) * 0.035;
  heart.scale.set(pulse, pulse, pulse);

  // Movimento tridimensional lento
  heartGroup.rotation.y = Math.sin(t * 0.35) * 0.12;
  heartGroup.rotation.x = Math.sin(t * 0.25) * 0.06;

  // Brilho pulsante da base
  base.material.opacity = 0.45 + (Math.sin(t * 2.5) + 1) * 0.22;
  sparks.rotation.y = t * 0.015;

  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", resize);

animate();
