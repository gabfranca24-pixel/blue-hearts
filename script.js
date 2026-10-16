const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Paleta em tons de roxo, lilás, magenta e azul brilhante inspirada no vídeo
const PURPLE_SHADES = [
  '#ff2a85', // Magenta vibrante
  '#b5179e', // Roxo magenta
  '#7209b7', // Roxo profundo
  '#480ca8', // Azul arroxeado escuro
  '#560bad', // Roxo elétrico
  '#4cc9f0', // Azul ciano de contraste
  '#f72585', // Rosa choque
  '#b5179e'  // Roxo
];

const particles = [];
const particleCount = 1400;

// Fórmula exata e fechada de coração 2D preenchido
function getHeartPoint(t, scale) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x * scale, y: y * scale };
}

class Particle {
  constructor() {
    this.init(true);
  }

  init(isFirst = false) {
    // Ângulo aleatório para preencher o contorno e o volume interno do coração
    this.t = Math.random() * Math.PI * 2;
    const scale = Math.min(width, height) / 35;
    
    const target = getHeartPoint(this.t, scale);
    
    // Posição de destino final no formato do coração
    this.destX = width / 2 + target.x + (Math.random() - 0.5) * 15;
    this.destY = height / 2 + target.y + (Math.random() - 0.5) * 15;

    if (isFirst) {
      // Inicia espalhado na tela para carregar pronto
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    } else {
      // Renascimento a partir do centro (efeito de explosão do vídeo)
      this.x = width / 2;
      this.y = height / 2 + 100; // Começa na base do coração
    }

    // Velocidade e comportamento dinâmico
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.8 + 0.2;
    this.life = 0;
    this.maxLife = Math.random() * 150 + 100; // Tempo de vida da partícula antes de reiniciar

    this.size = Math.random() * 2.2 + 0.5;
    this.color = PURPLE_SHADES[Math.floor(Math.random() * PURPLE_SHADES.length)];
  }

  update() {
    this.life++;
    
    // Efeito de transição suave em direção ao formato do coração
    let dx = this.destX - this.x;
    let dy = this.destY - this.y;
    
    this.x += dx * 0.05 + this.vx;
    this.y += dy * 0.05 + this.vy;

    // Reduz inércia com o tempo
    this.vx *= 0.92;
    this.vy *= 0.92;

    // Controle de opacidade (fade in / fade out)
    if (this.life < 30) {
      this.alpha = (this.life / 30) * this.maxAlpha;
    } else if (this.life > this.maxLife - 30) {
      this.alpha = ((this.maxLife - this.life) / 30) * this.maxAlpha;
    }

    // Reinicia a partícula para criar o fluxo contínuo do vídeo
    if (this.life >= this.maxLife) {
      this.init(false);
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Criar conjunto de partículas
for (let i = 0; i < particleCount; i++) {
  const p = new Particle();
  // Espalhar o ciclo de vida inicial para não nascerem todas juntas
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animate() {
  // Fundo com rastro escuro suave para criar o efeito de luz mágica
  ctx.fillStyle = 'rgba(5, 2, 10, 0.25)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();
