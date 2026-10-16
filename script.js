const WORDS = ["i love you", "I love you", "I LOVE YOU"];

const COLORS = [
  "#4682b4",
  "#1e90ff",
  "#00bfff",
  "#6495ed",
  "#4169e1",
  "#8a2be2",
  "#9370db",
  "#ba55d3"
];

const particles = [];
const TAU = Math.PI * 2;

let scale = 1;
let startTime = 0;
let centerText;

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
    color: color,
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

function randomHeartPoint() {
  // Distribui os pontos dentro do formato do coração.
  while (true) {
    const x = Math.random() * 32 - 16;
    const y = Math.random() * 30 - 15;

    const equation =
      (x * x + y * y - 1) ** 3 -
      x * x * y ** 3;

    if (equation <= 0) {
      return { x: x * 16, y: y * 16 };
    }
  }
}

function buildHeart() {
  scale = getScale();

  const outlineCount = 110;
  const fillCount = 95;

  // 1. Forma o contorno do coração.
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

  // 2. Preenche o interior gradualmente.
  for (let i = 0; i < fillCount; i++) {
    const point = randomHeartPoint();

    createParticle(
      point.x * scale,
      -point.y * scale,
      outlineCount * 0.04 + 0.5 + i * 0.015,
      Math.max(8, scale * 0.48)
    );
  }

  // 3. Texto central: aparece por último.
  centerText = document.createElement("div");
  centerText.className = "heart-center";
  centerText.textContent = "I Love You";

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

  // Brilho gradual das palavras.
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

  // Pulsação contínua do coração inteiro.
  const heartPulse =
    1 + 0.035 * Math.sin(elapsed * 2.4);

  for (const particle of particles) {
    particle.element.style.transform =
      `translate(${particle.x * heartPulse}px, ${particle.y * heartPulse}px) translate(-50%, -50%) scale(${heartPulse})`;
  }

  // O texto central aparece depois da formação.
  const centerProgress = Math.max(
    0,
    Math.min(1, (elapsed - 7.5) / 0.8)
  );

  const textPulse =
    1 + 0.06 * Math.sin(elapsed * 2.4);

  centerText.style.opacity =
    String(centerProgress);

  centerText.style.transform =
    `translate(-50%, -50%) scale(${textPulse})`;

  requestAnimationFrame(animate);
}

function resizeHeart() {
  const newScale = getScale();
  const ratio = newScale / scale;

  scale = newScale;

  for (const particle of particles) {
    particle.x *= ratio;
    particle.y *= ratio;

    particle.element.style.fontSize =
      `${Math.max(8, scale * 0.55)}px`;
  }

  centerText.style.fontSize =
    `${Math.max(20, scale * 2.2)}px`;
}

function init() {
  document.querySelectorAll(
    ".heart-word, .heart-center"
  ).forEach(element => element.remove());

  particles.length = 0;

  buildHeart();

  window.addEventListener("resize", resizeHeart);

  startTime = performance.now();
  requestAnimationFrame(animate);
}

init();
