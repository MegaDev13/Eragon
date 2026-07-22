/**
 * Crônica de Aethelgard - Simulador de Mundo Vivo Autônomo (world_simulation.js)
 * O mundo evolui independentemente do jogador.
 * Economia, guerras, clima, produção, colheitas, doenças, crescimento/decadência.
 */

class WorldSimulationManager {
  constructor() {
    this.lastSimulatedDay = 0;
    this.globalEventsLog = [];
    this.cityStates = {}; // { locId: { population, prosperity, production, events } }
    this.tradeRoutes = []; // array of active routes
    this.activePlagues = [];
    this.harvestData = {}; // seasonal
    this.independentAdventurers = []; // populated by adventurers_manager
  }

  init(savedData = null) {
    if (savedData) {
      this.lastSimulatedDay = savedData.lastSimulatedDay || 0;
      this.globalEventsLog = savedData.globalEventsLog || [];
      this.cityStates = savedData.cityStates || {};
      this.tradeRoutes = savedData.tradeRoutes || [];
      this.activePlagues = savedData.activePlagues || [];
      this.harvestData = savedData.harvestData || {};
    } else {
      // Seed initial world state (only for known locations)
      this.initializeBaseWorldStates();
    }
    console.log("[WorldSim] Mundo vivo inicializado. O continente respira sozinho.");
  }

  initializeBaseWorldStates() {
    // Initial humble state: only Vale das Cinzas known
    const baseLocations = ['loc_vale_cinzas', 'loc_eldoria', 'loc_picos_dragao', 'loc_floresta_lumen'];
    baseLocations.forEach(locId => {
      this.cityStates[locId] = {
        population: locId === 'loc_vale_cinzas' ? 180 : (locId === 'loc_eldoria' ? 12400 : 3200),
        prosperity: locId === 'loc_vale_cinzas' ? 28 : 65,
        production: this.getBaseProduction(locId),
        lastUpdated: Date.now(),
        recentEvents: []
      };
    });

    // Seed basic trade routes
    this.tradeRoutes = [
      { from: 'loc_eldoria', to: 'loc_vale_cinzas', goods: ['grain', 'iron'], active: true, lastTrade: 0 },
      { from: 'loc_vale_cinzas', to: 'loc_picos_dragao', goods: ['herbs', 'obsidian'], active: true, lastTrade: 0 }
    ];
  }

  getBaseProduction(locId) {
    const prod = {
      'loc_vale_cinzas': { 'wood': 12, 'herbs': 8, 'ration_food': 5 },
      'loc_eldoria': { 'grain': 85, 'iron': 22, 'leather': 18 },
      'loc_picos_dragao': { 'obsidian_crystal': 6, 'dragon_scale': 1, 'ore': 14 },
      'loc_floresta_lumen': { 'wood': 64, 'herbs': 31, 'fur': 9 }
    };
    return prod[locId] || { 'wood': 10 };
  }

  // Called daily from calendar or core
  simulateWorld(daysPassed = 1) {
    const currentTotalDays = window.calendarManager ? window.calendarManager.getTotalDays() : 1;
    if (currentTotalDays <= this.lastSimulatedDay) return;

    console.log(`[WorldSim] Simulando ${daysPassed} dias de mundo autônomo...`);

    // 1. ECONOMY & PRODUCTION
    this.simulateEconomyAndProduction(daysPassed);

    // 2. CITY GROWTH / DECAY
    this.simulateCities(daysPassed);

    // 3. TRADE ROUTES & MERCHANTS
    this.simulateTradeRoutes(daysPassed);

    // 4. WARS, POLITICS, EVENTS
    this.simulateGeopolitics(daysPassed);

    // 5. HARVESTS, DISEASES, WEATHER IMPACT
    this.simulateNaturalCycles(daysPassed);

    // 6. INDEPENDENT ADVENTURERS (if manager exists)
    if (window.adventurersManager) {
      window.adventurersManager.simulateAdventurerActions(daysPassed);
    }

    // 7. NPC ROUTINES (if available)
    if (window.npcRoutineManager) {
      window.npcRoutineManager.advanceTime(daysPassed * 24);
    }

    this.lastSimulatedDay = currentTotalDays;

    // Record major autonomous event occasionally
    if (Math.random() < 0.18 && window.ui) {
      const event = this.generateAutonomousEvent();
      this.globalEventsLog.unshift(event);
      if (window.ui) window.ui.showToast(`🌍 ${event.title}`, "info");
    }

    if (window.ui) window.ui.updateAllPanels();
  }

  simulateEconomyAndProduction(daysPassed) {
    Object.keys(this.cityStates).forEach(locId => {
      const state = this.cityStates[locId];
      if (!state.production) state.production = this.getBaseProduction(locId);

      // Daily production increase (world lives)
      Object.keys(state.production).forEach(resource => {
        let dailyYield = state.production[resource] * (state.prosperity / 100);
        if (window.economyManager) {
          // Inject into global economy
          if (!window.economyManager.regionalScarcity[locId]) window.economyManager.regionalScarcity[locId] = {};
          const scarcity = window.economyManager.regionalScarcity[locId][resource] || 1.0;
          // Lower scarcity = more supply = lower prices
          if (dailyYield > 40) {
            window.economyManager.regionalScarcity[locId][resource] = Math.max(0.6, scarcity * 0.97);
          }
        }
      });

      // Prosperity fluctuation
      if (Math.random() < 0.3) {
        state.prosperity = Math.max(15, Math.min(95, state.prosperity + (Math.random() * 4 - 2)));
      }
    });
  }

  simulateCities(daysPassed) {
    Object.keys(this.cityStates).forEach(locId => {
      const state = this.cityStates[locId];
      const popChange = Math.floor((state.prosperity - 50) / 12) * daysPassed;
      state.population = Math.max(40, state.population + popChange);

      // Decay if war or plague
      if (window.flagsManager && window.flagsManager.getFlag("flag_qualquer_guerra_ativa")) {
        state.prosperity = Math.max(10, state.prosperity - 1.2 * daysPassed);
      }
    });
  }

  simulateTradeRoutes(daysPassed) {
    this.tradeRoutes.forEach(route => {
      if (!route.active) return;

      route.lastTrade += daysPassed;

      if (route.lastTrade >= 4) { // Every ~4 days a trade happens
        route.lastTrade = 0;

        // Simulate merchant movement
        const risk = Math.random();
        if (risk < 0.08 && window.eventsEngine) {
          // Ambush possible
          const eventMsg = `Rota comercial de ${route.from} → ${route.to} foi atacada por bandidos!`;
          this.globalEventsLog.unshift({ timestamp: Date.now(), title: "Assalto na Rota", desc: eventMsg });
          if (window.discoveryManager && window.discoveryManager.isDiscovered('location', route.from)) {
            window.ui?.showToast("🚨 " + eventMsg, "warning");
          }
        } else {
          // Successful trade: affects prices slightly
          if (window.economyManager) {
            window.economyManager.inflationRate = Math.max(0.85, window.economyManager.inflationRate - 0.015);
          }
        }
      }
    });
  }

  simulateGeopolitics(daysPassed) {
    // Kingdoms already do some simulation, we enhance it
    if (window.kingdomsManager) {
      window.kingdomsManager.processWorldSimulation(daysPassed);
    }

    // Random political shifts
    if (Math.random() < 0.07) {
      const kingdoms = window.kingdomsManager ? window.kingdomsManager.getAllKingdoms() : [];
      if (kingdoms.length > 1) {
        const k = kingdoms[Math.floor(Math.random() * kingdoms.length)];
        if (k) {
          k.corruption = Math.min(100, k.corruption + (Math.random() * 3 - 1));
        }
      }
    }
  }

  simulateNaturalCycles(daysPassed) {
    const season = (window.calendarManager && typeof window.calendarManager.getSeason === "function") 
      ? window.calendarManager.getSeason() 
      : "Primavera";

    Object.keys(this.cityStates).forEach(locId => {
      const state = this.cityStates[locId];
      if (season === "Inverno") {
        state.prosperity = Math.max(12, state.prosperity - 1.5 * daysPassed);
      } else if (season === "Outono" || season === "Primavera") {
        // Harvest boost
        if (!this.harvestData[locId]) this.harvestData[locId] = 0;
        this.harvestData[locId] += daysPassed * 1.8;
        if (this.harvestData[locId] > 40) {
          state.prosperity = Math.min(92, state.prosperity + 3);
          this.harvestData[locId] = 0;
        }
      }
    });

    // Disease spread
    if (Math.random() < 0.035) {
      const plagueLoc = Object.keys(this.cityStates)[Math.floor(Math.random() * Object.keys(this.cityStates).length)];
      if (!this.activePlagues.find(p => p.loc === plagueLoc)) {
        this.activePlagues.push({ loc: plagueLoc, severity: 18 + Math.random() * 25, days: 0 });
        if (window.discoveryManager && window.discoveryManager.isDiscovered('location', plagueLoc)) {
          window.ui?.showToast("⚠️ Uma doença misteriosa se espalha em " + plagueLoc, "warning");
        }
      }
    }

    // Resolve plagues
    this.activePlagues = this.activePlagues.filter(p => {
      p.days += daysPassed;
      p.severity -= daysPassed * 1.2;
      if (p.severity < 5) return false;
      if (this.cityStates[p.loc]) {
        this.cityStates[p.loc].prosperity = Math.max(8, this.cityStates[p.loc].prosperity - 1.5);
      }
      return true;
    });
  }

  generateAutonomousEvent() {
    const events = [
      { title: "Colheita Abundante em Eldor", desc: "Os celeiros de Eldor transbordam. Preços de ração caem." },
      { title: "Revolta em uma Aldeia de Fronteira", desc: "Camponeses se rebelam contra impostos. O mundo reage." },
      { title: "Mercador de Solgard Descobre Atalho", desc: "Nova rota comercial é estabelecida secretamente." },
      { title: "Uma Guilda Perde um Líder", desc: "A Guilda do Corvo elege novo mestre. Mudanças de poder." },
      { title: "Dragão Jovem Avistado", desc: "Um filhote selvagem foi visto nos Picos." }
    ];
    return events[Math.floor(Math.random() * events.length)];
  }

  getCityState(locId) {
    return this.cityStates[locId] || { population: 120, prosperity: 40, production: {} };
  }

  // Expose info for quests / NPC / price calculations
  getResourcePriceModifier(resource, locId) {
    const state = this.cityStates[locId];
    if (!state) return 1.0;
    const prod = state.production[resource] || 10;
    return Math.max(0.6, Math.min(2.4, 1.6 - (prod / 55)));
  }

  exportData() {
    return {
      lastSimulatedDay: this.lastSimulatedDay,
      globalEventsLog: this.globalEventsLog.slice(0, 25),
      cityStates: this.cityStates,
      tradeRoutes: this.tradeRoutes,
      activePlagues: this.activePlagues,
      harvestData: this.harvestData
    };
  }
}

window.worldSimulationManager = new WorldSimulationManager();