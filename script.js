const WORDS = ["love you", "Love You", "LOVE YOU"];

const COLORS = [
  "#4682b4",
  "#1e90ff",
  "#00bfff",
  "#6495ed",
  "#4169e1",
  "#8a2be2",
  "#9370db"
];

const particles = [];
const TAU = Math.PI * 2;

let scale = 1;
let startTime = 0;
let centerText;
let animationFrame;

function heartXY(t) {
  return {
    x: 16 * Math.sin(t) ** 3,
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

function getScale() {
  return Math.min(
    window.innerWidth,
    window.innerHeight
  ) / 37;
}

function createParticle(x, y, delay, size) {
  const element = document.createElement("span");

  const color =
    COLORS[Math.floor(Math.random() * COLORS.length)];

  element.className = "heart-word";
  element.textContent =
    WORDS[Math.floor(Math.random() * WORDS.length)];

  Object.assign(element.style, {
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
    font: `bold ${size}px Arial, sans-serif`,
    color,
    whiteSpace: "nowrap",
    opacity: "0",
    pointerEvents: "none",
    textShadow: `0 0 4px ${color}, 0 0 10px ${color}, 0 0 22px ${color}`,
    zIndex: "2"
  });

  document.body.appendChild(element);

  particles.push({
    element,
    x,
    y,
    delay,
    phase: Math.random() * TAU
  });
}

// Gera pontos distribuídos uniformemente no interior do coração.
function randomHeartPoint() {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * 32 - 16;
    const y = Math.random() * 30 - 15;

    // Testa se o ponto está dentro do formato do coração.
    const t = Math.atan2(y, x);
    const boundary = heartXY(t);

    // Usa a equação paramétrica para criar um limite radial.
    const angle = Math.atan2(y, x);
    const bx = 16 * Math.sin(angle) ** 3;
    const by =
      13 * Math.cos(angle) -
      5 * Math.cos(2 * angle) -
      2 * Math.cos(3 * angle) -
      Math.cos(4 * angle);

    const maxRadius = Math.hypot(bx, by);
    const radius = Math.hypot(x, y);

    if (
      maxRadius > 0 &&
      radius < maxRadius &&
      Math.abs(x) < 16 &&
      y < 14 &&
      y > -18
    ) {
      return { x, y };
    }
  }

  return { x: 0, y: 0 };
}

function buildHeart() {
  scale = getScale();

  const outlineCount = 110;
  const fillCount = 95;

  // 1. O contorno aparece primeiro.
  for (let i = 0; i < outlineCount; i++) {
    const point = heartXY(
      (i / outlineCount) * TAU
    );

    createParticle(
      point.x * scale,
      -point.y * scale,
      i * 0.04,
      Math.max(9, scale * 0.65)
    );
  }

  // 2. O interior começa a ser preenchido depois.
  for (let i = 0; i < fillCount; i++) {
    const point = randomHeartPoint();

    createParticle(
      point.x * scale,
      -point.y * scale,
      outlineCount * 0.04 + 0.5 + i * 0.015,
      Math.max(8, scale * 0.48)
    );
  }

  // 3. O texto central aparece por último.
  centerText = document.createElement("div");
  centerText.className = "heart-center";
  centerText.textContent = "Love You";

  Object.assign(centerText.style, {
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    font: `bold ${Math.max(20, scale * 2.2)}px Georgia, serif`,
    color: "#f5faff",
    whiteSpace: "nowrap",
    opacity: "0",
    textShadow:
      "0 0 8px #1e90ff, 0 0 18px #1e90ff, 0 0 32px #8a2be2",
    zIndex: "3",
    pointerEvents: "none"
  });

  document.body.appendChild(centerText);
}

function animate(now) {
  const elapsed = (now - startTime) / 1000;

  // Faz as palavras surgirem gradualmente e brilharem.
  for (const particle of particles) {
    const progress = Math.max(
      0,
      Math.min(1, (elapsed - particle.delay) / 0.3)
    );

    const flicker =
      0.84 +
      0.16 * Math.sin(
        elapsed * 3 + particle.phase
      );

    particle.element.style.opacity =
      String(progress * flicker);
  }

  // O texto central surge depois das partículas.
  const centerProgress = Math.max(
    0,
    Math.min(1, (elapsed - 7.5) / 0.8)
  );

  const pulse =
    1 + 0.025 * Math.sin(elapsed * 3);

  centerText.style.opacity =
    String(centerProgress);

  centerText.style.transform =
    `translate(-50%, -50%) scale(${pulse})`;

  animationFrame = requestAnimationFrame(animate);
}

function resizeHeart() {
  const newScale = getScale();
  const ratio = newScale / scale;

  scale = newScale;

  for (const particle of particles) {
    particle.x *= ratio;
    particle.y *= ratio;

    particle.element.style.transform =
      `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%)`;

    particle.element.style.fontSize =
      `${Math.max(8, scale * 0.55)}px`;
  }

  centerText.style.fontSize =
    `${Math.max(20, scale * 2.2)}px`;
}

function init() {
  // Evita duplicar partículas se a animação for reiniciada.
  document.querySelectorAll(
    ".heart-word, .heart-center"
  ).forEach(element => element.remove());

  particles.length = 0;

  buildHeart();

  window.addEventListener("resize", resizeHeart);

  startTime = performance.now();
  animationFrame = requestAnimationFrame(animate);
}

init();
