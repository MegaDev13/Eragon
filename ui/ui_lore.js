/**
 * Crônica de Aethelgard - Bestiário, Enciclopédia, Conquistas e Efeitos de Partículas (ui_lore.js)
 * Adiciona lore ricamente ilustrado, conquistas desbloqueáveis e motor atmosférico em Canvas 2D.
 */

class LoreManager {
  constructor() {
    this.achievements = [
      { id: "ach_first_steps", title: "O Despertar nas Cinzas", desc: "Inicie sua jornada no mundo de Aethelgard.", unlocked: true },
      { id: "ach_dragon_rider", title: "O Primeiro Voo", desc: "Atrinja 40% de vínculo com seu dragão e voe pelos céus.", unlocked: false },
      { id: "ach_gold_baron", title: "A Balança de Ouro", desc: "Acumule mais de 1000 moedas de ouro no cofre de inventário.", unlocked: false },
      { id: "ach_master_mage", title: "Mestre das Escolas Arcanas", desc: "Aprenda pelo menos 6 feitiços arcanos no Livro de Magias.", unlocked: false },
      { id: "ach_crown_breaker", title: "A Queda da Coroa", desc: "Derrube ou proteja o Palácio de Eldor durante a revolta armada.", unlocked: false },
      { id: "ach_khaz_explorer", title: "O Segredo do Obelisco", desc: "Desvende os mistérios rúnicos das ruínas de Aethel-Khaz.", unlocked: false }
    ];

    this.particleCtx = null;
    this.particles = [];
    this.particleMode = "embers"; // embers, fog, leaves, rain, snow
    this.particleTimer = null;
  }

  initAtmosphereCanvas() {
    const canvas = document.getElementById("atmosphere-particles");
    if (!canvas) return;
    this.particleCtx = canvas.getContext("2d");
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    this.spawnParticles(50);
    if (!this.particleTimer) {
      const loop = () => {
        this.updateAndRenderParticles();
        if (typeof requestAnimationFrame === "function") {
          this.particleTimer = requestAnimationFrame(loop);
        } else if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
          this.particleTimer = window.requestAnimationFrame(loop);
        } else {
          this.particleTimer = setTimeout(loop, 16);
        }
      };
      loop();
    }
  }

  setAtmosphereMode(mode = "embers") {
    if (this.particleMode !== mode) {
      this.particleMode = mode;
      this.particles = [];
      this.spawnParticles(mode === "fog" ? 20 : 55);
    }
  }

  spawnParticles(count) {
    if (!this.particleCtx) return;
    const canvas = this.particleCtx.canvas;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (this.particleMode === "fog" ? 180 : 3.5) + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: this.particleMode === "rain" ? Math.random() * 8 + 6 : (this.particleMode === "snow" ? Math.random() * 2 + 1 : (Math.random() - 0.8) * 0.8),
        opacity: Math.random() * 0.6 + 0.1,
        hue: this.particleMode === "embers" ? Math.floor(Math.random() * 30 + 20) : (this.particleMode === "leaves" ? 140 : 210)
      });
    }
  }

  updateAndRenderParticles() {
    if (!this.particleCtx) return;
    const ctx = this.particleCtx;
    const canvas = ctx.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.save();
      ctx.globalAlpha = p.opacity;

      if (this.particleMode === "embers") {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, "rgba(255, 200, 50, 1)");
        grad.addColorStop(0.4, "rgba(245, 120, 20, 0.8)");
        grad.addColorStop(1, "rgba(234, 88, 12, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.particleMode === "fog") {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, "rgba(148, 163, 184, 0.15)");
        grad.addColorStop(1, "rgba(148, 163, 184, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.particleMode === "rain") {
        ctx.strokeStyle = "rgba(186, 230, 253, 0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.size * 5);
        ctx.stroke();
      } else if (this.particleMode === "snow") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  checkAchievementUnlocks() {
    if (!window.dragonManager || !window.inventoryManager) return;
    
    if (window.dragonManager.bond >= 40 && !this.achievements[1].unlocked) {
      this.achievements[1].unlocked = true;
      if (window.ui) window.ui.showModalAlert("🏆 CONQUISTA DESBLOQUEADA: O PRIMEIRO VOO", "<p>Seu vínculo com o dragão permitiu o voo aéreo em Aethelgard!</p>", "Glória!");
    }
    if (window.inventoryManager.gold >= 1000 && !this.achievements[2].unlocked) {
      this.achievements[2].unlocked = true;
      if (window.ui) window.ui.showToast("🏆 Conquista: A Balança de Ouro Desbloqueada!", "gold");
    }
    if (window.magicManager && window.magicManager.learnedSpells.length >= 6 && !this.achievements[3].unlocked) {
      this.achievements[3].unlocked = true;
      if (window.ui) window.ui.showToast("🏆 Conquista: Mestre das Escolas Arcanas Desbloqueada!", "info");
    }
  }

  renderLoreTab() {
    const container = document.getElementById("lore-container");
    if (!container) return;

    this.checkAchievementUnlocks();

    const selectedMyth = this.activeMythologyFilter || "all";
    const creaturesList = window.bestiaryManager ? window.bestiaryManager.getCreaturesByMythology(selectedMyth) : [];
    const mythologiesList = window.bestiaryManager ? window.bestiaryManager.getAllMythologies() : [];

    let html = `
      <div class="lore-layout">
        <div class="lore-subnav mb-4">
          <button class="action-btn primary small" onclick="window.loreManager.switchSubSection('bestiary')">🐉 Bestiário</button>
          <button class="action-btn small" onclick="window.loreManager.switchSubSection('encyclopedia')">📖 Enciclopédia do Mundo</button>
          <button class="action-btn small" onclick="window.loreManager.switchSubSection('chronicle')">📜 Livro das Crônicas</button>
          <button class="action-btn small" onclick="window.loreManager.switchSubSection('achievements')">🏆 Conquistas e Medalhas</button>
        </div>

        <div id="lore-bestiary" class="lore-subview active">
          <div class="ornate-card panel-header-ornate">
            <h3>🐉 Bestiário Mitológico de Aethelgard (${creaturesList.length} Criaturas)</h3>
            <p>Conheça os monstros legendários das maiores mitologias do mundo, adaptados para o ecossistema e combate de Aethelgard.</p>
            
            <div class="myth-filters-bar mt-3" style="display:flex; gap:6px; flex-wrap:wrap; overflow-x:auto; padding-bottom:6px;">
              <button class="action-btn small ${selectedMyth === 'all' ? 'primary' : 'secondary'}" onclick="window.loreManager.activeMythologyFilter = 'all'; window.audioManager?.play('click'); window.loreManager.renderLoreTab();">
                ✨ Todas as Mitologias (${window.bestiaryManager?.creatures.length || 38})
              </button>
              ${mythologiesList.map(m => `
                <button class="action-btn small ${selectedMyth === m.id ? 'primary' : 'secondary'}" onclick="window.loreManager.activeMythologyFilter = '${m.id}'; window.audioManager?.play('click'); window.loreManager.renderLoreTab();">
                  ${m.name.split(' ')[0]} ${m.name.split(' (')[0].replace(m.name.split(' ')[0], '').trim()}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="lore-cards-grid mt-3">
            ${creaturesList.map(b => {
              const mythObj = mythologiesList.find(m => m.id === b.mythology);
              return `
                <div class="ornate-card bestiary-card">
                  <div class="card-corner-tl"></div><div class="card-corner-tr"></div>
                  <div class="bestiary-img-box mb-2" style="height:170px; border-radius:6px; overflow:hidden; border:1px solid var(--border-color);">
                    <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl('assets/creatures/' + b.id + '.jpg') : ('assets/creatures/' + b.id + '.jpg')}" data-orig-src="assets/creatures/${b.id}.jpg" onerror="window.handleImageError(this, 'creature')" alt="${b.name}" style="width:100%; height:100%; object-fit:cover;"/>
                  </div>
                  <div class="card-top">
                    <h4>${b.name}</h4>
                    <span class="badge danger-level">${b.hp || b.maxHp} HP</span>
                  </div>
                  <small style="color:#fbbf24; font-weight:bold; display:block;" class="mt-1">${mythObj ? mythObj.name : 'Mitologia Ancestral'}</small>
                  <p class="lore-text mt-2" style="font-size:13px;">${b.desc}</p>
                  <div class="card-corner-bl"></div><div class="card-corner-br"></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div id="lore-encyclopedia" class="lore-subview" style="display: none;">
          <div class="panel-header-ornate">
            <h3>📖 Enciclopédia Geopolítica e História das Cinzas</h3>
            <p>Os segredos que antecederam a Grande Ruptura e a formação dos quatro reinos.</p>
          </div>
          <div class="lore-cards-grid mt-3">
            <div class="ornate-card">
              <h4>A Era das Cinzas (Ano 1 a 1042)</h4>
              <p class="lore-text">Há mil anos, a destruição dos obeliscos celestiais de Aethel-Khaz liberou uma onda de pó prateado que cobriu os vales centrais. Desde então, a magia exige tributos de vontade ou sangue.</p>
            </div>
            <div class="ornate-card">
              <h4>O Trono de Prata de Eldor</h4>
              <p class="lore-text">Fundado pelos cavaleiros feudais do ocidente, Eldor preza pela honra, agricultura e escudos pesados. Sua Rainha atual, Lyra, luta para manter o tesouro estável sem ceder à pressão imperial.</p>
            </div>
            <div class="ornate-card">
              <h4>A Supremacia Alquímica de Solgard</h4>
              <p class="lore-text">Nascido no deserto de obsidiana, Solgard rejeita feitiçarias instáveis em favor da pólvora e engenharia mecânica sob o comando de Kaelen VII.</p>
            </div>
            <div class="ornate-card">
              <h4>Asas de Escama e o Santuário</h4>
              <p class="lore-text">Suspensa no ar por cristais de gravitação, a ordem mística preserva o laço sagrado entre humanos e dragões, evitando que as feras sejam escravizadas para guerras humanas.</p>
            </div>
          </div>
        </div>

        <div id="lore-achievements" class="lore-subview" style="display: none;">
          <div class="panel-header-ornate">
            <h3>🏆 Conquistas, Medalhas e Feitos Legendários</h3>
            <p>As marcas imortais que seu personagem gravou na história de Aethelgard.</p>
          </div>
          <div class="achievements-grid mt-3">
    `;

    this.achievements.forEach(a => {
      html += `
        <div class="ornate-card ach-card ${a.unlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon">${a.unlocked ? '🏆' : '🔒'}</div>
          <div class="ach-info">
            <h4>${a.title}</h4>
            <p class="lore-text">${a.desc}</p>
            <span class="ach-status">${a.unlocked ? '✔ DESBLOQUEADA' : 'Em progresso...'}</span>
          </div>
        </div>
      `;
    });

    html += `
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  switchSubSection(subId) {
    document.querySelectorAll(".lore-subview").forEach(el => el.style.display = "none");
    const target = document.getElementById("lore-" + subId);
    if (target) {
      target.style.display = "block";
      if (window.audioManager) window.audioManager.play("page_turn");

      if (subId === "chronicle") {
        this.renderChronicleBook();
      }
    }
  }

  renderChronicleBook() {
    const container = document.getElementById("chronicle-content");
    if (!container || !window.chronicleBook) {
      if (container) container.innerHTML = "<p>O Livro das Crônicas ainda não tem registros. Comece sua jornada!</p>";
      return;
    }

    const chronicle = window.chronicleBook.getFullChronicle();
    let html = `
      <div class="ornate-card">
        <h4>📜 ${chronicle.title}</h4>
        <p><strong>Protagonista:</strong> ${chronicle.protagonist}</p>
        <p><strong>Capítulos escritos:</strong> ${chronicle.totalChapters}</p>
      </div>
    `;

    chronicle.chapters.forEach((ch, idx) => {
      html += `
        <div class="ornate-card mt-3">
          <h5>${ch.title} <small>(${ch.startedDay})</small></h5>
          <ul class="mt-2" style="list-style: none; font-size:13px;">
      `;
      ch.entries.forEach(entry => {
        html += `<li><strong>${entry.day}</strong> — ${entry.title} <em>(${entry.source})</em></li>`;
      });
      html += `</ul></div>`;
    });

    // Add discovery log from discoveryManager
    if (window.discoveryManager) {
      const log = window.discoveryManager.getKnowledgeJournal();
      if (log.length > 0) {
        html += `<div class="ornate-card mt-4"><h5>📚 Diário de Conhecimento (Descobertas)</h5><ul>`;
        log.slice(0, 8).forEach(e => {
          html += `<li>${e.discoveredAt}: ${e.type.toUpperCase()} — ${e.id} <small>(${e.source})</small></li>`;
        });
        html += `</ul></div>`;
      }
    }

    container.innerHTML = html;
  }
}

window.loreManager = new LoreManager();
