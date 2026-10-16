import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#heartCanvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 40,
  window.innerWidth / 40,
  window.innerHeight / 40,
  -window.innerHeight / 40,
  0.1,
  100
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const COLORS = ["#4682b4", "#1e90ff", "#00bfff", "#6495ed", "#4169e1"];
const WORDS = ["love you", "Love You", "LOVE YOU"];

const particles = [];
const totalOutline = 110;
const totalFill = 95;
const scale = Math.min(window.innerWidth, window.innerHeight) / 37;

function heartXY(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

function makeParticle(x, y, delay, size) {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  const element = document.createElement("span");
  element.textContent = word;
  element.style.position = "absolute";
  element.style.left = "0";
  element.style.top = "0";
  element.style.color = color;
  element.style.fontFamily = "Arial, sans-serif";
  element.style.fontWeight = "bold";
  element.style.fontSize = `${size}px`;
  element.style.whiteSpace = "nowrap";
  element.style.opacity = "0";
  element.style.transform = "translate(-50%, -50%)";
  element.style.textShadow =
    `0 0 4px ${color}, 0 0 10px ${color}, 0 0 22px ${color}`;
  element.style.pointerEvents = "none";

  document.body.appendChild(element);

  particles.push({
    element,
    x,
    y,
    delay,
    phase: Math.random() * Math.PI * 2,
    size
  });
}

function buildHeart() {
  const outlinePoints = [];

  for (let i = 0; i < totalOutline; i++) {
    const t = (i / totalOutline) * Math.PI * 2;
    const p = heartXY(t);
    outlinePoints.push(p);
  }

  // Contorno: as palavras aparecem uma após a outra.
  outlinePoints.forEach((p, i) => {
    makeParticle(
      p.x * scale,
      -p.y * scale,
      i * 5,
      Math.max(9, scale * 0.65)
    );
  });

  // Preenchimento: pontos distribuídos dentro do coração.
  for (let i = 0; i < totalFill; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.82;
    const p = heartXY(t);

    makeParticle(
      p.x * r * scale,
      -p.y * r * scale,
      totalOutline * 5 + 40 + i * 2,
      Math.max(8, scale * 0.48)
    );
  }
}

buildHeart();

const centerText = document.createElement("div");
centerText.textContent = "Love You";
centerText.style.position = "absolute";
centerText.style.left = "50%";
centerText.style.top = "50%";
centerText.style.transform = "translate(-50%, -50%)";
centerText.style.color = "#f5faff";
centerText.style.fontFamily = "Georgia, serif";
centerText.style.fontWeight = "bold";
centerText.style.fontSize = `${Math.max(20, scale * 2.2)}px`;
centerText.style.textShadow =
  "0 0 8px #1e90ff, 0 0 18px #1e90ff, 0 0 32px #6a5acd";
centerText.style.opacity = "0";
centerText.style.whiteSpace = "nowrap";
centerText.style.pointerEvents = "none";
document.body.appendChild(centerText);

const startTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const elapsed = (now - startTime) / 1000;

  for (const p of particles) {
    const age = elapsed * 60 - p.delay;
    const visible = Math.max(0, Math.min(1, age / 18));
    const flicker =
      0.82 + 0.18 * Math.sin(elapsed * 3 + p.phase);

    p.element.style.left =
      `${window.innerWidth / 2 + p.x}px`;
    p.element.style.top =
      `${window.innerHeight / 2 + p.y}px`;

    p.element.style.opacity = `${visible * flicker}`;
  }

  const centerStart = (totalOutline * 5 + 250) / 60;
  const centerFade = Math.max(
    0,
    Math.min(1, (elapsed - centerStart) * 1.5)
  );

  const pulse = 1 + 0.025 * Math.sin(elapsed * 3);
  centerText.style.opacity = `${centerFade}`;
  centerText.style.transform =
    `translate(-50%, -50%) scale(${pulse})`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#heartCanvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000000");

const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 40,
  window.innerWidth / 40,
  window.innerHeight / 40,
  -window.innerHeight / 40,
  0.1,
  100
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const COLORS = ["#4682b4", "#1e90ff", "#00bfff", "#6495ed", "#4169e1"];
const WORDS = ["love you", "Love You", "LOVE YOU"];

const particles = [];
const totalOutline = 110;
const totalFill = 95;
const scale = Math.min(window.innerWidth, window.innerHeight) / 37;

function heartXY(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

function makeParticle(x, y, delay, size) {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  const element = document.createElement("span");
  element.textContent = word;
  element.style.position = "absolute";
  element.style.left = "0";
  element.style.top = "0";
  element.style.color = color;
  element.style.fontFamily = "Arial, sans-serif";
  element.style.fontWeight = "bold";
  element.style.fontSize = `${size}px`;
  element.style.whiteSpace = "nowrap";
  element.style.opacity = "0";
  element.style.transform = "translate(-50%, -50%)";
  element.style.textShadow =
    `0 0 4px ${color}, 0 0 10px ${color}, 0 0 22px ${color}`;
  element.style.pointerEvents = "none";

  document.body.appendChild(element);

  particles.push({
    element,
    x,
    y,
    delay,
    phase: Math.random() * Math.PI * 2,
    size
  });
}

function buildHeart() {
  const outlinePoints = [];

  for (let i = 0; i < totalOutline; i++) {
    const t = (i / totalOutline) * Math.PI * 2;
    const p = heartXY(t);
    outlinePoints.push(p);
  }

  // Contorno: as palavras aparecem uma após a outra.
  outlinePoints.forEach((p, i) => {
    makeParticle(
      p.x * scale,
      -p.y * scale,
      i * 5,
      Math.max(9, scale * 0.65)
    );
  });

  // Preenchimento: pontos distribuídos dentro do coração.
  for (let i = 0; i < totalFill; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.82;
    const p = heartXY(t);

    makeParticle(
      p.x * r * scale,
      -p.y * r * scale,
      totalOutline * 5 + 40 + i * 2,
      Math.max(8, scale * 0.48)
    );
  }
}

buildHeart();

const centerText = document.createElement("div");
centerText.textContent = "Love You";
centerText.style.position = "absolute";
centerText.style.left = "50%";
centerText.style.top = "50%";
centerText.style.transform = "translate(-50%, -50%)";
centerText.style.color = "#f5faff";
centerText.style.fontFamily = "Georgia, serif";
centerText.style.fontWeight = "bold";
centerText.style.fontSize = `${Math.max(20, scale * 2.2)}px`;
centerText.style.textShadow =
  "0 0 8px #1e90ff, 0 0 18px #1e90ff, 0 0 32px #6a5acd";
centerText.style.opacity = "0";
centerText.style.whiteSpace = "nowrap";
centerText.style.pointerEvents = "none";
document.body.appendChild(centerText);

const startTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const elapsed = (now - startTime) / 1000;

  for (const p of particles) {
    const age = elapsed * 60 - p.delay;
    const visible = Math.max(0, Math.min(1, age / 18));
    const flicker =
      0.82 + 0.18 * Math.sin(elapsed * 3 + p.phase);

    p.element.style.left =
      `${window.innerWidth / 2 + p.x}px`;
    p.element.style.top =
      `${window.innerHeight / 2 + p.y}px`;

    p.element.style.opacity = `${visible * flicker}`;
  }

  const centerStart = (totalOutline * 5 + 250) / 60;
  const centerFade = Math.max(
    0,
    Math.min(1, (elapsed - centerStart) * 1.5)
  );

  const pulse = 1 + 0.025 * Math.sin(elapsed * 3);
  centerText.style.opacity = `${centerFade}`;
  centerText.style.transform =
    `translate(-50%, -50%) scale(${pulse})`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
