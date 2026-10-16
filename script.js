const WORDS = ["love you", "Love You", "LOVE YOU"];
const COLORS = ["#4682b4", "#1e90ff", "#00bfff", "#6495ed", "#4169e1"];

const particles = [];
const TAU = Math.PI * 2;

let scale;
let startTime;
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
  return Math.min(window.innerWidth, window.innerHeight) / 37;
}

function createParticle(x, y, delay, size) {
  const element = document.createElement("span");
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  element.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];
  element.style.position = "fixed";
  element.style.left = "50%";
  element.style.top = "50%";
  element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  element.style.font = `bold ${size}px Arial, sans-serif`;
  element.style.color = color;
  element.style.whiteSpace = "nowrap";
  element.style.opacity = "0";
  element.style.pointerEvents = "none";
  element.style.textShadow =
    `0 0 4px ${color}, 0 0 10px ${color}, 0 0 22px ${color}`;
  element.style.zIndex = "2";

  document.body.appendChild(element);

  particles.push({
    element,
    x,
    y,
    delay,
    phase: Math.random() * TAU
  });
}

function buildHeart() {
  scale = getScale();

  const outlineCount = 110;
  const fillCount = 95;

  // Contorno do coração
  for (let i = 0; i < outlineCount; i++) {
    const point = heartXY((i / outlineCount) * TAU);

    createParticle(
      point.x * scale,
      -point.y * scale,
      i * 0.04,
      Math.max(9, scale * 0.65)
    );
  }

  // Palavras preenchendo o interior
  for (let i = 0; i < fillCount; i++) {
    const point = heartXY(Math.random() * TAU);
    const radius = Math.sqrt(Math.random()) * 0.82;

    createParticle(
      point.x * radius * scale,
      -point.y * radius * scale,
      outlineCount * 0.04 + 0.5 + i * 0.015,
      Math.max(8, scale * 0.48)
    );
  }

  // Texto central
  centerText = document.createElement("div");
  centerText.textContent = "Love You";
  centerText.style.position = "fixed";
  centerText.style.left = "50%";
  centerText.style.top = "50%";
  centerText.style.transform = "translate(-50%, -50%)";
  centerText.style.font = `bold ${Math.max(20, scale * 2.2)}px Georgia, serif`;
  centerText.style.color = "#f5faff";
  centerText.style.whiteSpace = "nowrap";
  centerText.style.textShadow =
    "0 0 8px #1e90ff, 0 0 18px #1e90ff, 0 0 32px #6a5acd";
  centerText.style.opacity = "0";
  centerText.style.zIndex = "3";
  centerText.style.pointerEvents = "none";

  document.body.appendChild(centerText);
}

function animate(now) {
  const elapsed = (now - startTime) / 1000;

  for (const particle of particles) {
    const progress = Math.max(
      0,
      Math.min(1, (elapsed - particle.delay) / 0.3)
    );

    const flicker =
      0.84 + 0.16 * Math.sin(elapsed * 3 + particle.phase);

    particle.element.style.opacity = String(progress * flicker);
  }

  const centerStart = 7.5;
  const centerProgress = Math.max(
    0,
    Math.min(1, (elapsed - centerStart) / 0.8)
  );

  const pulse = 1 + 0.025 * Math.sin(elapsed * 3);

  centerText.style.opacity = String(centerProgress);
  centerText.style.transform =
    `translate(-50%, -50%) scale(${pulse})`;

  requestAnimationFrame(animate);
}

function init() {
  // Remove any old elements if initialization is repeated
  document.querySelectorAll(".heart-word, .heart-center").forEach(el => el.remove());

  // Mark generated elements so they can be identified if needed
  buildHeart();

  // Keep the animation centered when the screen changes
  window.addEventListener("resize", () => {
    const newScale = getScale();
    const ratio = newScale / scale;
    scale = newScale;

    for (const particle of particles) {
      particle.x *= ratio;
      particle.y *= ratio;
      particle.element.style.transform =
        `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%)`;
    }

    centerText.style.fontSize = `${Math.max(20, scale * 2.2)}px`;
  });

  startTime = performance.now();
  requestAnimationFrame(animate);
}

init();
