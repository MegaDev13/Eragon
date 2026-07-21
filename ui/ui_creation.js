/**
 * Crônica de Aethelgard - Tela de Personalização e Criação do Personagem (ui_creation.js)
 * Permite definir nome, retrato, origem, alocar os 25 pontos iniciais de atributo e escolher o ovo do dragão.
 */

class CreationManager {
  constructor() {
    this.charName = "Aethel o Cavaleiro das Cinzas";
    this.selectedPortrait = "assets/portraits/lyra.jpg";
    this.selectedOriginId = "origin_hunter";
    this.selectedDragonSpeciesId = "dragon_ignis";
    this.permadeath = false;

    this.tempPoints = 25;
    this.tempAttributes = {
      forca: 10, destreza: 10, inteligencia: 10, sabedoria: 10, carisma: 10,
      constituicao: 10, vontade: 10, percepcao: 10, sorte: 10, afinidadeMagica: 10,
      dominioElemental: 10, dominioMarcial: 10, lideranca: 10, empatia: 10,
      furtividade: 10, precisao: 10, resistenciaMental: 10, resistenciaFisica: 10
    };

    this.origins = [
      {
        id: "origin_noble",
        name: "👑 Nobre Caído do Reino de Eldor",
        desc: "Educado na corte palaciana e treinado em cavalaria pesada. Bônus em Força (+3) e Liderança (+3), além de +150 moedas de ouro iniciais.",
        attrMods: { forca: 3, lideranca: 3 },
        bonusGold: 150,
        startItems: { "w_longsword": 1, "a_iron_plate": 1 }
      },
      {
        id: "origin_scholar",
        name: "⚡ Arcanista Banido do Círculo de Valen",
        desc: "Mestre nos pergaminhos e teorias arcanas. Bônus em Inteligência (+4) e Afinidade Mágica (+2), além de feitiço Bola de Fogo já destravado.",
        attrMods: { inteligencia: 4, afinidadeMagica: 2 },
        bonusGold: 50,
        startItems: { "a_runic_vest": 1, "potion_willpower": 3 }
      },
      {
        id: "origin_hunter",
        name: "🐺 Caçador e Sobrevivente do Vale das Cinzas",
        desc: "Acostumado à solidão e aos perigos dos ermos. Bônus em Destreza (+3), Furtividade (+3) e Sorte (+2), com rações extras e adaga letal.",
        attrMods: { destreza: 3, furtividade: 3, sorte: 2 },
        bonusGold: 80,
        startItems: { "w_dagger": 1, "w_bow": 1, "ration_food": 12 }
      },
      {
        id: "origin_pilgrim",
        name: "🔥 Peregrino e Forjador de Solgard",
        desc: "Endurecido pelo deserto de obsidiana e pelas forjas alquímicas. Bônus em Constituição (+4) e Domínio Marcial (+2), com lança e ferramentaria.",
        attrMods: { constituicao: 4, dominioMarcial: 2 },
        bonusGold: 100,
        startItems: { "w_spear": 1, "mat_iron_ingot": 4 }
      }
    ];

    this.portraitsList = [
      { name: "Cavaleira / Rainha (Lyra)", path: "assets/portraits/lyra.jpg" },
      { name: "Capitã da Guarda (Vespera)", path: "assets/portraits/vespera.jpg" },
      { name: "Mestre Mercador (Alden)", path: "assets/portraits/alden.jpg" },
      { name: "Grão-Arquimago (Thalor)", path: "assets/portraits/thalor.jpg" },
      { name: "Forjador Rúnico (Borin)", path: "assets/portraits/borin.jpg" },
      { name: "Lâmina Sombria (Kaelen)", path: "assets/portraits/kaelen.jpg" },
      { name: "Ancião Druida (Orin)", path: "assets/portraits/orin.jpg" }
    ];

    this.dragonsList = [
      { id: "dragon_ignis", name: "Ignis Aurum - Dragão de Fogo Dourado", desc: "Temperamento Indomável e Protetor. Sopro Incandescente.", img: "assets/dragons/ignis_aurum.jpg" },
      { id: "dragon_zephyr", name: "Zephyr Caeruleum - Dragão de Ar e Tempestade", desc: "Temperamento Sábio e Veloz. Relâmpagos Cortantes.", img: "assets/dragons/zephyr_caeruleum.jpg" },
      { id: "dragon_terra", name: "Terra Basalt - Dragão de Basalto e Cristal", desc: "Temperamento Estóico e Inabalável. Carapaça Mineral.", img: "assets/dragons/terra_basalt.jpg" },
      { id: "dragon_umbra", name: "Umbra Noctis - Dragão das Sombras Primordiais", desc: "Temperamento Feroz e Enigmático. Sopro de Fogo-Negro.", img: "assets/dragons/umbra_noctis.jpg" },
      { id: "dragon_sylva", name: "Sylva Viridis - Dragão da Natureza Druídica", desc: "Temperamento Pacífico e Curador. Simbiose Vegetal.", img: "assets/dragons/sylva_viridis.jpg" }
    ];
  }

  showCreationScreen() {
    document.getElementById("home-screen")?.classList.remove("active");
    document.getElementById("game-shell")?.classList.remove("active");
    document.getElementById("creation-screen")?.classList.add("active");
    if (window.audioManager) window.audioManager.play("menu_open");
    this.renderCreationScreen();
  }

  hideCreationScreen() {
    document.getElementById("creation-screen")?.classList.remove("active");
  }

  renderCreationScreen() {
    const container = document.getElementById("creation-content");
    if (!container) return;

    let html = `
      <div class="creation-layout">
        <div class="creation-top-bar">
          <h2>🛡️ PERSONALIZAÇÃO E CRIAÇÃO DO CAVALEIRO DAS CINZAS</h2>
          <button class="action-btn small secondary" onclick="window.ui.showHomeScreen()">🏠 Voltar à Tela Inicial</button>
        </div>

        <div class="creation-sections-grid mt-3">
          <!-- SEÇÃO 1: NOME E RETRATO -->
          <div class="ornate-card creation-section">
            <h4>1. Nome e Aparência do Cavaleiro</h4>
            <div class="mt-2">
              <label style="font-size:12px; color:#fbbf24;">Nome Completo na Crônica:</label>
              <input type="text" id="creation-name-input" value="${this.charName}" oninput="window.creationManager.charName = this.value" class="inv-search-field mt-1"/>
            </div>

            <label class="mt-3 d-block" style="font-size:12px; color:#fbbf24; display:block;">Selecione o Retrato de Pintura Digital:</label>
            <div class="portraits-picker-grid mt-2">
              ${this.portraitsList.map(p => `
                <div class="portrait-choice-box ${this.selectedPortrait === p.path ? 'active' : ''}" onclick="window.creationManager.selectedPortrait = '${p.path}'; window.audioManager?.play('click'); window.creationManager.renderCreationScreen();">
                  <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(p.path) : p.path}" data-orig-src="${p.path}" onerror="window.handleImageError(this, 'portrait')" alt="${p.name}" class="portrait-img-preview"/>
                  <span>${p.name.split(' ')[0]}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SEÇÃO 2: ORIGEM DO CAVALEIRO -->
          <div class="ornate-card creation-section">
            <h4>2. Origem e Passado em Aethelgard</h4>
            <div class="origins-list mt-2">
              ${this.origins.map(orig => `
                <div class="origin-choice-card ${this.selectedOriginId === orig.id ? 'active' : ''}" onclick="window.creationManager.selectedOriginId = '${orig.id}'; window.audioManager?.play('click'); window.creationManager.renderCreationScreen();">
                  <strong>${orig.name}</strong>
                  <p class="mt-1" style="font-size:12.5px;">${orig.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="creation-sections-grid mt-3">
          <!-- SEÇÃO 3: DISTRIBUIÇÃO DOS 25 PONTOS DE ATRIBUTO -->
          <div class="ornate-card creation-section">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h4>3. Alocação dos Atributos Iniciais</h4>
              <span class="badge species-badge" style="font-size:13px;">Pontos Disponíveis: <strong>${this.tempPoints}</strong></span>
            </div>
            <p style="font-size:12px; opacity:0.8;">Distribua com sabedoria entre força física, agilidade, perícia arcana e liderança.</p>
            
            <div class="creation-attrs-grid mt-2">
              ${Object.entries(this.tempAttributes).map(([key, val]) => {
                const labels = {
                  forca: "Força", destreza: "Destreza", inteligencia: "Inteligência", sabedoria: "Sabedoria",
                  carisma: "Carisma", constituicao: "Constituição", vontade: "Vontade", percepcao: "Percepção",
                  sorte: "Sorte", afinidadeMagica: "Afinidade Mágica", dominioElemental: "Domínio Elemental",
                  dominioMarcial: "Domínio Marcial", lideranca: "Liderança", empatia: "Empatia",
                  furtividade: "Furtividade", precisao: "Precisão", resistenciaMental: "Resistência Mental",
                  resistenciaFisica: "Resistência Física"
                };
                return `
                  <div class="attr-row-creation">
                    <span style="font-weight:600;">${labels[key]}: <strong>${val}</strong></span>
                    <div>
                      <button class="action-btn small" onclick="window.creationManager.modifyTempAttr('${key}', -1)">-</button>
                      <button class="action-btn small primary" onclick="window.creationManager.modifyTempAttr('${key}', 1)">+</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- SEÇÃO 4: OVO DO DRAGÃO INICIAL E PERMADEATH -->
          <div class="ornate-card creation-section" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <h4>4. O Ovo de Dragão Ancestral Protegido</h4>
              <p style="font-size:12px; opacity:0.8;">Você guarda em sua bolsa de couro o ovo sagrado do dragão que eclodirá em seu peito.</p>
              
              <div class="dragons-creation-list mt-2">
                ${this.dragonsList.map(drk => `
                  <div class="dragon-choice-row ${this.selectedDragonSpeciesId === drk.id ? 'active' : ''}" onclick="window.creationManager.selectedDragonSpeciesId = '${drk.id}'; window.audioManager?.play('click'); window.creationManager.renderCreationScreen();">
                    <img src="${typeof window.getImageUrl === 'function' ? window.getImageUrl(drk.img) : drk.img}" data-orig-src="${drk.img}" onerror="window.handleImageError(this, 'dragon')" alt="${drk.name}" style="width:55px; height:55px; border-radius:6px; object-fit:cover; border:1px solid #fbbf24;"/>
                    <div>
                      <strong>${drk.name}</strong>
                      <p style="font-size:11.5px; opacity:0.8;">${drk.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="permadeath-box mt-3" style="background:rgba(0,0,0,0.4); padding:12px; border-radius:6px; border:1px solid #78350f;">
                <label style="cursor:pointer; display:flex; gap:10px; align-items:center; font-weight:600; color:#fbbf24;">
                  <input type="checkbox" ${this.permadeath ? 'checked' : ''} onchange="window.creationManager.permadeath = this.checked"/>
                  ⚠️ Ativar Modo Sobrevivência Total (Morte Permanente sem Renascimento)
                </label>
              </div>
            </div>

            <div class="creation-footer-actions mt-4 text-center">
              <button class="action-btn primary" style="padding:14px 28px; font-size:16px; width:100%;" onclick="window.creationManager.finalizeCreationAndStart()">
                👑 SELAR DESTINO E INICIAR O PRÓLOGO NARRATIVO
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  modifyTempAttr(key, delta) {
    if (delta > 0 && this.tempPoints > 0) {
      this.tempAttributes[key]++;
      this.tempPoints--;
      if (window.audioManager) window.audioManager.play("click");
      this.renderCreationScreen();
    } else if (delta < 0 && this.tempAttributes[key] > 10) {
      this.tempAttributes[key]--;
      this.tempPoints++;
      if (window.audioManager) window.audioManager.play("click");
      this.renderCreationScreen();
    }
  }

  finalizeCreationAndStart() {
    console.log("[CreationManager] Concluindo criação e iniciando a campanha...");
    this.hideCreationScreen();

    // Inicializar engine com dados base
    window.Game.startNewCampaign({ permadeath: this.permadeath });

    const attr = window.attributesManager;
    const inv = window.inventoryManager;
    const drak = window.dragonManager;
    const hid = window.hiddenAttributesManager;

    // Aplicar atributos alocados
    if (attr) {
      attr.baseAttributes = { ...this.tempAttributes };
      attr.availablePoints = this.tempPoints;
      attr.recalculateDerived();
      attr.currentHP = attr.derived.maxHP;
      attr.currentWillpower = attr.derived.maxWillpower;
    }

    // Aplicar origem
    const chosenOrigin = this.origins.find(o => o.id === this.selectedOriginId) || this.origins[0];
    if (chosenOrigin) {
      if (attr && chosenOrigin.attrMods) {
        for (const [k, v] of Object.entries(chosenOrigin.attrMods)) {
          attr.modifyAttribute(k, v);
        }
      }
      if (inv) {
        inv.gold += chosenOrigin.bonusGold || 0;
        if (chosenOrigin.startItems) {
          for (const [itemId, count] of Object.entries(chosenOrigin.startItems)) {
            if (itemId.startsWith("w_")) inv.addWeapon(itemId);
            else if (itemId.startsWith("a_")) inv.addArmor(itemId);
            else inv.addItem(itemId, count);
          }
        }
      }
    }

    // Aplicar Retrato e Nome
    if (hid) {
      hid.playerTitle = `${this.charName} (${chosenOrigin.name.split(' - ')[0]})`;
    }
    if (window.flagsManager) {
      window.flagsManager.setFlag("player_name", this.charName, "Criação do Personagem");
      window.flagsManager.setFlag("player_portrait", this.selectedPortrait, "Criação do Personagem");
      window.flagsManager.setFlag("player_origin", chosenOrigin.id, "Criação do Personagem");
    }

    // Aplicar Ovo/Dragão
    if (drak) {
      drak.hasDragon = true;
      drak.speciesId = this.selectedDragonSpeciesId;
      drak.stage = "Filhote";
      drak.ageDays = 1;
      drak.bond = 20;
      if (drak.speciesList) {
        drak.speciesData = drak.speciesList.find(s => s.id === drak.speciesId) || drak.speciesList[0];
      }
      drak.name = `Filhote de ${drak.speciesData?.name.split(' - ')[0] || 'Dragão'}`;
    }

    // Abrir o Prólogo na Aba Crônica Principal
    if (window.ui) {
      window.ui.enterGameWorld();
      if (window.narrativeEngine) {
        window.narrativeEngine.startPrologue();
        window.ui.renderStoryScene();
      }
    }
  }
}

window.creationManager = new CreationManager();
