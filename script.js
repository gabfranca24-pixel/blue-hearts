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
  antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const TAU = Math.PI * 2;
const COUNT = 10000;

const blue = new THREE.Color("#168fff");
const cyan = new THREE.Color("#b8f5ff");
const purple = new THREE.Color("#a34dff");

// ======================================
// CORAÇÃO DE PARTÍCULAS
// ======================================

const positions = new Float32Array(COUNT * 3);
const targets = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const randoms = new Float32Array(COUNT * 4);

function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

for (let i = 0; i < COUNT; i++) {
  const edge = heartPoint(Math.random() * TAU);
  const fill = Math.sqrt(Math.random());

  targets[i * 3] = edge.x * fill * 0.65;
  targets[i * 3 + 1] = edge.y * fill * 0.65;
  targets[i * 3 + 2] = (Math.random() - 0.5) * 3.5 * fill;

  positions[i * 3] = targets[i * 3];
  positions[i * 3 + 1] = targets[i * 3 + 1];
  positions[i * 3 + 2] = targets[i * 3 + 2];

  randoms[i * 4] = Math.random() * TAU;
  randoms[i * 4 + 1] = 0.5 + Math.random() * 1.5;
  randoms[i * 4 + 2] = Math.random();
  randoms[i * 4 + 3] = Math.random() * TAU;

  const choice = Math.random();
  const color =
    choice < 0.62 ? blue :
    choice < 0.86 ? cyan :
    purple;

  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

const heartGeometry = new THREE.BufferGeometry();
heartGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
heartGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

const heartMaterial = new THREE.PointsMaterial({
  size: 0.14,
  vertexColors: true,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
});

const heart = new THREE.Points(heartGeometry, heartMaterial);
scene.add(heart);

// ======================================
// POEIRA AO REDOR
// ======================================

const dustCount = 700;
const dustPositions = new Float32Array(dustCount * 3);
const dustData = [];

for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - 0.5) * 26;
  dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
  dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;

  dustData.push({
    phase: Math.random() * TAU,
    speed: 0.3 + Math.random() * 1.2
  });
}

const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(dustPositions, 3)
);

const dustMaterial = new THREE.PointsMaterial({
  color: "#5dbbff",
  size: 0.045,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// ======================================
// BASE DE ENERGIA ABAIXO DO CORAÇÃO
// ======================================

// Camada horizontal de energia
const baseCount = 3500;
const basePositions = new Float32Array(baseCount * 3);
const baseColors = new Float32Array(baseCount * 3);
const baseData = [];

for (let i = 0; i < baseCount; i++) {
  const angle = Math.random() * TAU;
  const radius = Math.sqrt(Math.random()) * 5.2;

  basePositions[i * 3] = Math.cos(angle) * radius;
  basePositions[i * 3 + 1] = -10 + Math.random() * 0.8;
  basePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.55;

  const color = Math.random() < 0.72 ? blue : purple;
  baseColors[i * 3] = color.r;
  baseColors[i * 3 + 1] = color.g;
  baseColors[i * 3 + 2] = color.b;

  baseData.push({
    angle,
    radius,
    speed: 0.8 + Math.random() * 1.8,
    phase: Math.random() * TAU
  });
}

const baseGeometry = new THREE.BufferGeometry();
baseGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(basePositions, 3)
);
baseGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(baseColors, 3)
);

const baseMaterial = new THREE.PointsMaterial({
  size: 0.11,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const energyBase = new THREE.Points(baseGeometry, baseMaterial);
scene.add(energyBase);

// ======================================
// FEIXES DE PARTÍCULAS SUBINDO
// ======================================

const streamCount = 2200;
const streamPositions = new Float32Array(streamCount * 3);
const streamColors = new Float32Array(streamCount * 3);
const streamData = [];

for (let i = 0; i < streamCount; i++) {
  const angle = Math.random() * TAU;
  const radius = Math.random() * 3.8;

  streamPositions[i * 3] = Math.cos(angle) * radius;
  streamPositions[i * 3 + 1] = -9 + Math.random() * 8;
  streamPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.5;

  const color = Math.random() < 0.7 ? cyan : blue;
  streamColors[i * 3] = color.r;
  streamColors[i * 3 + 1] = color.g;
  streamColors[i * 3 + 2] = color.b;

  streamData.push({
    angle,
    radius: 0.2 + Math.random() * 3.5,
    speed: 1.5 + Math.random() * 3,
    phase: Math.random() * TAU,
    height: 7 + Math.random() * 5
  });
}

const streamGeometry = new THREE.BufferGeometry();
streamGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(streamPositions, 3)
);
streamGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(streamColors, 3)
);

const streamMaterial = new THREE.PointsMaterial({
  size: 0.075,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const energyStreams = new THREE.Points(streamGeometry, streamMaterial);
scene.add(energyStreams);

// ======================================
// NÚCLEO LUMINOSO DA BASE
// ======================================

const core = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 16, 16),
  new THREE.MeshBasicMaterial({
    color: "#168fff",
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })
);

core.position.set(0, -9.2, 0);
scene.add(core);

// ======================================
// ANIMAÇÃO
// ======================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // O coração se desfaz e se recompõe
  const cycle = (t % 8) / 8;
  const dissolve = Math.pow(Math.sin(cycle * Math.PI), 2);

  for (let i = 0; i < COUNT; i++) {
    const j = i * 3;
    const k = i * 4;

    const phase = randoms[k];
    const speed = randoms[k + 1];
    const direction = randoms[k + 2];
    const wobble = randoms[k + 3];

    const outward = dissolve * (2 + direction * 7);

    const tx =
      targets[j] +
      Math.cos(phase + t * speed) * outward;

    const ty =
      targets[j + 1] +
      Math.sin(phase * 1.3 + t * speed) * outward;

    const tz =
      targets[j + 2] +
      Math.sin(wobble + t * speed) * dissolve * 4;

    positions[j] += (tx - positions[j]) * 0.055;
    positions[j + 1] += (ty - positions[j + 1]) * 0.055;
    positions[j + 2] += (tz - positions[j + 2]) * 0.055;
  }

  heartGeometry.attributes.position.needsUpdate = true;

  const pulse = 1 + Math.sin(t * 2.4) * 0.035;
  heart.scale.set(pulse, pulse, pulse);
  heart.rotation.y = Math.sin(t * 0.4) * 0.1;
  heart.rotation.x = Math.sin(t * 0.3) * 0.04;

  heartMaterial.size = 0.12 + (Math.sin(t * 4) + 1) * 0.035;

  // Poeira flutuante
  const dustArray = dustGeometry.attributes.position.array;

  for (let i = 0; i < dustCount; i++) {
    const j = i * 3;
    const d = dustData[i];

    dustArray[j + 1] +=
      Math.sin(t * d.speed + d.phase) * 0.002;

    dustArray[j] +=
      Math.cos(t * d.speed + d.phase) * 0.001;

    if (dustArray[j] > 13) dustArray[j] = -13;
    if (dustArray[j] < -13) dustArray[j] = 13;
  }

  dustGeometry.attributes.position.needsUpdate = true;

  // Base de energia girando suavemente
  const baseArray = baseGeometry.attributes.position.array;

  for (let i = 0; i < baseCount; i++) {
    const j = i * 3;
    const d = baseData[i];
    const angle = d.angle + t * 0.16;

    const wave = Math.sin(t * 2 + d.phase) * 0.18;

    baseArray[j] = Math.cos(angle) * (d.radius + wave);
    baseArray[j + 1] = -10 + Math.sin(t * 3 + d.phase) * 0.12;
    baseArray[j + 2] = Math.sin(angle) * (d.radius + wave) * 0.55;
  }

  baseGeometry.attributes.position.needsUpdate = true;
  baseMaterial.opacity = 0.7 + (Math.sin(t * 3) + 1) * 0.15;

  // Partículas sobem da base em direção ao coração
  const streamArray = streamGeometry.attributes.position.array;

  for (let i = 0; i < streamCount; i++) {
    const j = i * 3;
    const d = streamData[i];

    const rise = (t * d.speed + d.phase) % d.height;
    const progress = rise / d.height;

    // As partículas começam espalhadas e se aproximam do centro
    const radius = d.radius * (1 - progress * 0.82);
    const angle = d.angle + Math.sin(t * 0.7 + d.phase) * 0.15;

    streamArray[j] = Math.cos(angle) * radius;
    streamArray[j + 1] = -9.5 + progress * 9.5;
    streamArray[j + 2] = Math.sin(angle) * radius * 0.5;
  }

  streamGeometry.attributes.position.needsUpdate = true;
  streamMaterial.opacity = 0.65 + (Math.sin(t * 4) + 1) * 0.15;

  // Núcleo pulsa junto da energia
  const corePulse = 0.8 + (Math.sin(t * 5) + 1) * 0.22;
  core.scale.setScalar(corePulse);
  core.material.opacity = 0.5 + (Math.sin(t * 5) + 1) * 0.2;

  renderer.render(scene, camera);
}

// Ajuste ao tamanho da tela
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

animate();
