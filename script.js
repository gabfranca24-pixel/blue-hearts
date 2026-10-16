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

const COUNT = 10000;
const TAU = Math.PI * 2;

const positions = new Float32Array(COUNT * 3);
const targets = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const randoms = new Float32Array(COUNT * 4);

const blue = new THREE.Color("#168fff");
const cyan = new THREE.Color("#b8f5ff");
const purple = new THREE.Color("#a34dff");

// Formato do coração
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

// Criar as partículas do coração
for (let i = 0; i < COUNT; i++) {
  const t = Math.random() * TAU;
  const edge = heartPoint(t);
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

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

// Brilho das partículas do coração
const material = new THREE.PointsMaterial({
  size: 0.16,
  vertexColors: true,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
});

const heart = new THREE.Points(geometry, material);
scene.add(heart);

// Poeira cósmica ao redor
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
  opacity: 0.65,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// =====================================
// BASE DE ENERGIA ELÉTRICA
// =====================================

const baseCount = 3000;
const basePositions = new Float32Array(baseCount * 3);
const baseColors = new Float32Array(baseCount * 3);
const baseData = [];

for (let i = 0; i < baseCount; i++) {
  const angle = Math.random() * TAU;
  const radius = Math.random() * 6;

  basePositions[i * 3] = Math.cos(angle) * radius;
  basePositions[i * 3 + 1] = -9 + Math.random() * 1.5;
  basePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.6;

  const color = Math.random() < 0.65 ? blue : cyan;

  baseColors[i * 3] = color.r;
  baseColors[i * 3 + 1] = color.g;
  baseColors[i * 3 + 2] = color.b;

  baseData.push({
    angle,
    radius: 0.5 + Math.random() * 5.5,
    speed: 1 + Math.random() * 3,
    phase: Math.random() * TAU,
    height: 5 + Math.random() * 7
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
  size: 0.14,
  vertexColors: true,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true
});

const energyBase = new THREE.Points(baseGeometry, baseMaterial);
scene.add(energyBase);

// Relógio
const clock = new THREE.Clock();

// =====================================
// ANIMAÇÃO
// =====================================

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Ciclo de dispersão e reconstrução
  const cycle = (t % 8) / 8;
  const dissolve = Math.pow(Math.sin(cycle * Math.PI), 2);

  // Movimento das partículas do coração
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

    const shimmer = 0.035;

    const nx = Math.sin(t * speed + phase) * shimmer;
    const ny = Math.cos(t * speed + wobble) * shimmer;

    positions[j] += (tx + nx - positions[j]) * 0.055;
    positions[j + 1] +=
      (ty + ny - positions[j + 1]) * 0.055;
    positions[j + 2] += (tz - positions[j + 2]) * 0.055;
  }

  geometry.attributes.position.needsUpdate = true;

  // Pulsação do coração
  const pulse = 1 + Math.sin(t * 2.4) * 0.035;

  heart.scale.set(pulse, pulse, pulse);
  heart.rotation.y = Math.sin(t * 0.4) * 0.1;
  heart.rotation.x = Math.sin(t * 0.3) * 0.04;

  // Brilho pulsante
  const glowPulse =
    0.85 + (Math.sin(t * 4) + 1) * 0.35;

  material.size = 0.12 * glowPulse;
  material.opacity = Math.min(1, 0.72 + glowPulse * 0.2);

  // Movimento da poeira cósmica
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
  dust.rotation.y = t * 0.01;

  // Partículas de energia subindo da base
  const baseArray = baseGeometry.attributes.position.array;

  for (let i = 0; i < baseCount; i++) {
    const j = i * 3;
    const d = baseData[i];

    const rise = (t * d.speed + d.phase) % d.height;
    const spread = d.radius + Math.sin(rise * 0.7) * 0.5;

    baseArray[j] =
      Math.cos(d.angle + t * 0.25) * spread;

    baseArray[j + 1] = -9 + rise;

    baseArray[j + 2] =
      Math.sin(d.angle + t * 0.25) * spread * 0.6;
  }

  baseGeometry.attributes.position.needsUpdate = true;

  baseMaterial.opacity = 0.75 + Math.sin(t * 4) * 0.2;
  baseMaterial.size = 0.12 + Math.sin(t * 5) * 0.035;

  renderer.render(scene, camera);
}

// Ajustar à tela
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);

animate();
