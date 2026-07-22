/**
 * Crônica de Aethelgard - Interface Principal e Orquestrador Visual Premium (ui.js)
 * Orquestra a Tela Principal, Menu de Pergaminhos, Ícones Vetoriais, Painéis Ornamentados e UX AAA.
 */

class UIManager {
  constructor() {
    this.currentTab = "map";
    this.activeEventModal = null;
    this.inHomeScreen = true;
  }

  initUI() {
    this.setupEventListeners();
    this.showHomeScreen();
    if (window.loreManager) window.loreManager.initAtmosphereCanvas();
  }

  setupEventListeners() {
    // Navegação nas abas laterais e barra móvel inferior
    document.querySelectorAll(".nav-btn, .bottom-nav-btn").forEach(btn => {
      if (typeof btn.addEventListener === "function") {
        btn.addEventListener("click", (e) => {
          const tab = e.currentTarget.dataset.tab;
          if (tab) {
            this.changeTab(tab);
            this.closeMobileSidebar();
          }
        });
      }
    });

    // Controle da gaveta (drawer) móvel da barra lateral
    const btnDrawer = document.getElementById("btn-mobile-drawer");
    const btnCloseSidebar = document.getElementById("btn-close-sidebar");
    const btnMobileMore = document.getElementById("btn-mobile-more");
    const backdrop = document.getElementById("sidebar-backdrop");

    if (btnDrawer && typeof btnDrawer.addEventListener === "function") {
      btnDrawer.addEventListener("click", () => this.toggleMobileSidebar());
    }
    if (btnMobileMore && typeof btnMobileMore.addEventListener === "function") {
      btnMobileMore.addEventListener("click", () => this.toggleMobileSidebar());
    }
    if (btnCloseSidebar && typeof btnCloseSidebar.addEventListener === "function") {
      btnCloseSidebar.addEventListener("click", () => this.closeMobileSidebar());
    }
    if (backdrop && typeof backdrop.addEventListener === "function") {
      backdrop.addEventListener("click", () => this.closeMobileSidebar());
    }

    // Botões globais do cabeçalho
    const btnMute = document.getElementById("btn-mute");
    if (btnMute && typeof btnMute.addEventListener === "function") {
      btnMute.addEventListener("click", () => {
        const isMuted = window.audioManager ? window.audioManager.toggleMute() : true;
        btnMute.innerHTML = isMuted ? `${window.Icons?.time || ''} 🔇 Mutado` : `🔊 Áudio`;
      });
    }

    const btnMusic = document.getElementById("btn-music-mute");
    if (btnMusic && typeof btnMusic.addEventListener === "function") {
      btnMusic.addEventListener("click", () => {
        const isMuted = window.audioManager ? window.audioManager.toggleMusicMute() : true;
        btnMusic.innerHTML = isMuted ? `🎵 Música: Off` : `🎵 Música: On`;
      });
    }

    const btnCamp = document.getElementById("btn-quick-camp");
    if (btnCamp && typeof btnCamp.addEventListener === "function") {
      btnCamp.addEventListener("click", () => {
        if (window.combatManager && window.combatManager.inCombat) {
          this.showToast("Você não pode acampar enquanto estiver em combate!", "warning");
          return;
        }
        if (window.calendarManager) {
          window.calendarManager.advanceTime(8, "Acampamento e Descanso");
          this.showToast("Você acampou por 8 horas. HP e Vontade restaurados, fadiga reduzida.", "success");
          this.playSound("potion");
          this.updateBackgroundByContext("acampamento");
          this.updateAllPanels();
        }
      });
    }

    const btnSave = document.getElementById("btn-quick-save");
    if (btnSave && typeof btnSave.addEventListener === "function") {
      btnSave.addEventListener("click", () => {
        if (window.saveManager) window.saveManager.saveGameToSlot("slot_1");
      });
    }

    const btnHome = document.getElementById("btn-to-home");
    if (btnHome && typeof btnHome.addEventListener === "function") {
      btnHome.addEventListener("click", () => {
        this.showHomeScreen();
      });
    }

    // Botões do Menu da Home
    document.getElementById("btn-home-new")?.addEventListener("click", () => {
      this.playSound("menu_open");
      if (window.creationManager) {
        window.creationManager.showCreationScreen();
      } else {
        window.Game.startNewCampaign();
        this.enterGameWorld();
      }
    });

    document.getElementById("btn-home-continue")?.addEventListener("click", () => {
      this.playSound("menu_open");
      if (window.saveManager && (localStorage.getItem("aethelgard_auto") || localStorage.getItem("aethelgard_slot_1"))) {
        const slot = localStorage.getItem("aethelgard_auto") ? "auto" : "slot_1";
        window.saveManager.loadGameFromSlot(slot);
        this.enterGameWorld();
      } else {
        this.showToast("Nenhum save prévio encontrado. Iniciando Nova Campanha!", "info");
        window.Game.startNewCampaign();
        this.enterGameWorld();
      }
    });

    document.getElementById("btn-home-load")?.addEventListener("click", () => {
      this.playSound("click");
      this.enterGameWorld();
      this.changeTab("save");
    });

    document.getElementById("btn-home-lore")?.addEventListener("click", () => {
      this.playSound("page_turn");
      this.enterGameWorld();
      this.changeTab("lore");
    });

    document.getElementById("btn-home-credits")?.addEventListener("click", () => {
      this.playSound("click");
      this.showModalAlert("⚔️ CRÉDITOS DA CRÔNICA DE AETHELGARD", `
        <div class="credits-box text-center">
          <p><strong>Desenvolvimento, Arte e Engine 100% Offline:</strong> Arena.ai Agent Mode</p>
          <p class="mt-2">Inspirado na imersão narrativa de <em>Baldur's Gate 3</em>, <em>Dragon Age</em>, <em>The Witcher</em> e <em>Life Adventure</em>.</p>
          <p class="mt-2">Todas as ilustrações, trilhas sonoras procedurais em Web Audio API e sistemas foram gerados para máxima fidelidade e rejogabilidade.</p>
        </div>
      `, "Voltar à Taverna");
    });
  }

  showHomeScreen() {
    this.inHomeScreen = true;
    const hs = document.getElementById("home-screen");
    if (hs) {
      hs.classList.add("active");
      const titleBg = typeof window.getImageUrl === "function" ? window.getImageUrl("assets/backgrounds/title_bg.jpg") : "assets/backgrounds/title_bg.jpg";
      hs.style.backgroundImage = `linear-gradient(rgba(17, 19, 24, 0.4), rgba(17, 19, 24, 0.85)), url('${titleBg}')`;
    }
    document.getElementById("game-shell")?.classList.remove("active");
    
    // Música e atmosfera de título
    if (window.audioManager) window.audioManager.playRegionalMusic("title");
    if (window.loreManager) window.loreManager.setAtmosphereMode("embers");
  }

  enterGameWorld() {
    this.inHomeScreen = false;
    document.getElementById("home-screen")?.classList.remove("active");
    document.getElementById("game-shell")?.classList.add("active");

    const loc = window.mapManager ? window.mapManager.getCurrentLocation() : { id: "loc_eldoria" };
    this.updateBackgroundByLocation(loc);
    this.changeTab(this.currentTab || "map");
    this.updateAllPanels();
  }

  updateBackgroundByLocation(location) {
    const shell = document.getElementById("game-shell");
    if (!shell || !location) return;

    const bgMap = {
      loc_eldoria: "assets/backgrounds/eldoria_city.jpg",
      loc_vale_cinzas: "assets/backgrounds/ash_valley.jpg",
      loc_picos_dragao: "assets/backgrounds/dragon_peaks.jpg",
      loc_floresta_lumen: "assets/backgrounds/lumen_forest.jpg",
      loc_ruinas_khaz: "assets/backgrounds/aethel_khaz.jpg",
      loc_porto_valen: "assets/backgrounds/valen_port.jpg",
      loc_deserto_solgard: "assets/backgrounds/solgard_desert.jpg",
      loc_cidade_solgard: "assets/backgrounds/solgard_desert.jpg",
      loc_pantano_almas: "assets/backgrounds/ash_valley.jpg",
      loc_santuario_flutuante: "assets/backgrounds/dragon_peaks.jpg",
      loc_cidadela_ferro: "assets/backgrounds/campsite.jpg",
      loc_oasís_ouro: "assets/backgrounds/solgard_desert.jpg"
    };

    const bgFile = bgMap[location.id] || "assets/backgrounds/eldoria_city.jpg";
    const resolvedBg = typeof window.getImageUrl === "function" ? window.getImageUrl(bgFile) : bgFile;
    shell.style.backgroundImage = `linear-gradient(rgba(17, 19, 24, 0.78), rgba(17, 19, 24, 0.95)), url('${resolvedBg}')`;

    if (location.id === "loc_eldoria" || location.id === "loc_porto_valen" || location.id === "loc_cidade_solgard") {
      if (window.audioManager) window.audioManager.playRegionalMusic("cidade");
      if (window.loreManager) window.loreManager.setAtmosphereMode("embers");
    } else if (location.id === "loc_vale_cinzas" || location.id === "loc_deserto_solgard" || location.id === "loc_ruinas_khaz") {
      if (window.audioManager) window.audioManager.playRegionalMusic("ruinas");
      if (window.loreManager) window.loreManager.setAtmosphereMode("fog");
    } else if (location.id === "loc_floresta_lumen" || location.id === "loc_pantano_almas") {
      if (window.audioManager) window.audioManager.playRegionalMusic("floresta");
      if (window.loreManager) window.loreManager.setAtmosphereMode("leaves");
    } else {
      if (window.audioManager) window.audioManager.playRegionalMusic("cidade");
      if (window.loreManager) window.loreManager.setAtmosphereMode("embers");
    }
  }

  updateBackgroundByContext(context) {
    const shell = document.getElementById("game-shell");
    if (!shell) return;
    if (context === "acampamento") {
      if (window.loreManager) window.loreManager.setAtmosphereMode("embers");
    } else if (context === "magia") {
      if (window.loreManager) window.loreManager.setAtmosphereMode("fog");
    }
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && backdrop) {
      const isOpen = sidebar.classList.toggle("mobile-open");
      backdrop.classList.toggle("active", isOpen);
      if (isOpen && window.audioManager) window.audioManager.play("click");
    }
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar && backdrop) {
      sidebar.classList.remove("mobile-open");
      backdrop.classList.remove("active");
    }
  }

  changeTab(tabId) {
    if (window.combatManager && window.combatManager.inCombat && tabId !== "combat") {
      this.showToast("Conclua ou recue do combate antes de alternar de aba!", "warning");
      return;
    }

    this.currentTab = tabId;
    document.querySelectorAll(".nav-btn, .bottom-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    document.querySelectorAll(".panel-view").forEach(panel => {
      panel.classList.toggle("active", panel.id === `view-${tabId}`);
    });

    this.playSound("click");
    if (tabId === "magic" || tabId === "skills") this.updateBackgroundByContext("magia");
    this.renderCurrentTab();
  }

  renderCurrentTab() {
    switch (this.currentTab) {
      case "story": this.renderStoryScene(); break;
      case "map": this.renderMap(); break;
      case "character": this.renderCharacter(); break;
      case "inventory": this.renderInventory(); break;
      case "dragon": this.renderDragon(); break;
      case "magic": this.renderMagic(); break;
      case "skills": this.renderSkills(); break;
      case "kingdoms": this.renderKingdoms(); break;
      case "party": if (window.partyRenderer) window.partyRenderer.renderPartyTab(); break;
      case "romance": if (window.romanceRenderer) window.romanceRenderer.renderRomanceTab(); break;
      case "guilds": this.renderGuilds(); break;
      case "market": this.renderMarketAndCrafting(); break;
      case "quests": this.renderQuests(); break;
      case "lore": if (window.loreManager) window.loreManager.renderLoreTab(); break;
      case "audit": this.renderAudit(); break;
      case "save": this.renderSave(); break;
    }
  }

  updateAllPanels() {
    this.updateHeader();
    if (!this.inHomeScreen) {
      this.renderCurrentTab();
    }
  }

  renderStoryScene() {
    if (window.storyRenderer) window.storyRenderer.renderStoryScene();
  }

  renderRomanceTab() {
    if (window.romanceRenderer) window.romanceRenderer.renderRomanceTab();
  }

  renderPartyTab() {
    if (window.partyRenderer) window.partyRenderer.renderPartyTab();
  }

  updateHeader() {
    const attr = window.attributesManager;
    const cal = window.calendarManager;
    const inv = window.inventoryManager;
    const map = window.mapManager;

    if (attr) {
      const lvlEl = document.getElementById("hdr-level");
      if (lvlEl) lvlEl.textContent = `Nível ${attr.level}`;
      const hpEl = document.getElementById("hdr-hp");
      if (hpEl) hpEl.textContent = `${attr.currentHP}/${attr.derived.maxHP}`;
      const hpBar = document.getElementById("hdr-hp-bar");
      if (hpBar) hpBar.style.width = `${Math.min(100, (attr.currentHP / attr.derived.maxHP) * 100)}%`;

      const willEl = document.getElementById("hdr-will");
      if (willEl) willEl.textContent = `${attr.currentWillpower}/${attr.derived.maxWillpower}`;
      const willBar = document.getElementById("hdr-will-bar");
      if (willBar) willBar.style.width = `${Math.min(100, (attr.currentWillpower / attr.derived.maxWillpower) * 100)}%`;

      const fatEl = document.getElementById("hdr-fatigue");
      if (fatEl) fatEl.textContent = `${attr.magicalFatigue}%`;
      const fatBar = document.getElementById("hdr-fatigue-bar");
      if (fatBar) fatBar.style.width = `${attr.magicalFatigue}%`;
    }

    if (cal) {
      const dateEl = document.getElementById("hdr-date");
      if (dateEl) dateEl.textContent = cal.getFormattedDate();
      const wthEl = document.getElementById("hdr-weather");
      if (wthEl) {
        wthEl.innerHTML = `${window.Icons?.weather || ''} ${cal.currentWeather.name}`;
        wthEl.title = cal.currentWeather.modifier;
      }
      const moonEl = document.getElementById("hdr-moon");
      if (moonEl) moonEl.innerHTML = `${window.Icons?.moon || ''} ${cal.currentMoon.name}`;
    }

    if (inv) {
      const goldEl = document.getElementById("hdr-gold");
      if (goldEl) goldEl.innerHTML = `${window.Icons?.gold || ''} ${inv.gold} ouro`;
    }

    if (map) {
      const loc = map.getCurrentLocation();
      const locEl = document.getElementById("hdr-location");
      if (loc && locEl) locEl.innerHTML = `${window.Icons?.location || ''} ${loc.name}`;
    }
  }

  /* --- ABA: MAPA E EXPLORAÇÃO --- */
  renderMap() {
    const container = document.getElementById("map-container");
    if (!container || !window.mapManager) return;

    const current = window.mapManager.getCurrentLocation();
    const connected = window.mapManager.getConnectedLocations();

    let html = `
      <div class="map-layout">
        <div class="ornate-card current-location-card">
          <div class="card-top">
            <h3>${window.Icons?.location || ''} Localização Atual: ${current.name}</h3>
            <span class="badge danger-level">Perigo Nível ${current.dangerLevel || 1} / 5</span>
          </div>
          <p class="loc-desc mt-2">${current.description}</p>
          <div class="loc-meta mt-2">
            <span><strong>Região Real:</strong> ${current.region}</span> | 
            <span><strong>Acampamento Seguro:</strong> ${current.canCamp ? 'Sim' : 'Não'}</span> | 
            <span><strong>Mercado Local:</strong> ${current.hasMarket ? 'Ativo' : 'Ausente'}</span>
          </div>
          <div class="loc-actions mt-3">
            <button class="action-btn primary" onclick="window.eventsEngine.triggerExplorationEvent()">🔍 Explorar Região e Procurar Eventos</button>
            <button class="action-btn secondary" onclick="window.ui.changeTab('market')">⛺ Montar Acampamento e Alquimia</button>
          </div>
        </div>

        <!-- MAPA ARTÍSTICO DESENHADO À MÃO -->
        <div class="artistic-map-box my-4">
          <div class="art-map-header">
            <h4>🗺️ Cartografia Continental das Terras das Cinzas</h4>
            <span class="map-subtitle">Clique diretamente nas regiões conectadas para viajar ou inspecione abaixo</span>
          </div>
          <div class="hand-drawn-map-frame">
            <svg class="map-svg-visual" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#1e1a17" rx="8"/>
              <!-- Elementos geográficos -->
              <path d="M50 350 C 200 300, 300 380, 500 330 C 650 280, 750 360, 800 320 L 800 400 L 0 400 Z" fill="#15120f" stroke="#383f51" stroke-width="2"/>
              <path d="M100 50 C 250 80, 400 30, 600 70 C 700 90, 780 40, 800 60" fill="none" stroke="#2c1810" stroke-width="3" stroke-dasharray="6,4"/>
              
              <!-- Rios e montanhas -->
              <path d="M280 80 C 290 180, 240 260, 310 380" fill="none" stroke="#164e63" stroke-width="4" opacity="0.7"/>
              <polygon points="420,120 440,70 460,120" fill="#383f51" stroke="#cbd5e1" stroke-width="1.5"/>
              <polygon points="450,110 475,50 500,110" fill="#383f51" stroke="#cbd5e1" stroke-width="1.5"/>
              <polygon points="480,125 500,85 520,125" fill="#383f51" stroke="#cbd5e1" stroke-width="1.5"/>
              
              <!-- Pinos e Linhas das Regiões -->
              ${window.mapManager.locations.map((loc, idx) => {
                const coords = {
                  loc_eldoria: { x: 220, y: 220 },
                  loc_vale_cinzas: { x: 350, y: 200 },
                  loc_picos_dragao: { x: 475, y: 90 },
                  loc_floresta_lumen: { x: 180, y: 310 },
                  loc_ruinas_khaz: { x: 480, y: 270 },
                  loc_porto_valen: { x: 120, y: 150 },
                  loc_deserto_solgard: { x: 640, y: 260 },
                  loc_cidade_solgard: { x: 710, y: 310 },
                  loc_pantano_almas: { x: 290, y: 350 },
                  loc_santuario_flutuante: { x: 530, y: 60 },
                  loc_cidadela_ferro: { x: 390, y: 110 },
                  loc_oasís_ouro: { x: 740, y: 210 }
                }[loc.id] || { x: 100 + (idx * 55), y: 150 + (idx % 3 * 60) };

                const isCurrent = loc.id === current.id;
                const isConnected = current.connectedTo?.includes(loc.id);

                return `
                  <g class="map-pin-group ${isCurrent ? 'pin-current' : (isConnected ? 'pin-connected' : 'pin-locked')}" onclick="window.mapManager.travelTo('${loc.id}')" style="cursor: ${isConnected ? 'pointer' : 'default'}">
                    <circle cx="${coords.x}" cy="${coords.y}" r="${isCurrent ? 14 : 10}" fill="${isCurrent ? '#f59e0b' : (isConnected ? '#38bdf8' : '#475569')}" stroke="#fff" stroke-width="2"/>
                    <text x="${coords.x}" y="${coords.y - 18}" text-anchor="middle" fill="#f8fafc" font-size="12" font-family="var(--font-serif)" font-weight="bold">${loc.name.split(' - ')[0]}</text>
                  </g>
                `;
              }).join('')}
            </svg>
          </div>
        </div>

        <div class="connected-destinations mt-4">
          <h4>Destinos Conectados para Viagem Rápida</h4>
          <div class="destinations-grid mt-2">
    `;

    connected.forEach(dest => {
      let travelDays = dest.travelDays || 1;
      let mountBonus = false;
      if (window.dragonManager && window.dragonManager.canFlyMount()) {
        travelDays = Math.max(1, Math.floor(travelDays / 2));
        mountBonus = true;
      }

      html += `
        <div class="ornate-card dest-card">
          <div class="card-top">
            <h5>${dest.name}</h5>
            <span class="danger-pill">Perigo ${dest.dangerLevel}</span>
          </div>
          <p class="dest-region mt-1">${dest.region}</p>
          <p class="dest-info mt-2">Tempo de Viagem: <strong>${travelDays} dia(s)</strong> ${mountBonus ? '<span class="mount-tag">🐉 Voo Draconiano (-50%)</span>' : ''}</p>
          <p class="dest-food">Consumo de ração: ${travelDays} ração(ões)</p>
          <button class="action-btn primary travel-btn mt-3" onclick="window.mapManager.travelTo('${dest.id}')">✈️ Viajar para cá</button>
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

  /* --- ABA: PERSONAGEM E ATRIBUTOS --- */
  renderCharacter() {
    const container = document.getElementById("character-container");
    if (!container || !window.attributesManager) return;

    const attr = window.attributesManager;
    const hid = window.hiddenAttributesManager;

    let html = `
      <div class="character-layout">
        <div class="ornate-card char-summary-card">
          <div class="char-title-section">
            <div class="char-avatar-box">
              <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl('assets/portraits/lyra.jpg') : 'assets/portraits/lyra.jpg'}" data-orig-src="assets/portraits/lyra.jpg" onerror="window.handleImageError(this, 'portrait')" alt="Retrato Aventureiro" class="avatar-img-char"/>
            </div>
            <div class="char-title-text">
              <h3>Crônica do Cavaleiro - Nível ${attr.level}</h3>
              <span class="char-title">"${hid ? hid.playerTitle : 'O Viajante'}"</span>
              <div class="points-available mt-2">
                <span>Pontos Atributo: <strong class="highlight-points">${attr.availablePoints}</strong></span> | 
                <span>Pontos Habilidade: <strong class="highlight-points">${attr.skillPoints}</strong></span>
              </div>
            </div>
          </div>
          <div class="xp-bar-container mt-3">
            <div class="xp-bar" style="width: ${(attr.xp / attr.xpNext) * 100}%"></div>
            <span class="xp-text">${attr.xp} / ${attr.xpNext} XP para Nível ${attr.level + 1}</span>
          </div>
        </div>

        <div class="stats-section grid-2-col mt-4">
          <div class="ornate-card base-attributes-card">
            <h4>Os 18 Atributos Visíveis</h4>
            <div class="attr-grid mt-2">
    `;

    const namesMap = {
      forca: "Força", destreza: "Destreza", inteligencia: "Inteligência", sabedoria: "Sabedoria",
      carisma: "Carisma", constituicao: "Constituição", vontade: "Vontade", percepcao: "Percepção",
      sorte: "Sorte", afinidadeMagica: "Afinidade Mágica", dominioElemental: "Domínio Elemental",
      dominioMarcial: "Domínio Marcial", lideranca: "Liderança", empatia: "Empatia",
      furtividade: "Furtividade", precisao: "Precisão", resistenciaMental: "Resistência Mental",
      resistenciaFisica: "Resistência Física"
    };

    for (const [key, label] of Object.entries(namesMap)) {
      const val = attr.getAttribute(key);
      html += `
        <div class="attr-row">
          <span class="attr-name">${label}:</span>
          <span class="attr-val">${val}</span>
          ${attr.availablePoints > 0 ? `<button class="btn-plus" onclick="window.attributesManager.allocatePoint('${key}'); window.ui.updateAllPanels();">+</button>` : ''}
        </div>
      `;
    }

    html += `
            </div>
          </div>

          <div class="ornate-card derived-stats-card">
            <h4>Estatísticas Derivadas (Tempo Real)</h4>
            <ul class="derived-list mt-2">
              <li><strong>Saúde Máxima (HP):</strong> ${attr.derived.maxHP}</li>
              <li><strong>Vontade/Mana Máxima:</strong> ${attr.derived.maxWillpower}</li>
              <li><strong>Capacidade de Carga:</strong> ${attr.derived.maxCarryWeight} kg</li>
              <li><strong>Chance de Acerto Crítico:</strong> ${attr.derived.critChance}%</li>
              <li><strong>Iniciativa de Combate:</strong> ${attr.derived.initiative}</li>
              <li><strong>Defesa Física Base:</strong> ${attr.derived.physicalDefense}</li>
              <li><strong>Defesa Mágica Base:</strong> ${attr.derived.magicalDefense}</li>
              <li><strong>Recuperação Diária de Fadiga:</strong> ${attr.derived.fatigueRecoveryRate}% / dia</li>
              <li><strong>Desconto Comercial em Compras:</strong> ${attr.derived.priceDiscount}%</li>
              <li><strong>Corrupção Arcana Atual:</strong> ${attr.arcaneCorruption}%</li>
            </ul>

            <div class="npc-perception-box mt-4">
              <h4>Voz do Mundo e Reputação da IA</h4>
              <p class="npc-comment mt-1"><em>${hid ? hid.getNPCReactionComment() : ''}</em></p>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /* --- ABA: INVENTÁRIO AAA-INSPIRED --- */
  renderInventory() {
    const container = document.getElementById("inventory-container");
    if (!container || !window.inventoryManager) return;

    const inv = window.inventoryManager;
    const attr = window.attributesManager;
    const totalW = inv.getTotalWeight();
    const maxW = attr ? attr.derived.maxCarryWeight : 60;

    let html = `
      <div class="inventory-layout">
        <div class="ornate-card equipment-summary-card">
          <div class="equip-header">
            <h4>Equipamentos Ativos e Carga do Aventureiro</h4>
            <span class="weight-status ${totalW > maxW ? 'overweight' : ''}">Carga: <strong>${totalW} / ${maxW} kg</strong></span>
          </div>
          <div class="equipped-items-grid mt-2">
            <div class="equip-slot">
              <label>${window.Icons?.sword || ''} Arma Equipada:</label>
              ${inv.equippedWeapon ? `
                <div class="slot-item mt-1">
                  <strong>${inv.equippedWeapon.name}</strong> (${inv.equippedWeapon.style})<br/>
                  <small>Dano: ${inv.equippedWeapon.dano} | Durabilidade: ${inv.equippedWeapon.durabilidade.current}/${inv.equippedWeapon.durabilidade.max}</small><br/>
                  ${inv.equippedWeapon.enchantment ? `<span class="enchant-badge mt-1">✨ ${inv.equippedWeapon.enchantment}</span>` : ''}
                </div>
              ` : '<span class="empty-slot">Nenhuma arma equipada (Punhos)</span>'}
            </div>

            <div class="equip-slot">
              <label>${window.Icons?.shield || ''} Armadura Equipada:</label>
              ${inv.equippedArmor ? `
                <div class="slot-item mt-1">
                  <strong>${inv.equippedArmor.name}</strong><br/>
                  <small>Defesa Fís: +${inv.equippedArmor.defense} | Defesa Mág: +${inv.equippedArmor.magicDefense || 0}</small>
                </div>
              ` : '<span class="empty-slot">Nenhuma armadura equipada (Roupas comuns)</span>'}
            </div>
          </div>
        </div>

        <div class="inventory-filters-bar mt-4">
          <input type="text" id="inv-search-input" placeholder="Buscar item no inventário por nome..." oninput="window.ui.filterInventory(this.value)" class="inv-search-field"/>
        </div>

        <div class="inventory-tabs-section mt-3" id="inv-items-render-zone">
          <!-- Renderizado dinamicamente pelo filter -->
          ${this.getInventoryItemsHtml("")}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  getInventoryItemsHtml(query = "") {
    const inv = window.inventoryManager;
    if (!inv) return "";
    let html = `<h4>Armas Brancas</h4><div class="items-grid mt-2">`;

    inv.weapons.filter(w => !query || w.name.toLowerCase().includes(query.toLowerCase())).forEach(wp => {
      const isEq = inv.equippedWeapon && inv.equippedWeapon.instanceId === wp.instanceId;
      html += `
        <div class="ornate-card item-card ${isEq ? 'equipped' : ''}">
          <div class="item-card-top">
            <strong>${wp.name}</strong>
            <span class="rarity-badge ${wp.rarity ? wp.rarity.toLowerCase() : 'comum'}">${wp.rarity || 'Comum'}</span>
          </div>
          <p class="item-stats mt-1">Dano: ${wp.dano} | Velocidade: ${wp.velocidade} | Peso: ${wp.peso}kg</p>
          <p class="item-stats">Durabilidade: ${wp.durabilidade.current}/${wp.durabilidade.max}</p>
          <div class="item-actions mt-2">
            ${!isEq ? `<button class="action-btn small primary" onclick="window.inventoryManager.equipWeapon('${wp.instanceId}'); window.ui.updateAllPanels();">Equipar</button>` : '<span class="eq-tag">✔ Equipado</span>'}
            ${wp.durabilidade.current < wp.durabilidade.max ? `<button class="action-btn small secondary" onclick="window.inventoryManager.repairWeapon('${wp.instanceId}'); window.ui.updateAllPanels();">Reparar (-1 Barra Ferro)</button>` : ''}
          </div>
        </div>
      `;
    });

    html += `</div><h4 class="mt-4">Armaduras e Mantos</h4><div class="items-grid mt-2">`;

    inv.armors.filter(a => !query || a.name.toLowerCase().includes(query.toLowerCase())).forEach(ar => {
      const isEq = inv.equippedArmor && inv.equippedArmor.instanceId === ar.instanceId;
      html += `
        <div class="ornate-card item-card ${isEq ? 'equipped' : ''}">
          <div class="item-card-top">
            <strong>${ar.name}</strong>
            <span class="rarity-badge ${ar.rarity ? ar.rarity.toLowerCase() : 'comum'}">${ar.rarity || 'Comum'}</span>
          </div>
          <p class="item-stats mt-1">Defesa Fís: +${ar.defense} | Defesa Mág: +${ar.magicDefense || 0} | Peso: ${ar.peso}kg</p>
          <div class="item-actions mt-2">
            ${!isEq ? `<button class="action-btn small primary" onclick="window.inventoryManager.equipArmor('${ar.instanceId}'); window.ui.updateAllPanels();">Equipar</button>` : '<span class="eq-tag">✔ Equipado</span>'}
          </div>
        </div>
      `;
    });

    html += `</div><h4 class="mt-4">Consumíveis e Materiais</h4><div class="items-grid mt-2">`;

    for (const [id, count] of Object.entries(inv.items)) {
      const tmpl = inv.getItemTemplate(id);
      if (!tmpl || (query && !tmpl.name.toLowerCase().includes(query.toLowerCase()))) continue;
      html += `
        <div class="ornate-card item-card">
          <div class="item-card-top">
            <strong>${count}x ${tmpl.name}</strong>
            <span class="type-badge">${tmpl.type}</span>
          </div>
          <p class="item-desc mt-1">${tmpl.description}</p>
          <div class="item-actions mt-2">
            ${tmpl.type === 'consumivel' ? `<button class="action-btn small primary" onclick="window.inventoryManager.useConsumable('${id}')">Usar / Consumir</button>` : ''}
            <button class="action-btn small secondary" onclick="window.economyManager.sellItem('${id}', 1)">Vender (+${window.economyManager.getSellPrice(tmpl)} ouro)</button>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  filterInventory(query) {
    const zone = document.getElementById("inv-items-render-zone");
    if (zone) zone.innerHTML = this.getInventoryItemsHtml(query);
  }

  /* --- ABA: SANTUÁRIO DO DRAGÃO COM ARTE GERADA --- */
  renderDragon() {
    const container = document.getElementById("dragon-container");
    if (!container || !window.dragonManager) return;

    const drak = window.dragonManager;
    if (!drak.hasDragon) {
      container.innerHTML = `<div class="empty-state ornate-card"><h3>Você não possui um dragão no momento. Explore as missões do Pacto das Asas de Escama!</h3></div>`;
      return;
    }

    const dragonImgMap = {
      dragon_ignis: "assets/dragons/ignis_aurum.jpg",
      dragon_zephyr: "assets/dragons/zephyr_caeruleum.jpg",
      dragon_terra: "assets/dragons/terra_basalt.jpg",
      dragon_umbra: "assets/dragons/umbra_noctis.jpg",
      dragon_sylva: "assets/dragons/sylva_viridis.jpg"
    };
    const heroImgSrc = dragonImgMap[drak.speciesId] || "assets/dragons/ignis_aurum.jpg";

    let html = `
      <div class="dragon-layout">
        <div class="ornate-card dragon-status-card">
          <div class="dragon-hero-display">
            <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(heroImgSrc) : heroImgSrc}" data-orig-src="${heroImgSrc}" onerror="window.handleImageError(this, 'dragon')" alt="Hero Dragão" class="dragon-hero-img"/>
            <div class="dragon-hero-overlay">
              <div class="dragon-header">
                <h3>${window.Icons?.dragon || ''} ${drak.name} (${drak.stage})</h3>
                <span class="badge species-badge">${drak.speciesData ? drak.speciesData.name : 'Dragão Primordial'}</span>
              </div>
              <p class="dragon-desc mt-1">${drak.speciesData ? drak.speciesData.description : ''}</p>
            </div>
          </div>

          <div class="dragon-vital-stats mt-4">
            <div class="stat-bar-group">
              <label>❤️ Saúde do Dragão: ${drak.health} / ${drak.maxHealth} ${drak.isSick ? '<span class="sick-alert">⚠️ DOENTE (' + drak.diseaseName + ')</span>' : ''}</label>
              <div class="progress-bar"><div class="progress-fill hp-color" style="width: ${(drak.health / drak.maxHealth) * 100}%"></div></div>
            </div>

            <div class="stat-bar-group">
              <label>🥩 Nível de Fome: ${drak.hunger}% (0% = Saciado, 100% = Faminto/Desesperado)</label>
              <div class="progress-bar"><div class="progress-fill hunger-color" style="width: ${drak.hunger}%"></div></div>
            </div>

            <div class="stat-bar-group">
              <label>😊 Humor e Moral: ${drak.mood}%</label>
              <div class="progress-bar"><div class="progress-fill mood-color" style="width: ${drak.mood}%"></div></div>
            </div>

            <div class="stat-bar-group">
              <label>🔗 Vínculo com o Cavaleiro: ${drak.bond}%</label>
              <div class="progress-bar"><div class="progress-fill bond-color" style="width: ${drak.bond}%"></div></div>
            </div>
          </div>

          <div class="dragon-actions-box mt-4">
            <button class="action-btn primary" onclick="window.dragonManager.feedDragon('ration_food')">🥩 Alimentar com Ração (-1 Ração)</button>
            <button class="action-btn primary" onclick="window.dragonManager.feedDragon('dragon_elixir')">✨ Saciador com Elixir Draconiano (-1 Elixir)</button>
            ${drak.isSick ? `<button class="action-btn danger" onclick="window.dragonManager.cureDisease()">🧪 Curar Doença (-1 Antídoto ou Elixir)</button>` : ''}
          </div>

          <div class="dragon-details-meta mt-3">
            <span>Idade: <strong>${drak.ageDays} dias</strong></span> | 
            <span>Peso Atual: <strong>${drak.weight} kg</strong></span> | 
            <span>Velocidade de Voo: <strong>${drak.speed}</strong></span> | 
            <span>Elemento: <strong>${drak.speciesData?.elemento || 'Fogo'}</strong></span>
          </div>
        </div>

        <div class="ornate-card dragon-perks-card mt-4">
          <h4>Habilidades e Vínculos Desbloqueados</h4>
          <ul class="perks-list mt-2">
    `;

    const allPerkInfos = [
      { id: "empathy", req: 20, name: "Empatia Draconiana", desc: "Percebe as intenções ocultas e emoções dos NPCs em diálogos." },
      { id: "mount", req: 40, name: "Montaria Aérea Avançada", desc: "Permite voar pelo mapa, cortando o tempo de viagem à metade e evitando armadilhas." },
      { id: "telepathy", req: 60, name: "Telepatia e Combate Sincronizado", desc: "O dragão defende seu cavaleiro e ataca sincronizado em todos os turnos." },
      { id: "shared_magic", req: 80, name: "Magia Compartilhada (Fusão Elemental)", desc: "Conjurações arcanas ganham o elemento do dragão e zeram a corrupção." },
      { id: "apotheosis", req: 100, name: "Apoteose Draconiana - Voo dos Titãs", desc: "Fusão perfeita entre cavaleiro e dragão para os finais supremos." }
    ];

    allPerkInfos.forEach(p => {
      const unlocked = drak.hasPerk(p.id);
      html += `
        <li class="perk-item ${unlocked ? 'unlocked' : 'locked'}">
          <div class="perk-top">
            <strong>${p.name}</strong>
            <span class="perk-req">Vínculo ${p.req}% (${unlocked ? '✔ Desbloqueado' : '🔒 Bloqueado'})</span>
          </div>
          <p class="perk-desc mt-1">${p.desc}</p>
        </li>
      `;
    });

    html += `
          </ul>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /* --- ABA: LIVRO DE MAGIAS (GRIMÓRIO EM DUPLA PÁGINA COM VIRADA 3D) --- */
  renderMagic() {
    const container = document.getElementById("magic-container");
    if (!container || !window.magicManager) return;

    const mag = window.magicManager;
    const schools = mag.getAllSchools();
    const activeSchoolId = this.selectedMagicSchoolId || schools[0].id;
    const activeSchool = mag.getSchool(activeSchoolId) || schools[0];

    let html = `
      <div class="magic-layout">
        <div class="ornate-card magic-header mb-4">
          <h3>${window.Icons?.magic || ''} Grimório Arcano das 12 Escolas</h3>
          <p>Selecione um marcador na lateral esquerda do grimório para abrir as páginas da escola desejada.</p>
        </div>

        <div class="grimoire-book-spread">
          <!-- Lateral de Abas de Couro -->
          <div class="grimoire-sidebar-tabs">
            ${schools.map(sch => `
              <button class="grimoire-tab-btn ${sch.id === activeSchoolId ? 'active' : ''}" onclick="window.ui.selectedMagicSchoolId = '${sch.id}'; window.audioManager?.play('page_turn'); window.ui.renderMagic();">
                <span>${sch.name.split(' e ')[0]}</span>
                <small style="opacity:0.7">Nível ${mag.masteryLevels[sch.id] || 1}</small>
              </button>
            `).join('')}
          </div>

          <!-- Página Aberta -->
          <div class="grimoire-page-content" id="grimoire-active-page">
            <div>
              <div class="grimoire-school-header">
                <h3>✨ ${activeSchool.name} <small style="font-size:14px; opacity:0.8">(${activeSchool.element})</small></h3>
                <span class="badge species-badge">Maestria Nível ${mag.masteryLevels[activeSchool.id] || 1}</span>
              </div>
              <p class="school-desc mt-1" style="font-style:italic; border-bottom:1px dashed rgba(120,53,15,0.4); padding-bottom:12px;">"${activeSchool.description}"</p>

              <div class="spells-list mt-3">
                ${activeSchool.spells.map(sp => {
                  const learned = mag.learnedSpells.includes(sp.id);
                  return `
                    <div class="spell-parchment-row ${learned ? 'learned' : ''}">
                      <div class="spell-info">
                        <strong>${sp.name}</strong> <small>(Custo: ${sp.cost} Vontade | +${sp.fatigue || 10}% Fadiga ${sp.corruption ? '| +' + sp.corruption + '% Corrupção' : ''})</small>
                        <p class="mt-1" style="font-size:13px;">${sp.desc}</p>
                      </div>
                      <div class="spell-action">
                        ${!learned ? `<button class="action-btn small primary" onclick="window.magicManager.learnSpell('${sp.id}'); window.ui.updateAllPanels();">Aprender</button>` : ''}
                        ${learned && sp.healAmount ? `<button class="action-btn small primary" onclick="window.magicManager.castSpell('${sp.id}', false); window.ui.updateAllPanels();">Conjurar Cura</button>` : ''}
                        ${learned && !sp.healAmount ? `<span class="badge danger-level" style="background:#059669; color:#fff; border:none;">✔ Conhecida</span>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="grimoire-page-footer mt-3" style="display:flex; justify-content:space-between; font-size:11px; color:#78350f; border-top:1px solid rgba(120,53,15,0.3); padding-top:8px;">
              <span>Grimório de Aethel-Khaz</span>
              <span>Página da Escola: ${activeSchool.element}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /* --- ABA: ÁRVORE DE HABILIDADES --- */
  renderSkills() {
    const container = document.getElementById("skills-container");
    if (!container || !window.skillsManager) return;

    const sm = window.skillsManager;
    const trees = sm.getAllArchetypes();

    let html = `
      <div class="skills-layout">
        <div class="ornate-card skills-header mb-4">
          <h3>${window.Icons?.skills || ''} As 17 Árvores de Arquétipos e Habilidades</h3>
          <p>Seus pontos de habilidade disponíveis: <strong class="highlight-points">${window.attributesManager?.skillPoints || 0}</strong></p>
        </div>
        <div class="trees-grid">
    `;

    trees.forEach(tr => {
      html += `
        <div class="ornate-card tree-card">
          <h4>${tr.name} <small>(${tr.category})</small></h4>
          <p class="tree-desc mt-1">${tr.description}</p>
          <div class="tree-skills-list mt-2">
      `;

      tr.skills.forEach(sk => {
        const unlocked = sm.hasSkill(sk.id);
        html += `
          <div class="tree-skill-item ${unlocked ? 'unlocked' : 'locked'}">
            <div class="ts-info">
              <strong>${sk.name}</strong> (Custo: ${sk.cost} ptos)
              <p class="mt-1">${sk.desc}</p>
            </div>
            <div class="ts-action">
              ${!unlocked ? `<button class="action-btn small primary" onclick="window.skillsManager.unlockSkill('${sk.id}')">Desbloquear</button>` : '<span class="eq-tag">✔ Desbloqueado</span>'}
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  /* --- ABA: REINOS E GEOPOLÍTICA --- */
  renderKingdoms() {
    const container = document.getElementById("kingdoms-container");
    if (!container || !window.kingdomsManager) return;

    const km = window.kingdomsManager;
    const kingdoms = km.getAllKingdoms();

    let html = `
      <div class="kingdoms-layout">
        <div class="ornate-card kingdoms-header mb-4">
          <h3>${window.Icons?.kingdoms || ''} Soberanias, Guerras e Geopolítica Continental</h3>
          <p>Os reinos tomam decisões de guerra, paz e economia mesmo quando você está longe.</p>
        </div>
        <div class="kingdoms-grid">
    `;

    kingdoms.forEach(k => {
      html += `
        <div class="ornate-card kingdom-card">
          <div class="k-header">
            <h4>👑 ${k.name}</h4>
            <span class="rep-badge">Reputação com você: ${k.reputationWithPlayer}</span>
          </div>
          <p class="k-ruler mt-1"><strong>Governante:</strong> ${k.ruler}</p>
          <p class="k-desc mt-1">${k.description}</p>
          <div class="k-stats mt-2">
            <span><strong>Economia:</strong> ${k.economyState} (${k.economyGoldPool} ouro)</span> | 
            <span><strong>Força Militar:</strong> ${k.armyStrength}</span> | 
            <span><strong>Corrupção Interna:</strong> ${k.corruption}%</span> | 
            <span><strong>Religião:</strong> ${k.religion}</span>
          </div>
          <h5 class="mt-3">Estado Diplomático com outros Reinos:</h5>
          <ul class="diplomacy-list mt-1">
      `;

      for (const [targetId, state] of Object.entries(k.diplomacy)) {
        const targetK = km.getKingdom(targetId);
        html += `<li><strong>vs ${targetK ? targetK.name : targetId}:</strong> <span class="state-pill ${state.toLowerCase().replace(/\s+/g, '-')}">${state}</span></li>`;
      }

      html += `
          </ul>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  /* --- ABA: GUILDAS COM RETRATOS E EMBLEMAS --- */
  renderGuilds() {
    const container = document.getElementById("guilds-container");
    if (!container || !window.guildsManager) return;

    const gm = window.guildsManager;
    const guilds = gm.getAllGuilds();

    let html = `
      <div class="guilds-layout">
        <div class="ornate-card guilds-header mb-4">
          <h3>${window.Icons?.guilds || ''} As 5 Grandes Guildas e Companheiros de Jornada</h3>
          <p>Membros ativos de guilda têm acesso a lojas secretas e companheiros de combate.</p>
        </div>
        <div class="guilds-grid">
    `;

    guilds.forEach(g => {
      const isMember = gm.playerJoinedGuilds.includes(g.id);
      const isExpelled = window.flagsManager && window.flagsManager.getFlag(`flag_expulso_${g.id}`);
      const currentRankName = g.hierarchy[g.currentRankIndex];

      const crestMap = {
        guild_ferro: "assets/guilds/crest_ferro.jpg",
        guild_valen: "assets/guilds/crest_valen.jpg",
        guild_corvo: "assets/guilds/crest_corvo.jpg",
        guild_aurea: "assets/guilds/crest_aurea.jpg",
        guild_escama: "assets/guilds/crest_escama.jpg"
      };
      const crestImg = crestMap[g.id] || "assets/guilds/crest_ferro.jpg";

      html += `
        <div class="ornate-card guild-card ${isMember ? 'active-guild' : ''}">
          <div class="guild-crest-box d-flex align-items-center mb-2" style="display:flex; gap:14px; align-items:center;">
            <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(crestImg) : crestImg}" data-orig-src="${crestImg}" onerror="window.handleImageError(this, 'guild')" alt="${g.name}" style="width:64px; height:64px; border-radius:8px; border:2px solid var(--border-glow); object-fit:cover;"/>
            <div class="g-top flex-grow-1" style="flex:1;">
              <h4>${g.name} <small>(${g.category})</small></h4>
              <span class="guild-rep-badge">Reputação: ${g.reputation}</span>
            </div>
          </div>
          <p class="g-desc mt-1">${g.description}</p>
          <p class="g-rank mt-2"><strong>Seu Cargo:</strong> ${isMember ? currentRankName : (isExpelled ? '<span class="sick-alert">EXPULSO/BANIDO</span>' : 'Não-Membro')}</p>
          
          <div class="guild-actions-row mt-3">
            ${!isMember && !isExpelled ? `<button class="action-btn small primary" onclick="window.guildsManager.joinGuild('${g.id}')">Entrar na Guilda</button>` : ''}
            ${isMember && g.companion ? `<button class="action-btn small" onclick="window.guildsManager.recruitCompanion('${g.id}')">Recrutar: ${g.companion.name}</button>` : ''}
            ${isMember && g.canElectLeader && g.currentRankIndex >= g.hierarchy.length - 2 ? `<button class="action-btn small danger" onclick="window.guildsManager.attemptCoup('${g.id}')">⚡ Golpe Interno de Liderança</button>` : ''}
            ${isMember && g.canBetray ? `<button class="action-btn small danger" onclick="window.guildsManager.betrayGuild('${g.id}')">🗡️ Trair por Ouro (+350 Ouro)</button>` : ''}
          </div>

          <h5 class="mt-3">Loja Exclusiva da Guilda:</h5>
          <div class="shop-list mt-1">
      `;

      g.exclusiveShop.forEach(shopItem => {
        const tmpl = window.inventoryManager.getItemTemplate(shopItem.id) || window.inventoryManager.getWeaponTemplate(shopItem.id) || window.inventoryManager.getArmorTemplate(shopItem.id);
        if (!tmpl) return;
        html += `
          <div class="shop-row">
            <span><strong>${tmpl.name}</strong> (Requer: ${g.hierarchy[shopItem.reqRank]})</span>
            <button class="action-btn small primary" onclick="window.guildsManager.buyFromExclusiveShop('${g.id}', '${shopItem.id}')">Comprar (${shopItem.price} ouro)</button>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  /* --- ABA: MERCADO, ALQUIMIA E DIÁLOGOS DE FOGUEIRA --- */
  renderMarketAndCrafting() {
    const container = document.getElementById("market-container");
    if (!container || !window.economyManager || !window.craftingManager) return;

    const em = window.economyManager;
    const cm = window.craftingManager;
    const cmps = window.companionsManager ? window.companionsManager.getActiveCompanionObjects() : [];
    const recipes = cm.getRecipes();

    let html = `
      <div class="market-craft-layout">
        <!-- DIÁLOGOS AO REDOR DA FOGUEIRA -->
        <div class="companion-campfire-section mb-4">
          <div class="companion-campfire-card">
            <div class="d-flex justify-content-between align-items-center mb-2" style="display:flex; justify-content:space-between; align-items:center;">
              <h3>⛺ Diálogos ao Redor da Fogueira e Lealdade</h3>
              <span class="badge species-badge">Companheiros no Grupo: ${cmps.length}</span>
            </div>
            <p>À noite, quando as chamas crepitam e o dragão dorme, seus aliados compartilham suas dúvidas e memórias.</p>

            ${cmps.length === 0 ? `
              <div class="companion-chat-box mt-3 text-center" style="opacity:0.8;">
                <p><em>Você não possui companheiros recrutados no momento. Visite a aba de Guildas para chamar aliados para a sua jornada!</em></p>
              </div>
            ` : `
              <div class="companion-chat-grid mt-3">
                ${cmps.map(c => {
                  const compObj = window.companionsManager?.getCompanionById(c.id) || c;
                  const activeDlg = compObj.dialogues?.[compObj.unlockedLoreLevel || 0] || compObj.dialogues?.[0];
                  return `
                    <div class="companion-chat-box">
                      <div style="display:flex; gap:14px; align-items:center;">
                        <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(compObj.portrait || 'assets/portraits/borin.jpg') : (compObj.portrait || 'assets/portraits/borin.jpg')}" data-orig-src="${compObj.portrait || 'assets/portraits/borin.jpg'}" onerror="window.handleImageError(this, 'portrait')" alt="${compObj.name}" style="width:70px; height:70px; border-radius:6px; border:2px solid #fbbf24; object-fit:cover;"/>
                        <div style="flex:1;">
                          <h4>${compObj.name} <small style="font-size:12px; color:#fbbf24;">(${compObj.bonus})</small></h4>
                          <span class="rep-badge">Lealdade com você: <strong>${compObj.loyalty}%</strong></span>
                        </div>
                      </div>
                      ${activeDlg ? `
                        <div class="dlg-prompt mt-3" style="background:rgba(0,0,0,0.5); padding:12px; border-radius:6px; border-left:3px solid #f59e0b;">
                          <small style="color:#94a3b8; display:block;">[Cena de Fogueira]: ${activeDlg.prompt}</small>
                          <p class="mt-2" style="font-weight:600; color:#fef3c7;">"${activeDlg.question}"</p>
                          <div class="dlg-choices mt-3" style="display:flex; flex-direction:column; gap:8px;">
                            ${activeDlg.choices.map((ch, idx) => `
                              <button class="scroll-choice-btn" style="font-size:13px;" onclick="window.companionsManager.modifyLoyalty('${compObj.id}', ${ch.loyaltyMod}); window.ui.showModalAlert('${compObj.name} responde:', '<p style=\\'font-size:15px; font-style:italic;\\'>\\'${ch.reply}\\'</p>'); if (compObj.unlockedLoreLevel < (compObj.dialogues.length - 1)) { compObj.unlockedLoreLevel++; } window.ui.updateAllPanels();">
                                <span class="scroll-ribbon">◈</span> ${ch.text}
                              </button>
                            `).join('')}
                          </div>
                        </div>
                      ` : `
                        <p class="mt-3" style="font-style:italic; opacity:0.8;">"${compObj.name} acena para você em respeito junto ao fogo. Vocês compartilham o silêncio da noite."</p>
                      `}
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- ALQUIMIA E FORJA -->
        <div class="crafting-section">
          <div class="ornate-card mb-3">
            <h3>🧪 Acampamento, Alquimia e Forja Rúnica</h3>
            <p>Utilize minérios, ervas de Lúmen e cristais para confeccionar suprimentos essenciais ou acampar com segurança.</p>
          </div>
          <div class="recipes-grid">
    `;

    recipes.forEach(r => {
      const check = cm.canCraft(r.id);
      html += `
        <div class="ornate-card recipe-card ${check.can ? 'ready' : 'missing'}">
          <h4>${r.name} <small>(${r.category})</small></h4>
          <p class="recipe-desc mt-1">${r.description}</p>
          <p class="ingredients-list mt-2"><strong>Ingredientes:</strong> ${Object.entries(r.ingredients).map(([id, cnt]) => `${cnt}x ${window.inventoryManager.getItemTemplate(id)?.name || id}`).join(', ')} ${r.goldCost ? '| + ' + r.goldCost + ' ouro' : ''}</p>
          <button class="action-btn primary small mt-3" onclick="window.craftingManager.craft('${r.id}')" ${!check.can ? 'disabled' : ''}>Confeccionar / Executar</button>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="market-section mt-4">
          <div class="ornate-card mkt-header mb-3">
            <h3>⚖️ Mercado Ambulante e Comércio Regional</h3>
            <span>Taxa de Inflação: <strong>${Math.floor(em.inflationRate * 100)}%</strong> | Seu Ouro: <strong>${window.inventoryManager?.gold || 0}</strong></span>
          </div>
          ${em.travelingMerchantPresent ? `
            <div class="merchant-shop-grid">
          ` : '<div class="ornate-card"><p>O Mercador Ambulante viajou para outra região. Tente avançar um dia ou acampar.</p></div>'}
    `;

    if (em.travelingMerchantPresent) {
      em.travelingMerchantInventory.forEach(item => {
        const tmpl = window.inventoryManager.getItemTemplate(item.id);
        if (!tmpl) return;
        const price = em.getBuyPrice(tmpl);
        html += `
          <div class="ornate-card shop-item-card">
            <div class="sic-top">
              <strong>${tmpl.name}</strong>
              <span>Estoque: ${item.stock}</span>
            </div>
            <p class="item-desc mt-1">${tmpl.description}</p>
            <div class="sic-actions mt-2">
              <button class="action-btn small primary" onclick="window.economyManager.buyItem('${item.id}', 1)">Comprar 1x (${price} ouro)</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div></div>`;
    container.innerHTML = html;
  }

  /* --- ABA: MISSÕES E DIÁRIO DE AVENTUREIRO --- */
  renderQuests() {
    const container = document.getElementById("quests-container");
    if (!container || !window.questManager) return;

    const qm = window.questManager;
    const all = qm.getAllQuests();
    const dc = window.delayedConsequences;

    let html = `
      <div class="quests-layout">
        <div class="quests-section">
          <div class="ornate-card mb-3">
            <h3>${window.Icons?.quests || ''} Missões Disponíveis e Crônicas Ativas</h3>
            <p>Escolhas com pergaminhos ornamentados. Lembre-se: não há opções perfeitas.</p>
          </div>
          <div class="quests-list">
    `;

    all.forEach(q => {
      if (q.status === "locked") return;
      
      let portraitSrc = "assets/portraits/alden.jpg";
      if (q.id === "q_peasant_revolt") portraitSrc = "assets/portraits/lyra.jpg";
      else if (q.id === "q_khaz_secret") portraitSrc = "assets/portraits/thalor.jpg";

      html += `
        <div class="ornate-card quest-card ${q.status}">
          <div class="quest-with-portrait">
            <div class="quest-giver-portrait">
              <img src="${portraitSrc}" alt="Giver" class="quest-npc-img"/>
            </div>
            <div class="quest-main-info">
              <div class="q-top">
                <h4>${q.title} <small>(Origem: ${q.giver})</small></h4>
                <span class="status-badge ${q.status}">${q.status === 'completed' ? '✔ Concluída' : (q.status === 'active' ? '⚡ Ativa' : 'Disponível')}</span>
              </div>
              <p class="q-desc mt-1">${q.description}</p>
              ${q.status === 'available' ? `<button class="action-btn primary small mt-2" onclick="window.questManager.acceptQuest('${q.id}')">Aceitar Missão</button>` : ''}
            </div>
          </div>
          
          ${q.status === 'active' ? `
            <div class="q-choices-box mt-3">
              <h5>Escolhas de Destino e Consequência:</h5>
              ${q.choices.map((ch, idx) => `
                <button class="scroll-choice-btn" onclick="window.questManager.completeQuestChoice('${q.id}', ${idx})" onmouseenter="window.audioManager?.play('hover')">
                  <span class="scroll-ribbon">◈</span> ${ch.text}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <div class="journal-section mt-4">
          <div class="ornate-card mb-3">
            <h3>📖 Diário de Decisões Passadas e Consequências Tardias</h3>
            <p>Registros indeléveis de suas ações. O tempo trará a cobrança.</p>
          </div>
          <div class="memory-log-list">
    `;

    if (dc && dc.pastDecisionsLog.length > 0) {
      dc.pastDecisionsLog.forEach(log => {
        html += `
          <div class="ornate-card memory-entry">
            <span class="log-date">${log.day}:</span> <strong>${log.title}</strong>
            <p class="mt-1">${log.details}</p>
          </div>
        `;
      });
    } else {
      html += `<div class="ornate-card"><p>Nenhuma decisão dramática com efeitos de longo prazo registrada ainda.</p></div>`;
    }

    html += `</div></div></div>`;
    container.innerHTML = html;
  }

  /* --- ABA: AUDITOR DE FLAGS --- */
  renderAudit() {
    const container = document.getElementById("audit-container");
    if (!container || !window.flagsManager) return;

    const fm = window.flagsManager;
    const list = fm.getAuditList();

    let html = `
      <div class="audit-layout">
        <div class="ornate-card audit-header mb-4">
          <h3>${window.Icons?.audit || ''} Auditor de Flags em Tempo Real (Princípio Fundamental)</h3>
          <p>Todo evento, missão e reação no mundo verifica este banco de dados antes de acontecer.</p>
          <div class="audit-filter-box mt-3">
            <input type="text" id="audit-filter-input" placeholder="Filtrar por nome de flag (ex: magia, dragao, rei)..." oninput="window.ui.filterAuditList(this.value)">
            <button class="action-btn small primary" onclick="window.ui.renderAudit()">Atualizar Auditor</button>
          </div>
        </div>

        <div class="flags-grid" id="flags-audit-grid">
    `;

    list.forEach(f => {
      html += `
        <div class="flag-item">
          <span class="flag-key">${f.key}</span>
          <span class="flag-val ${typeof f.value === 'boolean' ? (f.value ? 'bool-true' : 'bool-false') : ''}">${JSON.stringify(f.value)}</span>
        </div>
      `;
    });

    html += `
        </div>
        
        <div class="ornate-card mt-4">
          <h4>Histórico Recente de Mudanças de Flags</h4>
          <div class="flag-history-log mt-2">
            ${fm.history.slice(-15).reverse().map(h => `
              <div class="history-entry">
                <small>[${h.timestamp.split('T')[1].split('.')[0]}]</small> <strong>${h.key}</strong> mudou de <em>${JSON.stringify(h.oldValue)}</em> para <strong>${JSON.stringify(h.newValue)}</strong> <small>(${h.reason})</small>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  filterAuditList(query) {
    const grid = document.getElementById("flags-audit-grid");
    if (!grid || !window.flagsManager) return;
    const list = window.flagsManager.getAuditList(query);
    grid.innerHTML = list.map(f => `
      <div class="flag-item">
        <span class="flag-key">${f.key}</span>
        <span class="flag-val ${typeof f.value === 'boolean' ? (f.value ? 'bool-true' : 'bool-false') : ''}">${JSON.stringify(f.value)}</span>
      </div>
    `).join('');
  }

  /* --- ABA: SAVE E CRÔNICA --- */
  renderSave() {
    const container = document.getElementById("save-container");
    if (!container || !window.saveManager) return;

    const sm = window.saveManager;
    const slots = sm.getSavedSlotsInfo();

    let html = `
      <div class="save-layout">
        <div class="ornate-card mb-4">
          <h3>${window.Icons?.save || ''} Salvar, Carregar e Exportar Crônica</h3>
          <p>Sua campanha pode ser salva em slots locais ou exportada/importada como um arquivo JSON para qualquer dispositivo.</p>
        </div>
        <div class="save-slots-grid">
    `;

    slots.forEach(st => {
      html += `
        <div class="ornate-card save-slot-card ${st.exists ? 'filled' : 'empty'}">
          <h4>${st.slot.replace('_', ' ').toUpperCase()}</h4>
          ${st.exists ? `
            <p class="mt-1"><strong>Nível:</strong> ${st.level} | <strong>Ouro:</strong> ${st.gold}</p>
            <p><strong>Título:</strong> ${st.title}</p>
            <small>Salvo em: ${st.timestamp}</small>
            <div class="slot-buttons mt-3">
              <button class="action-btn small primary" onclick="window.saveManager.saveGameToSlot('${st.slot}')">Sobrescrever Save</button>
              <button class="action-btn small secondary" onclick="window.saveManager.loadGameFromSlot('${st.slot}')">Carregar Este Save</button>
            </div>
          ` : `
            <p class="mt-1">Espaço Vazio</p>
            <button class="action-btn small primary mt-3" onclick="window.saveManager.saveGameToSlot('${st.slot}')">Salvar Aqui</button>
          `}
        </div>
      `;
    });

    html += `
        </div>

        <div class="ornate-card export-import-box mt-4">
          <h4>Exportação / Importação de JSON e Epílogo</h4>
          <div class="ei-buttons mt-3">
            <button class="action-btn primary" onclick="window.saveManager.exportSaveFile()">📤 Exportar Campanha em JSON (Download)</button>
            <label class="action-btn secondary upload-btn">
              📥 Importar Campanha de JSON
              <input type="file" id="file-import-json" accept=".json" style="display: none;" onchange="window.saveManager.importSaveFile(this)">
            </label>
            <button class="action-btn danger" onclick="window.endingsManager.triggerRetirementEnding()">👑 Reclamar Destino e Ver Epílogo Final</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /* --- MODAIS DE EVENTO E ALERTA COM PERGAMINHOS --- */
  showEventModal(eventObj) {
    if (!eventObj) return;
    const modal = document.getElementById("modal-event");
    if (!modal) return;

    document.getElementById("ev-title").textContent = eventObj.title;
    document.getElementById("ev-desc").textContent = eventObj.description;

    const choicesBox = document.getElementById("ev-choices");
    choicesBox.innerHTML = eventObj.choices.map((ch, idx) => `
      <button class="scroll-choice-btn" onclick="window.eventsEngine.resolveChoice(${idx})" onmouseenter="window.audioManager?.play('hover')">
        <span class="scroll-ribbon">◈</span> ${ch.text}
      </button>
    `).join('');

    modal.classList.add("active");
    this.playSound("dramatic_chord");
  }

  closeEventModal() {
    const modal = document.getElementById("modal-event");
    if (modal) modal.classList.remove("active");
  }

  showModalAlert(title, htmlContent, btnText = "Continuar", onConfirm = null) {
    const modal = document.getElementById("modal-alert");
    if (!modal) return;

    document.getElementById("alert-title").textContent = title;
    document.getElementById("alert-body").innerHTML = htmlContent;

    const btn = document.getElementById("alert-confirm-btn");
    if (btn) {
      btn.textContent = btnText;
      btn.onclick = () => {
        modal.classList.remove("active");
        if (onConfirm) onConfirm();
      };
    }

    modal.classList.add("active");
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container || typeof container.appendChild !== "function") return;

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  playSound(name) {
    if (window.audioManager) window.audioManager.play(name);
  }

  /* --- MODO DE COMBATE TÁTICO AAA --- */
  showCombatView() {
    const overlay = document.getElementById("combat-overlay");
    if (overlay) overlay.classList.add("active");
    if (window.audioManager) window.audioManager.playRegionalMusic("combate");
    this.updateCombatView();
  }

  closeCombatView() {
    const overlay = document.getElementById("combat-overlay");
    if (overlay) overlay.classList.remove("active");
    const loc = window.mapManager ? window.mapManager.getCurrentLocation() : null;
    this.updateBackgroundByLocation(loc);
  }

  updateCombatView() {
    if (!window.combatManager || !window.combatManager.inCombat || !window.combatManager.enemy) return;
    const cm = window.combatManager;
    const en = cm.enemy;

    const nameEl = document.getElementById("cmb-enemy-name");
    if (nameEl) nameEl.textContent = en.name;
    const hpEl = document.getElementById("cmb-enemy-hp");
    if (hpEl) hpEl.textContent = `${en.hp} / ${en.maxHp} HP`;
    const hpBar = document.getElementById("cmb-enemy-hp-bar");
    if (hpBar) hpBar.style.width = `${(en.hp / en.maxHp) * 100}%`;
    const descEl = document.getElementById("cmb-enemy-desc");
    if (descEl) descEl.textContent = en.desc;
    const moraleEl = document.getElementById("cmb-enemy-morale");
    if (moraleEl) moraleEl.textContent = `Moral Inimiga: ${en.morale}% | Defesa Fís: ${en.defense}`;

    this.updateCombatLog();
  }

  updateCombatLog() {
    const logBox = document.getElementById("cmb-log-box");
    if (!logBox || !window.combatManager) return;
    logBox.innerHTML = window.combatManager.combatLog.map(l => `
      <div class="log-entry ${l.type}">
        <span class="turn-tag">[Turno ${l.turn}]</span> ${l.message}
      </div>
    `).join('');
  }
}

window.ui = new UIManager();
