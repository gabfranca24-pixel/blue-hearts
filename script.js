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
  ) / 40;
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
    margin: "0",
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
    font: `bold ${size}px Arial, sans-serif`,
    color,
    whiteSpace: "nowrap",
    opacity: "0",
    pointerEvents: "none",
    textShadow: `0 0 4px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`,
    zIndex: "2",
    willChange: "transform, opacity"
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

// Pontos distribuídos dentro do formato do coração.
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

// Cria pequenas estrelas luminosas ao redor do coração.
function createStars() {
  const count = 65;

  for (let i = 0; i < count; i++) {
    const element = document.createElement("span");

    const color = Math.random() < 0.65
      ? "#62caff"
      : "#b58aff";

    const angle = Math.random() * TAU;
    const distance = 125 + Math.random() * 145;
    const size = 1 + Math.random() * 3;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    Object.assign(element.style, {
      position: "fixed",
      left: "50%",
      top: "50%",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
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
      drift: 3 + Math.random() * 12
    });
  }
}

function buildHeart() {
  scale = getScale();

  const outlineCount = 110;
  const fillCount = 95;

  // 1. Contorno do coração.
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

  // 2. Preenchimento gradual.
  for (let i = 0; i < fillCount; i++) {
    const point = randomHeartPoint();

    createParticle(
      point.x * scale,
      point.y * scale,
      outlineCount * 0.04 + 0.5 + i * 0.015,
      Math.max(7, scale * 0.42)
    );
  }

  // 3. Texto central aparece por último.
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

function animate(now) {
  const elapsed = (now - startTime) / 1000;

  // Surgimento gradual e cintilação das palavras.
  for (const particle of particles) {
    const progress = Math.max(
      0,
      Math.min(1, (elapsed - particle.delay) / 0.3)
    );

    const flicker =
      0.88 +
      0.12 * Math.sin(
        elapsed * 3 + particle.phase
      );

    particle.element.style.opacity =
      String(progress * flicker);
  }

  // Pulsação suave do coração inteiro.
  const pulse =
    1 + 0.035 * Math.sin(elapsed * 2.4);

  for (const particle of particles) {
    particle.element.style.transform =
      `translate(-50%, -50%) translate(${particle.x * pulse}px, ${particle.y * pulse}px)`;
  }

  // O texto aparece depois da formação do coração.
  const centerProgress = Math.max(
    0,
    Math.min(1, (elapsed - 7.5) / 0.8)
  );

  const textPulse =
    1 + 0.045 * Math.sin(elapsed * 2.4);

  centerText.style.opacity =
    String(centerProgress);

  centerText.style.transform =
    `translate(-50%, -50%) scale(${textPulse})`;

  // Estrelas cintilando e flutuando.
  for (const star of stars) {
    const twinkle =
      0.2 +
      0.8 * (
        (Math.sin(
          elapsed * star.speed + star.phase
        ) + 1) / 2
      );

    const driftX =
      Math.sin(elapsed * 0.45 + star.phase) *
      star.drift;

    const driftY =
      Math.cos(elapsed * 0.35 + star.phase) *
      star.drift;

    star.element.style.opacity = String(twinkle);

    star.element.style.transform =
      `translate(-50%, -50%) translate(${star.x + driftX}px, ${star.y + driftY}px)`;
  }

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
      `${Math.max(7, scale * 0.46)}px`;
  }

  centerText.style.fontSize =
    `${Math.max(20, scale * 2)}px`;
}

function init() {
  document.querySelectorAll(
    ".heart-word, .heart-center"
  ).forEach(element => element.remove());

  particles.length = 0;
  stars.forEach(star => star.element.remove());
  stars.length = 0;

  buildHeart();
  createStars();

  window.addEventListener("resize", resizeHeart);

  startTime = performance.now();
  requestAnimationFrame(animate);
}

init();
