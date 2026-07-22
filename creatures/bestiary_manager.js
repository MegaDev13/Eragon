/**
 * Crônica de Aethelgard - Gerenciador do Bestiário Mitológico (bestiary_manager.js)
 * Gerencia as 38 criaturas legendárias de todas as mitologias adaptadas para Aethelgard.
 */

class BestiaryManager {
  constructor() {
    this.mythologies = [];
    this.creatures = [];
  }

  init(bestiaryData, savedData = null) {
    if (bestiaryData) {
      if (bestiaryData.mythologies) this.mythologies = bestiaryData.mythologies;
      if (bestiaryData.creatures) this.creatures = bestiaryData.creatures;
    }
  }

  getAllMythologies() {
    return this.mythologies;
  }

  getAllCreatures() {
    return this.creatures;
  }

  getCreatureById(id) {
    return this.creatures.find(c => c.id === id) || null;
  }

  getCreaturesByMythology(mythId) {
    if (!mythId || mythId === "all") return this.creatures;
    return this.creatures.filter(c => c.mythology === mythId);
  }

  getRandomCreatureByMythology(mythId = null) {
    const list = this.getCreaturesByMythology(mythId);
    if (list.length === 0) return this.creatures[0];
    return list[Math.floor(Math.random() * list.length)];
  }
}

window.bestiaryManager = new BestiaryManager();
