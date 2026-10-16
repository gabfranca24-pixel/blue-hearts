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
const stars = [];
const magicParticles = [];
const TAU = Math.PI * 2;

let scale = 1;
let startTime = 0;
let centerText;
let animationFrame = null;

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
  ) / 40;
}

// Cria cada palavra luminosa do coração.
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
    margin: "0",
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
    font: `bold ${size}px Arial, sans-serif`,
    color,
    whiteSpace: "nowrap",
    opacity: "0",
    pointerEvents: "none",
    textShadow: `0 0 5px ${color}, 0 0 12px ${color}, 0 0 22px ${color}`,
    zIndex: "2",
    willChange: "transform, opacity"
  });

  document.body.appendChild(element);

  particles.push({
    element,
    x,
    y,
    delay,
    size,
    phase: Math.random() * TAU
  });
}

// Sorteia pontos dentro do formato de coração.
function randomHeartPoint() {
  while (true) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;

    const equation =
      (x * x + y * y - 1) ** 3 -
      x * x * y ** 3;

    if (equation <= 0) {
      return {
        x: x * 16,
        y: -y * 16
      };
    }
  }
}

// Cria estrelinhas ao redor do coração.
function createStars() {
  const count = 65;

  for (let i = 0; i < count; i++) {
    const element = document.createElement("span");

    const color = Math.random() < 0.65
      ? "#62caff"
      : "#b58aff";

    const angle = Math.random() * TAU;
    const distance = (17 + Math.random() * 7) * scale;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    const size = 1 + Math.random() * 2.5;

    Object.assign(element.style, {
      position: "fixed",
      left: "50%",
      top: "50%",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 7}px ${color}`,
      pointerEvents: "none",
      zIndex: "1",
      opacity: "0",
      willChange: "transform, opacity"
    });

    document.body.appendChild(element);

    stars.push({
      element,
      x,
      y,
      phase: Math.random() * TAU,
      speed: 0.5 + Math.random() * 1.2,
      drift: 3 + Math.random() * 9
    });
  }
}

// Cria poeira estelar azul e roxa.
function createMagicParticles() {
  const colors = [
    "#00bfff",
    "#4682ff",
    "#9370db",
    "#ba55d3",
    "#c8f0ff"
  ];

  for (let i = 0; i < 45; i++) {
    const element = document.createElement("span");

    const size = 2 + Math.random() * 3;
    const color =
      colors[Math.floor(Math.random() * colors.length)];

    Object.assign(element.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 5}px ${color}`,
      pointerEvents: "none",
      zIndex: "1",
      opacity: "0",
      willChange: "transform, opacity"
    });

    document.body.appendChild(element);

    magicParticles.push({
      element,
      size,
      seed: Math.random() * TAU,
      speed: 0.5 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 100,
      phase: Math.random(),
      startX: (Math.random() - 0.5) * 34,
      startY: (Math.random() - 0.5) * 26
    });
  }
}

// Forma o coração e o texto central.
function buildHeart() {
  scale = getScale();

  const outlineCount = 110;
  const fillCount = 95;

  // 1. Contorno: as palavras surgem gradualmente.
  for (let i = 0; i < outlineCount; i++) {
    const point = heartXY(
      (i / outlineCount) * TAU
    );

    createParticle(
      point.x * scale,
      -point.y * scale,
      i * 0.04,
      Math.max(8, scale * 0.52)
    );
  }

  // 2. Preenchimento do coração.
  for (let i = 0; i < fillCount; i++) {
    const point = randomHeartPoint();

    createParticle(
      point.x * scale,
      point.y * scale,
      outlineCount * 0.04 + 0.5 + i * 0.015,
      Math.max(7, scale * 0.42)
    );
  }

  // 3. Texto central.
  centerText = document.createElement("div");
  centerText.className = "heart-center";
  centerText.textContent = "I Love You";

  Object.assign(centerText.style, {
    position: "fixed",
    left: "50%",
    top: "50%",
    margin: "0",
    transform: "translate(-50%, -50%)",
    font: `bold ${Math.max(20, scale * 2)}px Georgia, serif`,
    color: "#ffffff",
    whiteSpace: "nowrap",
    opacity: "0",
    textAlign: "center",
    textShadow:
      "0 0 8px #1e90ff, 0 0 18px #00bfff, 0 0 32px #8a2be2",
    zIndex: "3",
    pointerEvents: "none",
    willChange: "transform, opacity"
  });

  document.body.appendChild(centerText);
}

// Anima as partículas mágicas que flutuam para cima.
function animateMagicParticles(elapsed) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (const p of magicParticles) {
    const cycle =
      (elapsed * p.speed * 0.22 + p.phase) % 1;

    // Partículas surgem ao redor do coração e sobem.
    const x =
      centerX +
      p.startX * scale +
      Math.sin(elapsed * 0.8 + p.seed) * 22 +
      p.drift * cycle;

    const y =
      centerY +
      p.startY * scale +
      100 -
      cycle * (180 + p.speed * 45);

    // Surgem e desaparecem suavemente.
    const opacity =
      Math.sin(cycle * Math.PI) * 0.85;

    p.element.style.transform =
      `translate(${x}px, ${y}px)`;

    p.element.style.opacity = String(opacity);
  }
}

function animate(now) {
  const elapsed = (now - startTime) / 1000;

  // Surgimento e cintilação das palavras.
  for (const particle of particles) {
    const progress = Math.max(
      0,
      Math.min(1, (elapsed - particle.delay) / 0.3)
    );

    const flicker =
      0.88 +
      0.12 * Math.sin(elapsed * 3 + particle.phase);

    particle.element.style.opacity =
      String(progress * flicker);
  }

  // Pulsação contínua do coração.
  const pulse =
    1 + 0.035 * Math.sin(elapsed * 2.4);

  for (const particle of particles) {
    particle.element.style.transform =
      `translate(-50%, -50%) translate(${particle.x * pulse}px, ${particle.y * pulse}px)`;
  }

  // O texto aparece após a formação do coração.
  const centerProgress = Math.max(
    0,
    Math.min(1, (elapsed - 7.5) / 0.8)
  );

  const textPulse =
    1 + 0.045 * Math.sin(elapsed * 2.4);

  centerText.style.opacity = String(centerProgress);

  centerText.style.transform =
    `translate(-50%, -50%) scale(${textPulse})`;

  // Estrelinhas cintilantes.
  for (const star of stars) {
    const twinkle =
      0.2 +
      0.8 * (
        (Math.sin(elapsed * star.speed + star.phase) + 1) / 2
      );

    const driftX =
      Math.sin(elapsed * 0.45 + star.phase) * star.drift;

    const driftY =
      Math.cos(elapsed * 0.35 + star.phase) * star.drift;

    star.element.style.opacity = String(twinkle);

    star.element.style.transform =
      `translate(-50%, -50%) translate(${star.x + driftX}px, ${star.y + driftY}px)`;
  }

  // Poeira estelar flutuando.
  animateMagicParticles(elapsed);

  animationFrame = requestAnimationFrame(animate);
}

// Ajusta o desenho ao redimensionar a tela.
function resizeHeart() {
  const newScale = getScale();
  const ratio = newScale / scale;

  scale = newScale;

  for (const particle of particles) {
    particle.x *= ratio;
    particle.y *= ratio;
    particle.element.style.fontSize =
      `${Math.max(7, particle.size * ratio)}px`;
  }

  for (const star of stars) {
    star.x *= ratio;
    star.y *= ratio;
  }

  for (const p of magicParticles) {
    p.startX *= ratio;
    p.startY *= ratio;
  }

  centerText.style.fontSize =
    `${Math.max(20, scale * 2)}px`;
}

function init() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }

  document.querySelectorAll(
    ".heart-word, .heart-center"
  ).forEach(element => element.remove());

  particles.length = 0;

  stars.forEach(star => star.element.remove());
  stars.length = 0;

  magicParticles.forEach(p => p.element.remove());
  magicParticles.length = 0;

  buildHeart();
  createStars();
  createMagicParticles();

  window.addEventListener("resize", resizeHeart);

  startTime = performance.now();
  animationFrame = requestAnimationFrame(animate);
}

init();
