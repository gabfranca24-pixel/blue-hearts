const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let hearts = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createHeart() {
  return {
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + Math.random() * 100,
    size: 8 + Math.random() * 15,
    speed: 0.3 + Math.random() * 0.8,
    drift: (Math.random() - 0.5) * 0.5,
    opacity: 0.3 + Math.random() * 0.6,
    rotation: (Math.random() - 0.5) * 0.5
  };
}

function drawHeart(heart) {
  ctx.save();
  ctx.translate(heart.x, heart.y);
  ctx.rotate(heart.rotation);
  ctx.globalAlpha = heart.opacity;
  ctx.fillStyle = "#d8b4fe";
  ctx.shadowColor = "#c084fc";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(0, heart.size * 0.3);
  ctx.bezierCurveTo(
    -heart.size, -heart.size * 0.3,
    -heart.size * 0.7, -heart.size,
    0, -heart.size * 0.4
  );
  ctx.bezierCurveTo(
    heart.size * 0.7, -heart.size,
    heart.size, -heart.size * 0.3,
    0, heart.size * 0.3
  );

  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (hearts.length < 45 && Math.random() < 0.08) {
    hearts.push(createHeart());
  }

  hearts.forEach((heart) => {
    heart.y -= heart.speed;
    heart.x += heart.drift;

    drawHeart(heart);
  });

  hearts = hearts.filter((heart) => heart.y > -40);

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();
