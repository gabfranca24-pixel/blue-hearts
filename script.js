const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let time = 0;

const COUNT = 850;
const TAU = Math.PI * 2;

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

function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  };
}

function createParticles() {
  particles = [];

  const scale = Math.min(width / 38, height / 34) * 0.85;
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < COUNT; i++) {
    const t = Math.random() * TAU;
    const edge = heartPoint(t);
    const fill = Math.sqrt(Math.random());

    const targetX = cx + edge.x * scale * fill;
    const targetY = cy + edge.y * scale * fill;

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX,
      targetY,
      size: 0.5 + Math.random() * 1.8,
      phase: Math.random() * TAU,
      speed: 0.5 + Math.random() * 1.5,
      blue: Math.random()
    });
  }
}

function animate() {
  time += 0.016;

  ctx.fillStyle = "rgba(5, 4, 18, 0.22)";
  ctx.fillRect(0, 0, width, height);

  const pulse = 1 + Math.sin(time * 2) * 0.035;
  const dissolve = (Math.sin(time * 0.65) + 1) / 2;
  const spread = dissolve * 42;

  for (const p of particles) {
    const wave = Math.sin(time * p.speed + p.phase);

    const tx = width / 2 + (p.targetX - width / 2) * pulse;
    const ty = height / 2 + (p.targetY - height / 2) * pulse;

    const driftX = Math.cos(p.phase + time) * spread;
    const driftY = Math.sin(p.phase * 1.4 + time) * spread;

    const x = tx + driftX;
    const y = ty + driftY;

    p.x += (x - p.x) * 0.055;
    p.y += (y - p.y) * 0.055;

    const glow = 0.55 + wave * 0.35;
    const color = p.blue > 0.5
      ? `rgba(60, 170, 255, ${glow})`
      : `rgba(185, 90, 255, ${glow})`;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = p.blue > 0.5 ? "#168cff" : "#a020f0";
    ctx.shadowBlur = 5 + wave * 5;
    ctx.arc(p.x, p.y, p.size, 0, TAU);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
animate();
