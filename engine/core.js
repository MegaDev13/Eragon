/**
 * Crônica de Aethelgard - Núcleo Principal da Engine do Jogo (core.js)
 * Conecta todos os gerenciadores, inicializa o mundo, processa o ciclo de vida e alterna painéis.
 */

class CoreEngine {
  constructor() {
    this.isLoaded = false;
    this.dataRegistry = {};
  }

  /**
   * Ponto de entrada chamado após o carregamento das páginas e scripts
   */
  async initGame() {
    console.log("[CoreEngine] Inicializando Crônica de Aethelgard...");

    if (window.liveUpdater) {
      window.liveUpdater.applyCachedUpdatesIfPresent();
      window.liveUpdater.init();
    }

    // Carregar ou vincular o Data Registry (carregado via data_loader.js ou fetch)
    if (window.DATA_REGISTRY) {
      this.dataRegistry = window.DATA_REGISTRY;
      this.setupManagers(this.dataRegistry);
    } else {
      console.warn("[CoreEngine] DATA_REGISTRY não pré-carregado. Tentando carregar via fetch...");
      try {
        await this.loadDataViaFetch();
      } catch (e) {
        console.error("[CoreEngine] Falha ao carregar via fetch. Usando dados embarcados de contingência:", e);
      }
    }

    if (window.audioManager) window.audioManager.init();

    // Checar se há save automático prévio
    const hasAutoSave = localStorage.getItem("aethelgard_auto");
    if (hasAutoSave && window.saveManager) {
      console.log("[CoreEngine] Save automático encontrado na memória local.");
    } else {
      // Inicializar novo jogo
      this.startNewCampaign();
    }

    // Configurar temporizador de auto-save a cada 60 segundos
    setInterval(() => {
      if (this.isLoaded && window.saveManager && window.saveManager.autoSaveEnabled) {
        window.saveManager.autoSave();
      }
    }, 60000);

    this.isLoaded = true;
    if (window.ui) {
      window.ui.initUI();
      window.ui.changeTab("map");
      window.ui.updateAllPanels();
    }
  }

  setupManagers(data) {
    if (window.flagsManager) window.flagsManager.init(data.flags_db?.initial_flags || {});
    if (window.attributesManager) window.attributesManager.init();
    if (window.hiddenAttributesManager) window.hiddenAttributesManager.init();
    if (window.calendarManager) window.calendarManager.init();
    if (window.mapManager) window.mapManager.init(data.locations_db);
    if (window.kingdomsManager) window.kingdomsManager.init(data.kingdoms_db);
    if (window.npcsManager) window.npcsManager.init(data.npcs_db);
    if (window.delayedConsequences) window.delayedConsequences.init();
    if (window.dragonManager) window.dragonManager.init(data.dragons_db);
    if (window.magicManager) window.magicManager.init(data.spells_db);
    if (window.inventoryManager) window.inventoryManager.init(data.items_db);
    if (window.skillsManager) window.skillsManager.init(data.skills_db);
    if (window.guildsManager) window.guildsManager.init(data.guilds_db);
    if (window.economyManager) window.economyManager.init();
    if (window.questManager) window.questManager.init(data.quests_db);
    if (window.eventsEngine) window.eventsEngine.init([data.events_main, data.events_exploration, data.events_political]);
    if (window.narrativeEngine) window.narrativeEngine.init(data.narrative_db);
    if (window.romanceManager) window.romanceManager.init(data.romance_db);
    if (window.bestiaryManager) window.bestiaryManager.init(data.bestiary_db);
    if (window.companionsManager) window.companionsManager.init();
    if (window.partyManager) window.partyManager.init();

    // NOVOS SISTEMAS DE PROGRESSÃO ORGÂNICA
    if (window.discoveryManager) window.discoveryManager.init();
    if (window.affinityManager) window.affinityManager.init();
    if (window.explorationEngine) window.explorationEngine.init();

    // MUNDO VIVO AUTÔNOMO + ROTINAS + AVENTUREIROS
    if (window.worldSimulationManager) window.worldSimulationManager.init();
    if (window.npcRoutineManager) window.npcRoutineManager.init();
    if (window.adventurersManager) window.adventurersManager.init();
    if (window.chronicleBook) window.chronicleBook.init();

    if (window.combatVFX) window.combatVFX.initCanvas();
  }

  async loadDataViaFetch() {
    const [flags, locs, kings, npcs, drak, spell, items, skills, guilds, quests, evMain, evExp, evPol] = await Promise.all([
      fetch('flags/flags_db.json').then(r => r.json()),
      fetch('assets/locations.json').then(r => r.json()),
      fetch('assets/kingdoms.json').then(r => r.json()),
      fetch('assets/npcs.json').then(r => r.json()),
      fetch('dragons/dragons_db.json').then(r => r.json()),
      fetch('magic/spells_db.json').then(r => r.json()),
      fetch('items/items_db.json').then(r => r.json()),
      fetch('skills/skills_db.json').then(r => r.json()),
      fetch('guilds/guilds_db.json').then(r => r.json()),
      fetch('quests/quests_db.json').then(r => r.json()),
      fetch('events/events_main.json').then(r => r.json()),
      fetch('events/events_exploration.json').then(r => r.json()),
      fetch('events/events_political.json').then(r => r.json())
    ]);

    this.dataRegistry = {
      flags_db: flags,
      locations_db: locs,
      kingdoms_db: kings,
      npcs_db: npcs,
      dragons_db: drak,
      spells_db: spell,
      items_db: items,
      skills_db: skills,
      guilds_db: guilds,
      quests_db: quests,
      events_main: evMain,
      events_exploration: evExp,
      events_political: evPol
    };
    window.DATA_REGISTRY = this.dataRegistry;
    this.setupManagers(this.dataRegistry);
  }

  startNewCampaign(customOptions = {}) {
    console.log("[CoreEngine] Iniciando nova campanha da Crônica de Aethelgard... (Progressão Orgânica)");

    if (window.DATA_REGISTRY) {
      this.setupManagers(window.DATA_REGISTRY);
    }

    // === NOVA PROGRESSÃO: Início Humilde ===
    // O jogador começa como um exilado/refugiado sem nada.
    if (window.discoveryManager) {
      window.discoveryManager.init(); // Começa com apenas a região inicial
    }
    if (window.affinityManager) {
      window.affinityManager.init();
    }
    if (window.explorationEngine) {
      window.explorationEngine.init();
    }

    // Começa com kit mínimo
    if (window.inventoryManager) {
      window.inventoryManager.gold = 18; // Poucas moedas
      window.inventoryManager.addItem('ration_food', 3);
      // arma simples já deve existir no inventário inicial via criação
    }

    if (window.mapManager) {
      window.mapManager.currentLocationId = "loc_vale_cinzas"; // Começa no Vale
      window.mapManager.exploredLocations = ["loc_vale_cinzas"];
    }

    // Nenhuma guilda, escola ou NPC importante descoberto ainda
    if (window.flagsManager) {
      window.flagsManager.setFlag("humble_origin", true, "Início da Jornada");
      window.flagsManager.setFlag("player_fame", 0, "Início");
    }

    if (customOptions.permadeath && window.flagsManager) {
      window.flagsManager.setFlag("permadeath_active", true, "Criação do Personagem");
    }

    if (window.ui) {
      window.ui.showToast("Você acorda no Vale das Cinzas... sem nome, sem aliados, sem fama. Tudo ainda precisa ser conquistado.", "info");
      window.ui.updateAllPanels();
    }
  }

  resetGame() {
    localStorage.removeItem("aethelgard_auto");
    this.startNewCampaign();
  }
}

window.Game = new CoreEngine();
