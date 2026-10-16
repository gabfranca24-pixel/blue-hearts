const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let time = 0;

const COUNT = 1800;
const TAU = Math.PI * 2;

function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t))
  };
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
}

function createParticles() {
  particles = [];

  const scale = Math.min(width / 38, height / 34) * 0.78;
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < COUNT; i++) {
    const t = Math.random() * TAU;
    const edge = heartPoint(t);

    // Concentra as partículas dentro do coração
    const fill = Math.sqrt(Math.random());

    const targetX = cx + edge.x * scale * fill;
    const targetY = cy + edge.y * scale * fill;

    particles.push({
      x: targetX,
      y: targetY,
      targetX,
      targetY,
      size: Math.random() < 0.12
        ? 1.8 + Math.random() * 1.2
        : 0.5 + Math.random() * 1.1,
      phase: Math.random() * TAU,
      speed: 0.8 + Math.random() * 2,
      blue: Math.random() > 0.42,
      drift: 0.5 + Math.random() * 1.5
    });
  }
}

function animate() {
  time += 0.016;

  // Mantém o fundo escuro e cria rastros suaves
  ctx.fillStyle = "rgba(3, 2, 14, 0.18)";
  ctx.fillRect(0, 0, width, height);

  const pulse = 1 + Math.sin(time * 2.2) * 0.045;

  // Dispersa e recompõe o coração lentamente
  const cycle = (Math.sin(time * 0.75) + 1) / 2;
  const dissolve = Math.pow(cycle, 5);
  const spread = dissolve * 65;

  for (const p of particles) {
    const wave = Math.sin(time * p.speed + p.phase);

    const tx = width / 2
      + (p.targetX - width / 2) * pulse;

    const ty = height / 2
      + (p.targetY - height / 2) * pulse;

    const x = tx
      + Math.cos(p.phase + time * p.drift) * spread;

    const y = ty
      + Math.sin(p.phase * 1.3 + time * p.drift) * spread;

    p.x += (x - p.x) * 0.12;
    p.y += (y - p.y) * 0.12;

    const alpha = 0.7 + (wave + 1) * 0.15;
    const color = p.blue
      ? `rgba(45, 165, 255, ${alpha})`
      : `rgba(183, 83, 255, ${alpha})`;

    // Halo externo
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = p.blue ? "#168fff" : "#a64dff";
    ctx.shadowBlur = 8 + (wave + 1) * 7;
    ctx.arc(p.x, p.y, p.size, 0, TAU);
    ctx.fill();

    // Núcleo branco-azulado para pontos de maior brilho
    if (p.size > 1.7) {
      ctx.beginPath();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(220, 240, 255, 0.95)";
      ctx.arc(p.x, p.y, 0.7, 0, TAU);
      ctx.fill();
    }
  }

  ctx.shadowBlur = 0;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
animate();
