/**
 * Crônica de Aethelgard - Aventureiros Independentes (adventurers_manager.js)
 * Outros aventureiros vivem, morrem, ganham fama e podem cruzar o caminho do jogador.
 */

class AdventurersManager {
  constructor() {
    this.independentAdventurers = [];
    this.legends = []; // those who became legends
  }

  init(savedData = null) {
    if (savedData && savedData.independentAdventurers) {
      this.independentAdventurers = savedData.independentAdventurers;
      this.legends = savedData.legends || [];
    } else {
      this.seedAdventurers();
    }
  }

  seedAdventurers() {
    this.independentAdventurers = [
      {
        id: "adv_karim",
        name: "Karim o Errante",
        class: "Espadachim",
        level: 3,
        fame: 12,
        gold: 84,
        location: "loc_vale_cinzas",
        status: "alive",
        lastAction: "Explorando ruínas",
        discoveredByPlayer: false
      },
      {
        id: "adv_sylvara",
        name: "Sylvara, Caçadora de Bestas",
        class: "Arqueira",
        level: 5,
        fame: 38,
        gold: 310,
        location: "loc_floresta_lumen",
        status: "alive",
        lastAction: "Caçando lobo-pardo",
        discoveredByPlayer: false
      },
      {
        id: "adv_thorne",
        name: "Thorne, o Mercenário",
        class: "Guerreiro",
        level: 4,
        fame: 19,
        gold: 140,
        location: "loc_eldoria",
        status: "alive",
        lastAction: "Procurando trabalho na taverna",
        discoveredByPlayer: false
      }
    ];
  }

  simulateAdventurerActions(daysPassed) {
    this.independentAdventurers.forEach(adv => {
      if (adv.status !== "alive") return;

      // Random progression
      if (Math.random() < 0.45) {
        adv.level += Math.random() < 0.3 ? 1 : 0;
        adv.fame += Math.floor(Math.random() * 4) + 1;
        adv.gold += Math.floor(Math.random() * 35) + 10;
      }

      // Change location
      if (Math.random() < 0.38) {
        const knownLocs = window.discoveryManager ? window.discoveryManager.getKnownLocations() : ["loc_vale_cinzas"];
        if (knownLocs.length > 0) {
          adv.location = knownLocs[Math.floor(Math.random() * knownLocs.length)];
        }
      }

      // Chance to discover something important
      if (Math.random() < 0.12 && window.discoveryManager) {
        const newLoc = ["loc_ruinas_khaz", "loc_picos_dragao", "loc_cidadela_ferro"][Math.floor(Math.random() * 3)];
        if (!window.discoveryManager.isDiscovered('location', newLoc)) {
          window.discoveryManager.discover('location', newLoc, `${adv.name} encontrou um segredo`);
          adv.lastAction = `Descobriu ${newLoc}`;
          adv.fame += 15;
        }
      }

      // Rare death / retirement
      if (adv.fame > 80 && Math.random() < 0.04) {
        adv.status = "legend";
        this.legends.push({ ...adv, retiredDay: window.calendarManager ? window.calendarManager.getTotalDays() : 1 });
        adv.lastAction = "Tornou-se lenda!";
      }
    });
  }

  getAdventurersAtLocation(locationId) {
    return this.independentAdventurers.filter(a =>
      a.status === "alive" &&
      a.location === locationId &&
      (a.discoveredByPlayer || window.discoveryManager?.isDiscovered('npc', a.id))
    );
  }

  discoverAdventurer(advId) {
    const adv = this.independentAdventurers.find(a => a.id === advId);
    if (adv) {
      adv.discoveredByPlayer = true;
      if (window.discoveryManager) {
        window.discoveryManager.discover('npc', advId, "Encontrado durante exploração");
      }
    }
  }

  getAllLegends() {
    return this.legends;
  }

  exportData() {
    return {
      independentAdventurers: JSON.parse(JSON.stringify(this.independentAdventurers)),
      legends: JSON.parse(JSON.stringify(this.legends))
    };
  }
}

window.adventurersManager = new AdventurersManager();