const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Paleta de cores em tons de roxo, lilás, magenta e azul cósmico
const PURPLE_SHADES = [
  '#ff2a85', // Magenta vibrante
  '#d90368', // Rosa escuro profundo
  '#9d4edd', // Roxo vivo
  '#7b2cbf', // Roxo médio
  '#5a189a', // Roxo escuro
  '#e0aaff', // Lilás claro brilhante
  '#c77dff'  // Lilás suave
];

const particles = [];
const particleCount = 1200; // Quantidade densa de partículas para formar o volume

// Equação paramétrica 3D do coração projetada em 2D
function getHeartPosition(t, scale) {
  // Equações clássicas do coração
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  
  return {
    x: x * scale,
    y: y * scale
  };
}

class Particle {
  constructor() {
    this.reset(true);
  }

    reset(initial = false) {
    // Ângulo aleatório ao longo da curva do coração (0 a 2*PI)
    this.t = Math.random() * Math.PI * 2;
    
    // Escala base do coração responsiva ao tamanho da tela
    const baseScale = Math.min(width, height) / 38;
    this.baseScale = baseScale;

    const targetPos = getHeartPosition(this.t, baseScale);
    
    // Criando volume tridimensional com dispersão interna
    this.ox = targetPos.x + (Math.random() - 0.5) * 40;
    this.oy = targetPos.y + (Math.random() - 0.5) * 40;
    
    if (initial) {
      this.x = width / 2 + this.ox;
      this.y = height / 2 + this.oy;
    } else {
      // Começam dispersas do centro para o efeito de formação
      this.x = width / 2 + (Math.random() - 0.5) * 10;
      this.y = height / 2 + (Math.random() - 0.5) * 10;
    }

    this.destX = width / 2 + this.ox;
    this.destY = height / 2 + this.oy;

    this.speed = 0.02 + Math.random() * 0.03;
    this.size = Math.random() * 2.5 + 0.8;
    this.color = PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)];
    
    // Propriedades de brilho e pulsação
    this.alpha = Math.random() * 0.7 + 0.3;
    this.pulseSpeed = 0.03 + Math.random() * 0.04;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  update() {
    // Movimento suave em direção à forma do coração (Lerp)
    this.x += (this.destX - this.x) * this.speed;
    this.y += (this.destY - this.y) * this.speed;

    // Efeito de pulsação luminosa
    this.pulseAngle += this.pulseSpeed;
    this.currentSize = this.size + Math.sin(this.pulseAngle) * 0.6;
    if (this.currentSize < 0.2) this.currentSize = 0.2;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulseAngle) * 0.3);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color; // Brilho intenso (glow) nas partículas

    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.currentSize), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Inicializar partículas
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

let time = 0;

function animate() {
  // Limpar tela com leve rastro para efeito mágico
  ctx.fillStyle = 'rgba(5, 2, 10, 0.2)';
  ctx.fillRect(0, 0, width, height);

  time += 0.03;
  const globalPulse = 1 + Math.sin(time * 1.5) * 0.04; // Pulsação global do coração

  const baseScale = Math.min(width, height) / 38;

  particles.forEach(p => {
    // Recalcular posições com a pulsação global para o coração "respirar"
    const targetPos = getHeartPosition(p.t, baseScale * globalPulse);
    p.destX = width / 2 + targetPos.x + (Math.sin(time + p.t) * 5);
    p.destY = height / 2 + targetPos.y + (Math.cos(time + p.t) * 5);

    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();
