/**
 * Crônica de Aethelgard - Motor de Efeitos Visuais e Impacto no Combate (combat_vfx.js)
 * Renderiza explosões arcanas, feixes elementais, tremores de tela e partículas de impacto no combate tático.
 */

class CombatVFX {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
  }

  initCanvas() {
    const canvas = document.getElementById("combat-vfx-canvas");
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    const resize = () => {
      this.canvas.width = window.innerWidth || 800;
      this.canvas.height = window.innerHeight || 600;
    };
    resize();
    if (typeof window.addEventListener === "function") {
      window.addEventListener("resize", resize);
    }
  }

  triggerScreenShake(type = "heavy") {
    const enemyDisplay = document.querySelector(".enemy-display");
    if (!enemyDisplay) return;

    enemyDisplay.classList.remove("shake-heavy", "shake-crit");
    void enemyDisplay.offsetWidth; // Força reflow do DOM

    if (type === "crit") {
      enemyDisplay.classList.add("shake-crit");
    } else {
      enemyDisplay.classList.add("shake-heavy");
    }

    setTimeout(() => {
      enemyDisplay.classList.remove("shake-heavy", "shake-crit");
    }, 600);
  }

  spawnSpellVFX(spellElement = "Fogo", startX = 300, startY = 500, targetX = 600, targetY = 300) {
    if (!this.ctx) this.initCanvas();
    if (!this.ctx) return;

    let colorPool = ["#facc15", "#ea580c", "#dc2626"];
    if (spellElement === "Água") colorPool = ["#38bdf8", "#0284c7", "#e0f2fe"];
    else if (spellElement === "Ar" || spellElement === "Eletricidade") colorPool = ["#7dd3fc", "#38bdf8", "#ffffff"];
    else if (spellElement === "Sombras") colorPool = ["#7c3aed", "#4c1d95", "#09090b"];
    else if (spellElement === "Luz") colorPool = ["#fef08a", "#facc15", "#ffffff"];
    else if (spellElement === "Natureza") colorPool = ["#34d399", "#10b981", "#064e3b"];

    // Disparar feixe ou explosão de partículas
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: targetX + (Math.random() - 0.5) * 40,
        y: targetY + (Math.random() - 0.5) * 40,
        size: Math.random() * 8 + 3,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1.5,
        color: colorPool[Math.floor(Math.random() * colorPool.length)],
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02
      });
    }

    if (!this.animationId) {
      this.renderLoop();
    }
  }

  renderLoop() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      if (typeof requestAnimationFrame === "function") {
        this.animationId = requestAnimationFrame(() => this.renderLoop());
      } else if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        this.animationId = window.requestAnimationFrame(() => this.renderLoop());
      } else {
        this.animationId = setTimeout(() => this.renderLoop(), 16);
      }
    } else {
      this.animationId = null;
      if (this.ctx && this.canvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

window.combatVFX = new CombatVFX();
